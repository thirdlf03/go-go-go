import { SourceLocation } from 'graphql';

/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/error/GraphQLError.js
 */

declare function GraphQLError(message: string, locations?: ReadonlyArray<SourceLocation>, path?: ReadonlyArray<string | number>, originalError?: Error & {
    extensions?: any;
}, skipStackCapturing?: boolean): void;

export { GraphQLError };
