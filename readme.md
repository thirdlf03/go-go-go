read me  
ref https://zenn.dev/hsaki/books/golang-grpc-starting


protoc -I=./api ./api/hello.proto --js_out=import_style=commonjs:./client/generated --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./client/generated