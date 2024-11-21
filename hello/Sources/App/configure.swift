import Vapor
import FluentMySQLDriver
import Fluent
// configures your application
public func configure(_ app: Application) async throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))
    // register routes
    await app.jwt.keys.add(hmac: "hack2", digestAlgorithm: .sha256)
    
    var tls = TLSConfiguration.makeClientConfiguration()
    tls.certificateVerification = .none

    app.databases.use(.mysql(
        hostname: "127.0.0.1",
        username: "root",
        password: "password",
        database: "mydb",
        tlsConfiguration: tls
    ), as: .mysql)
    app.migrations.add(CreateUser())
    try routes(app)
}
