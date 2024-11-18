import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLError, GraphQLFieldResolver, GraphQLTypeResolver, GraphQLIsTypeOfFn, ExecutionResult, GraphQLSchema, DocumentNode, GraphQLObjectType, GraphQLOutputType, FieldNode, OperationDefinitionNode, GraphQLFormattedError, ASTNode, GraphQLField, SelectionSetNode, GraphQLDirective, DirectiveNode, ValueNode, GraphQLInputType, SourceLocation, VariableNode, GraphQLArgument, ArgumentNode } from 'graphql';
import { ExecutionContext as ExecutionContext$1 } from 'graphql/execution/execute.js';
import { Maybe } from './types.mjs';
import { GraphQLError as GraphQLError$1 } from './error.mjs';
import { ResolveInfoEnricherInput } from './resolve-info.mjs';
import { CoercedVariableValues } from './variables.mjs';

type NullTrimmer = (data: any, errors: GraphQLError[]) => any;
/**
 *
 * @param {CompilationContext} compilationContext
 * @returns {(data: any, errors: GraphQLError[]) => {data: any; errors: GraphQLError[]}}
 */
declare function createNullTrimmer(compilationContext: CompilationContext): NullTrimmer;

declare const inspect: (value: any) => string;
interface CompilerOptions {
    customJSONSerializer: boolean;
    disableLeafSerialization: boolean;
    disablingCapturingStackErrors: boolean;
    customSerializers: {
        [key: string]: (v: any) => any;
    };
    resolverInfoEnricher?: (inp: ResolveInfoEnricherInput) => object;
    /**
     * This option is a temporary workaround to rollout and test the new skip/include behavior.
     * It will be removed in the next version along with the old behavior.
     *
     * Set this to true if you face issues with skip/include in fragment spreads.
     *
     * default: false
     *
     * @see https://github.com/zalando-incubator/graphql-jit/pull/197
     *
     */
    useExperimentalPathBasedSkipInclude: boolean;
}
interface ExecutionContext {
    promiseCounter: number;
    data: any;
    errors: GraphQLError[];
    nullErrors: GraphQLError[];
    resolve?: () => void;
    inspect: typeof inspect;
    variables: {
        [key: string]: any;
    };
    context: any;
    rootValue: any;
    safeMap: typeof safeMap;
    GraphQLError: typeof GraphQLError$1;
    resolvers: {
        [key: string]: GraphQLFieldResolver<any, any, any>;
    };
    trimmer: NullTrimmer;
    serializers: {
        [key: string]: (c: ExecutionContext, v: any, onError: (c: ExecutionContext, msg: string) => void) => any;
    };
    typeResolvers: {
        [key: string]: GraphQLTypeResolver<any, any>;
    };
    isTypeOfs: {
        [key: string]: GraphQLIsTypeOfFn<any, any>;
    };
    resolveInfos: {
        [key: string]: any;
    };
}
interface DeferredField {
    name: string;
    responsePath: ObjectPath;
    originPaths: string[];
    originPathsFormatted: string;
    destinationPaths: string[];
    parentType: GraphQLObjectType;
    fieldName: string;
    jsFieldName: string;
    fieldType: GraphQLOutputType;
    fieldNodes: FieldNode[];
    args: Arguments;
}
/**
 * The context used during compilation.
 *
 * It stores deferred nodes to be processed later as well as the function arguments to be bounded at top level
 */
interface CompilationContext extends ExecutionContext$1 {
    resolvers: {
        [key: string]: GraphQLFieldResolver<any, any, any>;
    };
    serializers: {
        [key: string]: (c: ExecutionContext, v: any, onError: (c: ExecutionContext, msg: string) => void) => any;
    };
    hoistedFunctions: string[];
    hoistedFunctionNames: Map<string, number>;
    typeResolvers: {
        [key: string]: GraphQLTypeResolver<any, any>;
    };
    isTypeOfs: {
        [key: string]: GraphQLIsTypeOfFn<any, any>;
    };
    resolveInfos: {
        [key: string]: any;
    };
    deferred: DeferredField[];
    options: CompilerOptions;
    depth: number;
}
declare const GLOBAL_VARIABLES_NAME = "__context.variables";
interface CompiledQuery<TResult = {
    [key: string]: any;
}, TVariables = {
    [key: string]: any;
}> {
    operationName?: string;
    query: (root: any, context: any, variables: Maybe<TVariables>) => Promise<ExecutionResult<TResult>> | ExecutionResult<TResult>;
    subscribe?: (root: any, context: any, variables: Maybe<TVariables>) => Promise<AsyncIterableIterator<ExecutionResult<TResult>> | ExecutionResult<TResult>>;
    stringify: (v: any) => string;
}
/**
 * It compiles a GraphQL query to an executable function
 * @param {GraphQLSchema} schema GraphQL schema
 * @param {DocumentNode} document Query being submitted
 * @param {string} operationName name of the operation
 * @param partialOptions compilation options to tune the compiler features
 * @returns {CompiledQuery} the cacheable result
 */
declare function compileQuery<TResult = {
    [key: string]: any;
}, TVariables = {
    [key: string]: any;
}>(schema: GraphQLSchema, document: TypedDocumentNode<TResult, TVariables>, operationName?: string, partialOptions?: Partial<CompilerOptions>): CompiledQuery<TResult, TVariables> | ExecutionResult<TResult>;
declare function isCompiledQuery<C extends CompiledQuery, E extends ExecutionResult>(query: C | E): query is C;
declare function createBoundQuery(compilationContext: CompilationContext, document: DocumentNode, func: (context: ExecutionContext) => Promise<any> | undefined, getVariableValues: (inputs: {
    [key: string]: any;
}) => CoercedVariableValues, operationName?: string): (rootValue: any, context: any, variables: Maybe<{
    [key: string]: any;
}>) => Promise<ExecutionResult> | ExecutionResult;
/**
 * Implements a generic map operation for any iterable.
 *
 * If the iterable is not valid, null is returned.
 * @param context
 * @param {Iterable<any> | string} iterable possible iterable
 * @param {(a: any) => any} cb callback that receives the item being iterated
 * @param idx
 * @returns {any[]} a new array with the result of the callback
 */
declare function safeMap(context: ExecutionContext, iterable: Iterable<any> | string, cb: (context: ExecutionContext, a: any, index: number, resultArray: any[], ...idx: number[]) => any, ...idx: number[]): any[];
declare function isPromise(value: any): value is Promise<any>;
declare function isPromiseInliner(value: string): string;
declare function isAsyncIterable<T = unknown>(val: unknown): val is AsyncIterableIterator<T>;

/**
 * A helper file to support backward compatibility for different versions of graphql-js.
 */
/**
 * v15 does not have schema.getRootType
 * v16 has both
 * v17 will not have getOperationRootType
 *
 * To support all these 3 versions of graphql-js, at least for migration, this helper
 * would be useful.
 *
 * This can be removed once we drop support for v15.
 *
 * GraphQL v17 would remove getOperationRootType.
 */
declare function getOperationRootType(schema: GraphQLSchema, operation: OperationDefinitionNode): GraphQLObjectType;
/**
 * v16 and lower versions don't have .toJSON method on GraphQLError
 * v17 does have .toJSON and doesn't have "formatError" export anymore
 */
declare function formatError(error: GraphQLError): GraphQLFormattedError;
/**
 * v17 dropped support for positional arguments in GraphQLError constructor
 * https://github.com/graphql/graphql-js/pull/3577
 */
declare function getGraphQLErrorOptions(nodes: Maybe<ReadonlyArray<ASTNode> | ASTNode>): ConstructorParameters<typeof GraphQLError>[1];
/**
 * Resolves the field on the given source object. In particular, this
 * figures out the value that the field returns by calling its resolve function,
 * then calls completeValue to complete promises, serialize scalars, or execute
 * the sub-selection-set for objects.
 *
 * v15 has getFieldDef that accepts field name
 * v16 has getFieldDef that accepts field node
 * v17 drops getFieldDef support and adds getField method
 */
declare function resolveFieldDef(compilationContext: CompilationContext, parentType: GraphQLObjectType, fieldNodes: FieldNode[]): Maybe<GraphQLField<any, any>>;

interface JitFieldNode extends FieldNode {
    /**
     * @deprecated Use __internalShouldIncludePath instead
     * @see __internalShouldIncludePath
     */
    __internalShouldInclude?: string[];
    __internalShouldIncludePath?: {
        [path: string]: string[];
    };
}
interface FieldsAndNodes {
    [key: string]: JitFieldNode[];
}
/**
 * Given a selectionSet, adds all of the fields in that selection to
 * the passed in map of fields, and returns it at the end.
 *
 * CollectFields requires the "runtime type" of an object. For a field which
 * returns an Interface or Union type, the "runtime type" will be the actual
 * Object type returned by that field.
 */
declare function collectFields(compilationContext: CompilationContext, runtimeType: GraphQLObjectType, selectionSet: SelectionSetNode, fields: FieldsAndNodes, visitedFragmentNames: {
    [key: string]: boolean;
}, parentResponsePath?: ObjectPath): FieldsAndNodes;

declare function collectSubfields(compilationContext: CompilationContext, returnType: GraphQLObjectType, fieldNodes: FieldNode[], parentResponsePath?: ObjectPath): {
    [key: string]: FieldNode[];
};
type ResponsePathType = "variable" | "literal" | "meta";
interface ObjectPath {
    prev: ObjectPath | undefined;
    key: string;
    type: ResponsePathType;
}
interface MissingVariablePath {
    valueNode: VariableNode;
    path?: ObjectPath;
    argument?: {
        definition: GraphQLArgument;
        node: ArgumentNode;
    };
}
interface Arguments {
    values: {
        [argument: string]: any;
    };
    missing: MissingVariablePath[];
}
/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
declare function getArgumentDefs(def: GraphQLField<any, any> | GraphQLDirective, node: FieldNode | DirectiveNode): Arguments;
interface ASTValueWithVariables {
    value: object | string | boolean | symbol | number | null | any[];
    variables: MissingVariablePath[];
}
interface ASTValue {
    value: object | string | boolean | symbol | number | null | any[];
}
declare function valueFromAST(valueNode: ValueNode, type: GraphQLInputType): undefined | ASTValue | ASTValueWithVariables;
declare function computeLocations(nodes: ASTNode[]): SourceLocation[];
declare function addPath(responsePath: ObjectPath | undefined, key: string, type?: ResponsePathType): ObjectPath;
declare function flattenPath(path: ObjectPath): Array<{
    key: string;
    type: ResponsePathType;
}>;
/**
 * Serialize a path for use in the skip/include directives.
 *
 * @param path The path to serialize
 * @returns The path serialized as a string, with the root path first.
 */
declare function serializeObjectPathForSkipInclude(path: ObjectPath | undefined): string;
/**
 * join two path segments to a dot notation, handling empty strings
 *
 * @param a path segment
 * @param b path segment
 * @returns combined path in dot notation
 */
declare function joinSkipIncludePath(a: string, b: string): string;

export { type Arguments as A, type CompilationContext as C, type FieldsAndNodes as F, GLOBAL_VARIABLES_NAME as G, type JitFieldNode as J, type NullTrimmer as N, type ObjectPath as O, type CompilerOptions as a, type CompiledQuery as b, createNullTrimmer as c, compileQuery as d, createBoundQuery as e, isPromise as f, isPromiseInliner as g, isAsyncIterable as h, isCompiledQuery as i, getOperationRootType as j, formatError as k, getGraphQLErrorOptions as l, collectFields as m, collectSubfields as n, getArgumentDefs as o, computeLocations as p, addPath as q, resolveFieldDef as r, flattenPath as s, serializeObjectPathForSkipInclude as t, joinSkipIncludePath as u, valueFromAST as v };
