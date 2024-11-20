import Vapor
import Fluent
import JWT

final class Galaxy: Model, Content, @unchecked Sendable {
    // テーブルまたはコレクションの名前
    static let schema = "galaxies"

    // Galaxy の一意の識別子
    @ID(key: .id)
    var id: UUID?

    // 銀河の名前
    @Field(key: "name")
    var name: String

    // 空の Galaxy インスタンスを作成
    init() { }

    // すべてのプロパティが設定された新しい Galaxy インスタンスを作成
    init(id: UUID? = nil, name: String) {
        self.id = id
        self.name = name
    }
}

struct CreateGalaxy: AsyncMigration {
    // Galaxy モデルを格納するためのデータベースの準備
    func prepare(on database: Database) async throws {
        try await database.schema("galaxies")
            .id()
            .field("name", .string)
            .create()
    }

    // 必要に応じて、prepare メソッドで行った変更を元に戻します
    func revert(on database: Database) async throws {
        try await database.schema("galaxies").delete()
    }
}

final class User: Model, Content, @unchecked Sendable {
    static let schema = "users"

    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "name")
    var name: String
    
    @Field(key: "email")
    var email: String
    
    @Field(key: "password")
    var password: String

    init() { }


    init(id: UUID? = nil, email: String, name: String, password: String) {
        self.id = id
        self.email = email
        self.name = name
        self.password = password
    }
}

struct LoginUser: Content{
    var email: String
    var password: String
    
    init(email: String, password: String){
        self.email = email
        self.password = password
    }
}

struct CreateUser: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema("users")
            .id()
            .field("email", .string)
            .field("name", .string)
            .field("password", .string)
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema("users").delete()
    }
}

struct Response: Content{
    let token: String
}

struct TestPayload: JWTPayload{
    enum CodingKeys: String, CodingKey {
        case subject = "sub"
        case expiration = "exp"
    }
    
    var subject: SubjectClaim
    
    var expiration: ExpirationClaim
    
    func verify(using algorithm: some JWTAlgorithm) async throws{
        try self.expiration.verifyNotExpired()
    }
}

func routes(_ app: Application) throws {
    app.get("check") { req async throws -> HTTPStatus in
        do {
            let payload = try await req.jwt.verify(as: TestPayload.self)
            return .ok
        } catch {
            req.logger.error("JWT認証失敗: \(error.localizedDescription)")
            throw Abort(.unauthorized, reason: "JWTの認証に失敗しました")
        }
    }
    
    app.get("login") { req async throws -> Response in
        let request = try req.content.decode(LoginUser.self)
        guard let user = try await User.query(on: req.db).filter(\.$email == request.email).first() else {
            throw Abort(.unauthorized, reason: "ユーザ情報が違います")
        }

        guard try Bcrypt.verify(request.password, created: user.password) else {
            throw Abort(.unauthorized, reason: "ユーザー情報が違います")
        }

        let payload = TestPayload(
            subject: .init(value: user.id!.uuidString),
            expiration: .init(value: .distantFuture)
        )
        
        return try await Response(token: req.jwt.sign(payload))
    }

    
    app.post("register") { req async throws -> Response in
        let request = try req.content.decode(User.self)
        
        if try await User.query(on: req.db)
            .filter(\.$name == request.name)
            .first() != nil {
            throw Abort(.conflict, reason: "すでに登録されてるユーザー名です")
        }
        
        if try await User.query(on: req.db)
            .filter(\.$email == request.email)
            .first() != nil {
            throw Abort(.conflict, reason: "すでに登録されてるメールアドレスです")
        }
        
        let hashPassword = try Bcrypt.hash(request.password)
        
        let user = User(email: request.email, name: request.name, password: hashPassword)
        try await user.save(on: req.db)
        
        let payload = TestPayload(
            subject: .init(value: user.id!.uuidString),
            expiration: .init(value: .distantFuture)
        )
        return try await Response(token: req.jwt.sign(payload))
    }
}




