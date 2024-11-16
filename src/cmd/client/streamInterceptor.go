package main

import (
	"context"
	"io"
	"log"
	"errors"
	"google.golang.org/grpc"
)

func myStreamClientInteceptor1(ctx context.Context, desc * grpc.StreamDesc, cc *grpc.ClientConn, method string, streamer grpc.Streamer, opts ...grpc.CallOption) (grpc.ClientStream, error) {
	log.Println("[pre] my stream client interceptor 1", method)
	stream, err := streamer(ctx, desc, cc, method, opts...)
	return &myClientStreamWrapper{ClientStream: stream}, err
}

type myClientStreamWrapper struct {
	grpc.ClientStream
}

func (s *myClientStreamWrapper) SendMsg(m interface{}) error {
	log.Println("[pre messge] my stream client interceptor 1", m)
	return s.ClientStream.SendMsg(m)
}

func (s *myClientStreamWrapper) RecvMsg(m interface{}) error {
	err := s.ClientStream.RecvMsg(m)

	if !errors.Is(err, io.EOF) {
		log.Println("[post message] my stream client interceptor ", m)
	}
	return err
}

func (s *myClientStreamWrapper) CloseSend() error {
	err := s.ClientStream.CloseSend()

	log.Println("[post] my stream client interceptor 1")
	return err
}