// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { findAndParseConfig } from '@graphql-mesh/cli';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { VaporApiTypes } from './sources/VaporApi/types';
import type { GrpcApiTypes } from './sources/GrpcApi/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: { input: string; output: string; }
  /** The `Boolean` scalar type represents `true` or `false`. */
  Boolean: { input: boolean; output: boolean; }
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Define the GetTodosRequest message */
  myapp__GetTodosRequest_Input: { input: any; output: any; }
  File: { input: any; output: any; }
  ObjMap: { input: any; output: any; }
  TransportOptions: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: string; output: string; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: string; output: string; }
};

export type Query = {
  myapp_GreetingService_GetTodos?: Maybe<myapp__GetTodosResponse>;
  myapp_GreetingService_connectivityState?: Maybe<ConnectivityState>;
  /** Verify the validity of the provided JWT token. */
  check?: Maybe<Scalars['JSON']['output']>;
};


export type Querymyapp_GreetingService_GetTodosArgs = {
  input?: InputMaybe<Scalars['myapp__GetTodosRequest_Input']['input']>;
};


export type Querymyapp_GreetingService_connectivityStateArgs = {
  tryToConnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Mutation = {
  /** サービスが持つメソッドの定義 */
  myapp_GreetingService_Hello?: Maybe<myapp__HelloResponse>;
  myapp_GreetingService_HelloServerStream?: Maybe<Array<Maybe<myapp__HelloResponse>>>;
  myapp_GreetingService_HelloClientStream?: Maybe<myapp__HelloResponse>;
  myapp_GreetingService_HelloBiStreams?: Maybe<Array<Maybe<myapp__HelloResponse>>>;
  myapp_GreetingService_CreateTodo?: Maybe<myapp__CreateTodoResponse>;
  myapp_GreetingService_UpdateTodo?: Maybe<myapp__UpdateTodoResponse>;
  myapp_GreetingService_DeleteTodo?: Maybe<myapp__DeleteTodoResponse>;
  /** Authenticate a user and return a JWT token. */
  post_login?: Maybe<Response>;
  /** Register a new user and return a JWT token. */
  post_register?: Maybe<Response>;
};


export type Mutationmyapp_GreetingService_HelloArgs = {
  input?: InputMaybe<myapp__HelloRequest_Input>;
};


export type Mutationmyapp_GreetingService_HelloServerStreamArgs = {
  input?: InputMaybe<myapp__HelloRequest_Input>;
};


export type Mutationmyapp_GreetingService_HelloClientStreamArgs = {
  input?: InputMaybe<Scalars['File']['input']>;
};


export type Mutationmyapp_GreetingService_HelloBiStreamsArgs = {
  input?: InputMaybe<Scalars['File']['input']>;
};


export type Mutationmyapp_GreetingService_CreateTodoArgs = {
  input?: InputMaybe<myapp__CreateTodoRequest_Input>;
};


export type Mutationmyapp_GreetingService_UpdateTodoArgs = {
  input?: InputMaybe<myapp__UpdateTodoRequest_Input>;
};


export type Mutationmyapp_GreetingService_DeleteTodoArgs = {
  input?: InputMaybe<myapp__DeleteTodoRequest_Input>;
};


export type Mutationpost_loginArgs = {
  input?: InputMaybe<LoginUser_Input>;
};


export type Mutationpost_registerArgs = {
  input?: InputMaybe<User_Input>;
};

export type Subscription = {
  myapp_GreetingService_HelloServerStream?: Maybe<myapp__HelloResponse>;
  myapp_GreetingService_HelloBiStreams?: Maybe<myapp__HelloResponse>;
};


export type Subscriptionmyapp_GreetingService_HelloServerStreamArgs = {
  input?: InputMaybe<myapp__HelloRequest_Input>;
};


export type Subscriptionmyapp_GreetingService_HelloBiStreamsArgs = {
  input?: InputMaybe<Scalars['File']['input']>;
};

/** Define the GetTodosResponse message */
export type myapp__GetTodosResponse = {
  todos?: Maybe<Array<Maybe<myapp__Todo>>>;
};

export type myapp__Todo = {
  id?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  completed?: Maybe<Scalars['Boolean']['output']>;
};

export type ConnectivityState =
  | 'IDLE'
  | 'CONNECTING'
  | 'READY'
  | 'TRANSIENT_FAILURE'
  | 'SHUTDOWN';

export type myapp__HelloResponse = {
  message?: Maybe<Scalars['String']['output']>;
};

/** 型の定義 */
export type myapp__HelloRequest_Input = {
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Define the CreateTodoResponse message */
export type myapp__CreateTodoResponse = {
  todo?: Maybe<myapp__Todo>;
};

/** Define the CreateTodoRequest message */
export type myapp__CreateTodoRequest_Input = {
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
};

/** Define the UpdateTodoResponse message */
export type myapp__UpdateTodoResponse = {
  todo?: Maybe<myapp__Todo>;
};

/** Define the UpdateTodoRequest message */
export type myapp__UpdateTodoRequest_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Define the DeleteTodoResponse message */
export type myapp__DeleteTodoResponse = {
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Define the DeleteTodoRequest message */
export type myapp__DeleteTodoRequest_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Response = {
  /** JWT token issued to the user. */
  token?: Maybe<Scalars['String']['output']>;
};

export type LoginUser_Input = {
  /** Email address of the user. */
  email: Scalars['EmailAddress']['input'];
  /** Plain text password of the user. */
  password: Scalars['String']['input'];
};

export type User_Input = {
  /** Unique identifier for the user. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Email address of the user. */
  email: Scalars['EmailAddress']['input'];
  /** Name of the user. */
  name: Scalars['String']['input'];
  /** Hashed password of the user. */
  password: Scalars['String']['input'];
};

export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  myapp__GetTodosResponse: ResolverTypeWrapper<myapp__GetTodosResponse>;
  myapp__Todo: ResolverTypeWrapper<myapp__Todo>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  myapp__GetTodosRequest_Input: ResolverTypeWrapper<Scalars['myapp__GetTodosRequest_Input']['output']>;
  ConnectivityState: ConnectivityState;
  myapp__HelloResponse: ResolverTypeWrapper<myapp__HelloResponse>;
  myapp__HelloRequest_Input: myapp__HelloRequest_Input;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  myapp__CreateTodoResponse: ResolverTypeWrapper<myapp__CreateTodoResponse>;
  myapp__CreateTodoRequest_Input: myapp__CreateTodoRequest_Input;
  myapp__UpdateTodoResponse: ResolverTypeWrapper<myapp__UpdateTodoResponse>;
  myapp__UpdateTodoRequest_Input: myapp__UpdateTodoRequest_Input;
  myapp__DeleteTodoResponse: ResolverTypeWrapper<myapp__DeleteTodoResponse>;
  myapp__DeleteTodoRequest_Input: myapp__DeleteTodoRequest_Input;
  ObjMap: ResolverTypeWrapper<Scalars['ObjMap']['output']>;
  TransportOptions: ResolverTypeWrapper<Scalars['TransportOptions']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Response: ResolverTypeWrapper<Response>;
  LoginUser_Input: LoginUser_Input;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']['output']>;
  User_Input: User_Input;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  HTTPMethod: HTTPMethod;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  Subscription: {};
  myapp__GetTodosResponse: myapp__GetTodosResponse;
  myapp__Todo: myapp__Todo;
  Int: Scalars['Int']['output'];
  String: Scalars['String']['output'];
  Boolean: Scalars['Boolean']['output'];
  myapp__GetTodosRequest_Input: Scalars['myapp__GetTodosRequest_Input']['output'];
  myapp__HelloResponse: myapp__HelloResponse;
  myapp__HelloRequest_Input: myapp__HelloRequest_Input;
  File: Scalars['File']['output'];
  myapp__CreateTodoResponse: myapp__CreateTodoResponse;
  myapp__CreateTodoRequest_Input: myapp__CreateTodoRequest_Input;
  myapp__UpdateTodoResponse: myapp__UpdateTodoResponse;
  myapp__UpdateTodoRequest_Input: myapp__UpdateTodoRequest_Input;
  myapp__DeleteTodoResponse: myapp__DeleteTodoResponse;
  myapp__DeleteTodoRequest_Input: myapp__DeleteTodoRequest_Input;
  ObjMap: Scalars['ObjMap']['output'];
  TransportOptions: Scalars['TransportOptions']['output'];
  JSON: Scalars['JSON']['output'];
  Response: Response;
  LoginUser_Input: LoginUser_Input;
  EmailAddress: Scalars['EmailAddress']['output'];
  User_Input: User_Input;
  UUID: Scalars['UUID']['output'];
}>;

export type grpcMethodDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  rootJsonName?: Maybe<Scalars['String']['input']>;
  objPath?: Maybe<Scalars['String']['input']>;
  methodName?: Maybe<Scalars['String']['input']>;
  responseStream?: Maybe<Scalars['Boolean']['input']>;
};

export type grpcMethodDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = grpcMethodDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type grpcConnectivityStateDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  rootJsonName?: Maybe<Scalars['String']['input']>;
  objPath?: Maybe<Scalars['String']['input']>;
};

export type grpcConnectivityStateDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = grpcConnectivityStateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type grpcRootJsonDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  name?: Maybe<Scalars['String']['input']>;
  rootJson?: Maybe<Scalars['ObjMap']['input']>;
  loadOptions?: Maybe<Scalars['ObjMap']['input']>;
};

export type grpcRootJsonDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = grpcRootJsonDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type streamDirectiveArgs = {
  if?: Scalars['Boolean']['input'];
  label?: Maybe<Scalars['String']['input']>;
  initialCount?: Maybe<Scalars['Int']['input']>;
};

export type streamDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = streamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type transportDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  kind?: Maybe<Scalars['String']['input']>;
  location?: Maybe<Scalars['String']['input']>;
  options?: Maybe<Scalars['TransportOptions']['input']>;
  headers?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']['input']>>>>>;
  queryStringOptions?: Maybe<Scalars['ObjMap']['input']>;
  queryParams?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']['input']>>>>>;
};

export type transportDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = transportDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type httpOperationDirectiveArgs = {
  subgraph?: Maybe<Scalars['String']['input']>;
  path?: Maybe<Scalars['String']['input']>;
  operationSpecificHeaders?: Maybe<Array<Maybe<Array<Maybe<Scalars['String']['input']>>>>>;
  httpMethod?: Maybe<HTTPMethod>;
  isBinary?: Maybe<Scalars['Boolean']['input']>;
  requestBaseBody?: Maybe<Scalars['ObjMap']['input']>;
  queryParamArgMap?: Maybe<Scalars['ObjMap']['input']>;
  queryStringOptionsByParam?: Maybe<Scalars['ObjMap']['input']>;
  jsonApiFields?: Maybe<Scalars['Boolean']['input']>;
  queryStringOptions?: Maybe<Scalars['ObjMap']['input']>;
};

export type httpOperationDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = httpOperationDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  myapp_GreetingService_GetTodos?: Resolver<Maybe<ResolversTypes['myapp__GetTodosResponse']>, ParentType, ContextType, Partial<Querymyapp_GreetingService_GetTodosArgs>>;
  myapp_GreetingService_connectivityState?: Resolver<Maybe<ResolversTypes['ConnectivityState']>, ParentType, ContextType, Partial<Querymyapp_GreetingService_connectivityStateArgs>>;
  check?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  myapp_GreetingService_Hello?: Resolver<Maybe<ResolversTypes['myapp__HelloResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloArgs>>;
  myapp_GreetingService_HelloServerStream?: Resolver<Maybe<Array<Maybe<ResolversTypes['myapp__HelloResponse']>>>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloServerStreamArgs>>;
  myapp_GreetingService_HelloClientStream?: Resolver<Maybe<ResolversTypes['myapp__HelloResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloClientStreamArgs>>;
  myapp_GreetingService_HelloBiStreams?: Resolver<Maybe<Array<Maybe<ResolversTypes['myapp__HelloResponse']>>>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloBiStreamsArgs>>;
  myapp_GreetingService_CreateTodo?: Resolver<Maybe<ResolversTypes['myapp__CreateTodoResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_CreateTodoArgs>>;
  myapp_GreetingService_UpdateTodo?: Resolver<Maybe<ResolversTypes['myapp__UpdateTodoResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_UpdateTodoArgs>>;
  myapp_GreetingService_DeleteTodo?: Resolver<Maybe<ResolversTypes['myapp__DeleteTodoResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_DeleteTodoArgs>>;
  post_login?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<Mutationpost_loginArgs>>;
  post_register?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<Mutationpost_registerArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  myapp_GreetingService_HelloServerStream?: SubscriptionResolver<Maybe<ResolversTypes['myapp__HelloResponse']>, "myapp_GreetingService_HelloServerStream", ParentType, ContextType, Partial<Subscriptionmyapp_GreetingService_HelloServerStreamArgs>>;
  myapp_GreetingService_HelloBiStreams?: SubscriptionResolver<Maybe<ResolversTypes['myapp__HelloResponse']>, "myapp_GreetingService_HelloBiStreams", ParentType, ContextType, Partial<Subscriptionmyapp_GreetingService_HelloBiStreamsArgs>>;
}>;

export type myapp__GetTodosResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__GetTodosResponse'] = ResolversParentTypes['myapp__GetTodosResponse']> = ResolversObject<{
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['myapp__Todo']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type myapp__TodoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__Todo'] = ResolversParentTypes['myapp__Todo']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface myapp__GetTodosRequest_InputScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['myapp__GetTodosRequest_Input'], any> {
  name: 'myapp__GetTodosRequest_Input';
}

export type myapp__HelloResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__HelloResponse'] = ResolversParentTypes['myapp__HelloResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type myapp__CreateTodoResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__CreateTodoResponse'] = ResolversParentTypes['myapp__CreateTodoResponse']> = ResolversObject<{
  todo?: Resolver<Maybe<ResolversTypes['myapp__Todo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type myapp__UpdateTodoResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__UpdateTodoResponse'] = ResolversParentTypes['myapp__UpdateTodoResponse']> = ResolversObject<{
  todo?: Resolver<Maybe<ResolversTypes['myapp__Todo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type myapp__DeleteTodoResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__DeleteTodoResponse'] = ResolversParentTypes['myapp__DeleteTodoResponse']> = ResolversObject<{
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface ObjMapScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjMap'], any> {
  name: 'ObjMap';
}

export interface TransportOptionsScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TransportOptions'], any> {
  name: 'TransportOptions';
}

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type ResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface EmailAddressScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface UUIDScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  myapp__GetTodosResponse?: myapp__GetTodosResponseResolvers<ContextType>;
  myapp__Todo?: myapp__TodoResolvers<ContextType>;
  myapp__GetTodosRequest_Input?: GraphQLScalarType;
  myapp__HelloResponse?: myapp__HelloResponseResolvers<ContextType>;
  File?: GraphQLScalarType;
  myapp__CreateTodoResponse?: myapp__CreateTodoResponseResolvers<ContextType>;
  myapp__UpdateTodoResponse?: myapp__UpdateTodoResponseResolvers<ContextType>;
  myapp__DeleteTodoResponse?: myapp__DeleteTodoResponseResolvers<ContextType>;
  ObjMap?: GraphQLScalarType;
  TransportOptions?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Response?: ResponseResolvers<ContextType>;
  EmailAddress?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  grpcMethod?: grpcMethodDirectiveResolver<any, any, ContextType>;
  grpcConnectivityState?: grpcConnectivityStateDirectiveResolver<any, any, ContextType>;
  grpcRootJson?: grpcRootJsonDirectiveResolver<any, any, ContextType>;
  stream?: streamDirectiveResolver<any, any, ContextType>;
  transport?: transportDirectiveResolver<any, any, ContextType>;
  httpOperation?: httpOperationDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = GrpcApiTypes.Context & VaporApiTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export function getMeshOptions() {
  console.warn('WARNING: These artifacts are built for development mode. Please run "mesh build" to build production artifacts');
  return findAndParseConfig({
    dir: baseDir,
    artifactsDir: ".mesh",
    configName: "mesh",
    additionalPackagePrefixes: [],
    initialLoggerPrefix: "🕸️  Mesh",
  });
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: undefined,
  })
}

let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));