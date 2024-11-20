read me  
ref https://zenn.dev/hsaki/books/golang-grpc-starting


protoc -I=./api ./api/hello.proto --js_out=import_style=commonjs:./client/generated --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./client/generated


go get -u gorm.io/gorm  
go get -u gorm.io/driver/mysql  
go get -u gorm.io/gen

docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:latest  

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';  
