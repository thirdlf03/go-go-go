// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace MyGrpcApiTypes {
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

  export type QuerySdk = {
      /** undefined **/
  myapp_GreetingService_connectivityState: InContextSdkMethod<Query['myapp_GreetingService_connectivityState'], Querymyapp_GreetingService_connectivityStateArgs, MeshContext>
  };

  export type MutationSdk = {
      /** サービスが持つメソッドの定義 **/
  myapp_GreetingService_Hello: InContextSdkMethod<Mutation['myapp_GreetingService_Hello'], Mutationmyapp_GreetingService_HelloArgs, MeshContext>,
  /** null **/
  myapp_GreetingService_HelloServerStream: InContextSdkMethod<Mutation['myapp_GreetingService_HelloServerStream'], Mutationmyapp_GreetingService_HelloServerStreamArgs, MeshContext>,
  /** null **/
  myapp_GreetingService_HelloClientStream: InContextSdkMethod<Mutation['myapp_GreetingService_HelloClientStream'], Mutationmyapp_GreetingService_HelloClientStreamArgs, MeshContext>,
  /** null **/
  myapp_GreetingService_HelloBiStreams: InContextSdkMethod<Mutation['myapp_GreetingService_HelloBiStreams'], Mutationmyapp_GreetingService_HelloBiStreamsArgs, MeshContext>
  };

  export type SubscriptionSdk = {
      /** null **/
  myapp_GreetingService_HelloServerStream: InContextSdkMethod<Subscription['myapp_GreetingService_HelloServerStream'], Subscriptionmyapp_GreetingService_HelloServerStreamArgs, MeshContext>,
  /** null **/
  myapp_GreetingService_HelloBiStreams: InContextSdkMethod<Subscription['myapp_GreetingService_HelloBiStreams'], Subscriptionmyapp_GreetingService_HelloBiStreamsArgs, MeshContext>
  };

  export type Context = {
      ["MyGrpcApi"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
