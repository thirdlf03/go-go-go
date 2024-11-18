// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "hello.proto" (package "myapp", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { GreetingService } from "./hello";
import type { DuplexStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { ClientStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { HelloResponse } from "./hello";
import type { HelloRequest } from "./hello";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * サービスの定義
 *
 * @generated from protobuf service myapp.GreetingService
 */
export interface IGreetingServiceClient {
    /**
     * サービスが持つメソッドの定義
     *
     * @generated from protobuf rpc: Hello(myapp.HelloRequest) returns (myapp.HelloResponse);
     */
    hello(input: HelloRequest, options?: RpcOptions): UnaryCall<HelloRequest, HelloResponse>;
    /**
     * @generated from protobuf rpc: HelloServerStream(myapp.HelloRequest) returns (stream myapp.HelloResponse);
     */
    helloServerStream(input: HelloRequest, options?: RpcOptions): ServerStreamingCall<HelloRequest, HelloResponse>;
    /**
     * @generated from protobuf rpc: HelloClientStream(stream myapp.HelloRequest) returns (myapp.HelloResponse);
     */
    helloClientStream(options?: RpcOptions): ClientStreamingCall<HelloRequest, HelloResponse>;
    /**
     * @generated from protobuf rpc: HelloBiStreams(stream myapp.HelloRequest) returns (stream myapp.HelloResponse);
     */
    helloBiStreams(options?: RpcOptions): DuplexStreamingCall<HelloRequest, HelloResponse>;
}
/**
 * サービスの定義
 *
 * @generated from protobuf service myapp.GreetingService
 */
export class GreetingServiceClient implements IGreetingServiceClient, ServiceInfo {
    typeName = GreetingService.typeName;
    methods = GreetingService.methods;
    options = GreetingService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * サービスが持つメソッドの定義
     *
     * @generated from protobuf rpc: Hello(myapp.HelloRequest) returns (myapp.HelloResponse);
     */
    hello(input: HelloRequest, options?: RpcOptions): UnaryCall<HelloRequest, HelloResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<HelloRequest, HelloResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: HelloServerStream(myapp.HelloRequest) returns (stream myapp.HelloResponse);
     */
    helloServerStream(input: HelloRequest, options?: RpcOptions): ServerStreamingCall<HelloRequest, HelloResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<HelloRequest, HelloResponse>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: HelloClientStream(stream myapp.HelloRequest) returns (myapp.HelloResponse);
     */
    helloClientStream(options?: RpcOptions): ClientStreamingCall<HelloRequest, HelloResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<HelloRequest, HelloResponse>("clientStreaming", this._transport, method, opt);
    }
    /**
     * @generated from protobuf rpc: HelloBiStreams(stream myapp.HelloRequest) returns (stream myapp.HelloResponse);
     */
    helloBiStreams(options?: RpcOptions): DuplexStreamingCall<HelloRequest, HelloResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<HelloRequest, HelloResponse>("duplex", this._transport, method, opt);
    }
}