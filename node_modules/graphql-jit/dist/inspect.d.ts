/**
 * Based on https://github.com/graphql/graphql-js/blob/master/src/jsutils/inspect.js
 */
declare const nodejsCustomInspectSymbol: unique symbol;
declare function createInspect(maxArrayLength?: number, maxRecursiveDepth?: number): (value: any) => string;

export { createInspect as default, nodejsCustomInspectSymbol };
