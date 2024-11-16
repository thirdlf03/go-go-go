package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"

)

func myUnaryClientInteceptor1(ctx context.Context, method string, req, res interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
	fmt.Println("[pre] my unary client interceptor 1", method, req) // リクエスト送信前に割り込ませる前処理
	err := invoker(ctx, method, req, res, cc, opts...) // 本来のリクエスト
	fmt.Println("[post] my unary client interceptor 1", res) // リクエスト送信後に割り込ませる後処理
	return err
}