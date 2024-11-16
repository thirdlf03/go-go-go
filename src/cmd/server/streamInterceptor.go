package main

import (
	"errors"
	"io"
	"log"
	"google.golang.org/grpc"
)

func myStreamServerInterceptor1(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error{
	log.Println("[pre stream] my stream server interceptor 1: ", info.FullMethod)

	err := handler(srv, &myServerStreamWrapper1{ss})

	log.Println("[ post stream] my stream server interceptor 1")
	return err
}

type myServerStreamWrapper1 struct {
	grpc.ServerStream
}

func (s *myServerStreamWrapper1) RecvMsg(m interface{}) error {
	err := s.ServerStream.RecvMsg(m)

	if !errors.Is(err, io.EOF){
		log.Println("[pre message] my stream serer interceptor 1: ", m)
	}
	return err
}

func (s *myServerStreamWrapper1) SendMsg(m interface{}) error {
	log.Println("[post message] my stream server interceptor 1: ", m)
	return s.ServerStream.SendMsg(m)
}