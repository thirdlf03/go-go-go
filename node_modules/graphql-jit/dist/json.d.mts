import { Schema } from 'fast-json-stringify';
import { C as CompilationContext } from './index-CXU9YFKv.mjs';
import '@graphql-typed-document-node/core';
import 'graphql';
import 'graphql/execution/execute.js';
import './types.mjs';
import './error.mjs';
import './resolve-info.mjs';
import './variables.mjs';

/**
 * GQL -> JSON Schema transform
 *
 * @param compilationContext
 * @return     {object}  A plain JavaScript object which conforms to JSON Schema
 */
declare function queryToJSONSchema(compilationContext: CompilationContext): Schema;

export { queryToJSONSchema };
