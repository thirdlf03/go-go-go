package main

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	hellopb "mygrpc/pkg/grpc"
	"os"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
	"google.golang.org/grpc/credentials/insecure"
	_ "google.golang.org/genproto/googleapis/rpc/errdetails"
)

var (
	scanner *bufio.Scanner
	client hellopb.GreetingServiceClient
)

func main() {
	fmt.Println("Hello, gRPC client!")

	scanner = bufio.NewScanner(os.Stdin)

	address := "localhost:8080"

	conn, err := grpc.Dial(
		address,
		grpc.WithStreamInterceptor(myStreamClientInteceptor1),

		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
		return
	}
	defer conn.Close()

	client = hellopb.NewGreetingServiceClient(conn)

	for {
		fmt.Println("1: send Request")
		fmt.Println("2: HelloServerStream")
		fmt.Println("3: HelloClientStream")
		fmt.Println("4: HelloBiStreams")
		fmt.Println("5: exit")
		fmt.Print("plaase enter > ")

		scanner.Scan()
		in := scanner.Text()

		switch in {
			case "1":
				Hello()
			case "2":
				HelloServerStream()
			case "3":
				HelloClientStream()
			case "4":
				HelloBiStreams()
			case "5":
				fmt.Println("bye.")
				goto M
		}
	}
M:
}

func Hello(){
	fmt.Println("Please enter your name.")
	scanner.Scan()
	name := scanner.Text()

	req := &hellopb.HelloRequest{
		Name: name,
	}
	res, err := client.Hello(context.Background(), req)
	if err != nil {
		if stat, ok := status.FromError(err); ok {
			fmt.Println(stat.Code())
			fmt.Println(stat.Message())
			fmt.Printf("details: %s\n", stat.Details())
		} else{
			fmt.Println(err)
		}
	} else {
		fmt.Println(res.GetMessage())
	}
}

func HelloServerStream(){
	fmt.Println("Please enter your name.")
	scanner.Scan()
	name := scanner.Text()

	req := &hellopb.HelloRequest{
		Name: name,
	}
	stream, err := client.HelloServerStream(context.Background(), req)
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		res, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			fmt.Println("all th respon")
			break
		}

		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(res)
	}
}

func HelloClientStream(){
	stream, err := client.HelloClientStream(context.Background())
	if err != nil {
		fmt.Println(err)
		return
	}

	sendCount := 5
	fmt.Printf("Please enter %d names.\n", sendCount)
	for i := 0; i < sendCount; i++ {
		scanner.Scan()
		name := scanner.Text()

		if err := stream.Send(&hellopb.HelloRequest{
			Name: name,
		}); err != nil {
			fmt.Println(err)
			return
		}
	}

	res, err := stream.CloseAndRecv()
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(res.GetMessage())
	}
}

func HelloBiStreams() {
	stream, err := client.HelloBiStreams(context.Background())
	if err != nil {
		fmt.Println(err)
		return
	}

	sendNum := 5
	fmt.Printf("Please enter %d names.\n", sendNum)

	var sendEnd, recvEnd bool
	sendCount := 0
	for !(sendEnd && recvEnd){
		if !sendEnd {
			scanner.Scan()
			name := scanner.Text()

			sendCount++
			if err := stream.Send(&hellopb.HelloRequest{
				Name: name,
			}); err != nil {
				fmt.Println(err)
				sendEnd = true
			}

			if sendCount == sendNum {
				sendEnd = true
				if err := stream.CloseSend(); err != nil {
					fmt.Println(err)
				}
			}
		}

		// 受信処理
		if !recvEnd {
			if res, err := stream.Recv(); err != nil {
				if !errors.Is(err, io.EOF) {
					fmt.Println(err)
				}
				recvEnd = true
			} else {
				fmt.Println(res.GetMessage())
			}
		}
	}

}