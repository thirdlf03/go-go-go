/**
 * @fileoverview gRPC-Web generated client stub for myapp
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v5.28.3
// source: hello.proto


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.myapp = require('./hello_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.myapp.GreetingServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.myapp.GreetingServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname.replace(/\/+$/, '');

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.myapp.HelloRequest,
 *   !proto.myapp.HelloResponse>}
 */
const methodDescriptor_GreetingService_Hello = new grpc.web.MethodDescriptor(
  '/myapp.GreetingService/Hello',
  grpc.web.MethodType.UNARY,
  proto.myapp.HelloRequest,
  proto.myapp.HelloResponse,
  /**
   * @param {!proto.myapp.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.myapp.HelloResponse.deserializeBinary
);


/**
 * @param {!proto.myapp.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.myapp.HelloResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.myapp.HelloResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.myapp.GreetingServiceClient.prototype.hello =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/myapp.GreetingService/Hello',
      request,
      metadata || {},
      methodDescriptor_GreetingService_Hello,
      callback);
};


/**
 * @param {!proto.myapp.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.myapp.HelloResponse>}
 *     Promise that resolves to the response
 */
proto.myapp.GreetingServicePromiseClient.prototype.hello =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/myapp.GreetingService/Hello',
      request,
      metadata || {},
      methodDescriptor_GreetingService_Hello);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.myapp.HelloRequest,
 *   !proto.myapp.HelloResponse>}
 */
const methodDescriptor_GreetingService_HelloServerStream = new grpc.web.MethodDescriptor(
  '/myapp.GreetingService/HelloServerStream',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.myapp.HelloRequest,
  proto.myapp.HelloResponse,
  /**
   * @param {!proto.myapp.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.myapp.HelloResponse.deserializeBinary
);


/**
 * @param {!proto.myapp.HelloRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.myapp.HelloResponse>}
 *     The XHR Node Readable Stream
 */
proto.myapp.GreetingServiceClient.prototype.helloServerStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/myapp.GreetingService/HelloServerStream',
      request,
      metadata || {},
      methodDescriptor_GreetingService_HelloServerStream);
};


/**
 * @param {!proto.myapp.HelloRequest} request The request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.myapp.HelloResponse>}
 *     The XHR Node Readable Stream
 */
proto.myapp.GreetingServicePromiseClient.prototype.helloServerStream =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/myapp.GreetingService/HelloServerStream',
      request,
      metadata || {},
      methodDescriptor_GreetingService_HelloServerStream);
};


module.exports = proto.myapp;
