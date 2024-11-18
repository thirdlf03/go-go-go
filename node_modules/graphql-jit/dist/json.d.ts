import { Schema } from 'fast-json-stringify';
import { C as CompilationContext } from './index-BQ3UYbCO.js';
import '@graphql-typed-document-node/core';
import 'graphql';
import 'graphql/execution/execute.js';
import './types.js';
import './error.js';
import './resolve-info.js';
import './variables.js';

/**
 * GQL -> JSON Schema transform
 *
 * @param compilationContext
 * @return     {object}  A plain JavaScript object which conforms to JSON Schema
 */
declare function queryToJSONSchema(compilationContext: CompilationContext): Schema;

export { queryToJSONSchema };
