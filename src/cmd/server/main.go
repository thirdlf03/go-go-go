package main

import (
	"context"
	"errors"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/reflection"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"io"
	"log"
	"mygrpc/gen/query"
	hellopb "mygrpc/pkg/grpc"
	"net"
	"os"
	"os/signal"
	"time"
)

type myServer struct {
	hellopb.UnimplementedGreetingServiceServer
}

func connectDB() (*gorm.DB, error) {
	dsn := "root:password@tcp(127.0.0.1:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}

func (s *myServer) Hello(ctx context.Context, req *hellopb.HelloRequest) (*hellopb.HelloResponse, error) {
	userID, ok := ctx.Value("userID").(string)
	if !ok {
		return nil, fmt.Errorf("userID not found")
	}
	log.Println("userID: ", userID)
	db, err := connectDB()
	if err != nil {
		return nil, err
	}
	query.SetDefault(db)
	user, err := query.User.First()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("First user: ID: %x, Email: %s, Name: %s, Password: %s\n", user.ID, *user.Email, *user.Name, *user.Password)

	//stat := status.New(codes.Unknown, "unknown error")
	//stat, _ = stat.WithDetails(&errdetails.DebugInfo{
	//	Detail: "かわいい猫ちゃん",
	//})
	//err := stat.Err()
	//
	//if md, ok := metadata.FromIncomingContext(ctx); ok {
	//	log.Println(md)
	//}
	//headerMD := metadata.New(map[string]string{"type": "unary", "from": "server", "in": "header", "kawaii": "neko"})
	//if err := grpc.SetHeader(ctx, headerMD); err != nil {
	//	return nil, err
	//}
	//
	//trailer := metadata.New(map[string]string{"type": "unary", "from": "server", "in": "trailer", "kawaii": "neko"})
	//if err := grpc.SetTrailer(ctx, trailer); err != nil {
	//	return nil, err
	//}

	return &hellopb.HelloResponse{Message: fmt.Sprintf("Hello, %s!", req.GetName())}, nil
}

func (s *myServer) HelloServerStream(req *hellopb.HelloRequest, stream hellopb.GreetingService_HelloServerStreamServer) error {
	resCount := 5
	for i := 0; i < resCount; i++ {
		if err := stream.Send(&hellopb.HelloResponse{
			Message: fmt.Sprintf("[%d] Hello, %s!", i, req.GetName()),
		}); err != nil {
			return err
		}
		time.Sleep(time.Second * 1)
	}
	return nil
}

func (s *myServer) HelloClientStream(stream hellopb.GreetingService_HelloClientStreamServer) error {
	nameList := make([]string, 0)
	for {
		req, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			message := fmt.Sprintf(("Hello %s"), nameList)
			return stream.SendAndClose(&hellopb.HelloResponse{
				Message: message,
			})
		}
		if err != nil {
			return err
		}
		nameList = append(nameList, req.GetName())
	}
}

func (s *myServer) HelloBiStreams(stream hellopb.GreetingService_HelloBiStreamsServer) error {
	if md, ok := metadata.FromIncomingContext(stream.Context()); ok {
		log.Println(md)
	}
	headerMD := metadata.New(map[string]string{"type": "bistream", "from": "server", "in": "header", "kawaii": "neko"})

	if err := stream.SetHeader(headerMD); err != nil {
		return err
	}

	trailerMD := metadata.New(map[string]string{"type": "bistream", "from": "server", "in": "trailer", "kawaii": "neko"})
	stream.SetTrailer(trailerMD)

	for {
		req, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return err
		}
		message := fmt.Sprintf("Hello, %v!", req.GetName())
		if err := stream.Send(&hellopb.HelloResponse{
			Message: message,
		}); err != nil {
			return err
		}
	}
}

func NewMyServer() *myServer {
	return &myServer{}
}

func main() {
	port := 8081
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer(
		grpc.UnaryInterceptor(myUnaryServerInterceptor1),
	)

	hellopb.RegisterGreetingServiceServer(s, NewMyServer())

	reflection.Register(s)

	go func() {
		log.Printf("start gRPC server port: %v", port)
		s.Serve(listener)
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("stopping gRPC server...")
	s.GracefulStop()
}
