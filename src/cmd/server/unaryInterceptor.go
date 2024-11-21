package main

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"strings"
)

func myUnaryServerInterceptor1(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
	var jwtToken string
	if md, ok := metadata.FromIncomingContext(ctx); ok {
		if authHeaders := md["authorization"]; ok {
			jwtToken = strings.TrimPrefix(authHeaders[0], "Bearer ")
		}
	}

	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte("hack2"), nil
	})
	if err != nil {
		return nil, err
	}

	var userID string
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID = claims["sub"].(string)
	} else {
		return nil, fmt.Errorf("invalid token claims")
	}

	ctx = context.WithValue(ctx, "userID", userID)

	return handler(ctx, req)
}
