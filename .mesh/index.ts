// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { findAndParseConfig } from '@graphql-mesh/cli';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { MyGrpcApiTypes } from './sources/MyGrpcApi/types';
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
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  File: { input: any; output: any; }
  ObjMap: { input: any; output: any; }
  TransportOptions: { input: any; output: any; }
};

export type Query = {
  myapp_GreetingService_connectivityState?: Maybe<ConnectivityState>;
};


export type Querymyapp_GreetingService_connectivityStateArgs = {
  tryToConnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ConnectivityState =
  | 'IDLE'
  | 'CONNECTING'
  | 'READY'
  | 'TRANSIENT_FAILURE'
  | 'SHUTDOWN';

export type Mutation = {
  /** サービスが持つメソッドの定義 */
  myapp_GreetingService_Hello?: Maybe<myapp__HelloResponse>;
  myapp_GreetingService_HelloServerStream?: Maybe<Array<Maybe<myapp__HelloResponse>>>;
  myapp_GreetingService_HelloClientStream?: Maybe<myapp__HelloResponse>;
  myapp_GreetingService_HelloBiStreams?: Maybe<Array<Maybe<myapp__HelloResponse>>>;
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

export type myapp__HelloResponse = {
  message?: Maybe<Scalars['String']['output']>;
};

/** 型の定義 */
export type myapp__HelloRequest_Input = {
  name?: InputMaybe<Scalars['String']['input']>;
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
  ConnectivityState: ConnectivityState;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  myapp__HelloResponse: ResolverTypeWrapper<myapp__HelloResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  myapp__HelloRequest_Input: myapp__HelloRequest_Input;
  File: ResolverTypeWrapper<Scalars['File']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  ObjMap: ResolverTypeWrapper<Scalars['ObjMap']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  TransportOptions: ResolverTypeWrapper<Scalars['TransportOptions']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Boolean: Scalars['Boolean']['output'];
  Mutation: {};
  myapp__HelloResponse: myapp__HelloResponse;
  String: Scalars['String']['output'];
  myapp__HelloRequest_Input: myapp__HelloRequest_Input;
  File: Scalars['File']['output'];
  Subscription: {};
  ObjMap: Scalars['ObjMap']['output'];
  Int: Scalars['Int']['output'];
  TransportOptions: Scalars['TransportOptions']['output'];
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
};

export type transportDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = transportDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  myapp_GreetingService_connectivityState?: Resolver<Maybe<ResolversTypes['ConnectivityState']>, ParentType, ContextType, Partial<Querymyapp_GreetingService_connectivityStateArgs>>;
}>;

export type ConnectivityStateResolvers = { IDLE: 0, CONNECTING: 1, READY: 2, TRANSIENT_FAILURE: 3, SHUTDOWN: 4 };

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  myapp_GreetingService_Hello?: Resolver<Maybe<ResolversTypes['myapp__HelloResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloArgs>>;
  myapp_GreetingService_HelloServerStream?: Resolver<Maybe<Array<Maybe<ResolversTypes['myapp__HelloResponse']>>>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloServerStreamArgs>>;
  myapp_GreetingService_HelloClientStream?: Resolver<Maybe<ResolversTypes['myapp__HelloResponse']>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloClientStreamArgs>>;
  myapp_GreetingService_HelloBiStreams?: Resolver<Maybe<Array<Maybe<ResolversTypes['myapp__HelloResponse']>>>, ParentType, ContextType, Partial<Mutationmyapp_GreetingService_HelloBiStreamsArgs>>;
}>;

export type myapp__HelloResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['myapp__HelloResponse'] = ResolversParentTypes['myapp__HelloResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface FileScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['File'], any> {
  name: 'File';
}

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  myapp_GreetingService_HelloServerStream?: SubscriptionResolver<Maybe<ResolversTypes['myapp__HelloResponse']>, "myapp_GreetingService_HelloServerStream", ParentType, ContextType, Partial<Subscriptionmyapp_GreetingService_HelloServerStreamArgs>>;
  myapp_GreetingService_HelloBiStreams?: SubscriptionResolver<Maybe<ResolversTypes['myapp__HelloResponse']>, "myapp_GreetingService_HelloBiStreams", ParentType, ContextType, Partial<Subscriptionmyapp_GreetingService_HelloBiStreamsArgs>>;
}>;

export interface ObjMapScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjMap'], any> {
  name: 'ObjMap';
}

export interface TransportOptionsScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TransportOptions'], any> {
  name: 'TransportOptions';
}

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  ConnectivityState?: ConnectivityStateResolvers;
  Mutation?: MutationResolvers<ContextType>;
  myapp__HelloResponse?: myapp__HelloResponseResolvers<ContextType>;
  File?: GraphQLScalarType;
  Subscription?: SubscriptionResolvers<ContextType>;
  ObjMap?: GraphQLScalarType;
  TransportOptions?: GraphQLScalarType;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  grpcMethod?: grpcMethodDirectiveResolver<any, any, ContextType>;
  grpcConnectivityState?: grpcConnectivityStateDirectiveResolver<any, any, ContextType>;
  grpcRootJson?: grpcRootJsonDirectiveResolver<any, any, ContextType>;
  stream?: streamDirectiveResolver<any, any, ContextType>;
  transport?: transportDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = MyGrpcApiTypes.Context & BaseMeshContext;


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