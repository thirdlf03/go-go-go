package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"io"
	"errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	hellopb "mygrpc/pkg/grpc"
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
		fmt.Println("3: exit")
		fmt.Print("plaase enter > ")

		scanner.Scan()
		in := scanner.Text()

		switch in {
			case "1":
				Hello()
			case "2":
				HelloServerStream()
			case "3":
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
		fmt.Println(err)
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