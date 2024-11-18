"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var compat_exports = {};
__export(compat_exports, {
  formatError: () => formatError,
  getGraphQLErrorOptions: () => getGraphQLErrorOptions,
  getOperationRootType: () => getOperationRootType,
  resolveFieldDef: () => resolveFieldDef
});
module.exports = __toCommonJS(compat_exports);
var import_graphql = require("graphql");
var errorUtilities = __toESM(require("graphql/error/index.js"));
var utilities = __toESM(require("graphql/utilities/index.js"));
var execute = __toESM(require("graphql/execution/execute.js"));
function getOperationRootType(schema, operation) {
  if (import_graphql.versionInfo.major < 16) {
    return utilities.getOperationRootType(schema, operation);
  }
  const type = schema.getRootType(operation.operation);
  if (!type) {
    throw new Error(`No root type for operation ${operation.operation}`);
  }
  return type;
}
function formatError(error) {
  if (import_graphql.versionInfo.major < 16) {
    return errorUtilities.formatError(error);
  }
  return error.toJSON();
}
function getGraphQLErrorOptions(nodes) {
  if (import_graphql.versionInfo.major < 16) {
    return nodes;
  }
  return { nodes };
}
function resolveFieldDef(compilationContext, parentType, fieldNodes) {
  const fieldNode = fieldNodes[0];
  if (import_graphql.versionInfo.major < 16) {
    const fieldName = fieldNode.name.value;
    return execute.getFieldDef(
      compilationContext.schema,
      parentType,
      fieldName
    );
  }
  if (import_graphql.versionInfo.major < 17) {
    return execute.getFieldDef(
      compilationContext.schema,
      parentType,
      fieldNode
    );
  }
  return compilationContext.schema.getField(
    parentType,
    fieldNode.name.value
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatError,
  getGraphQLErrorOptions,
  getOperationRootType,
  resolveFieldDef
});
//# sourceMappingURL=compat.js.map