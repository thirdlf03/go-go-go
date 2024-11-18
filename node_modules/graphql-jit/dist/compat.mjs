import {
  versionInfo
} from "graphql";
import * as errorUtilities from "graphql/error/index.js";
import * as utilities from "graphql/utilities/index.js";
import * as execute from "graphql/execution/execute.js";
function getOperationRootType(schema, operation) {
  if (versionInfo.major < 16) {
    return utilities.getOperationRootType(schema, operation);
  }
  const type = schema.getRootType(operation.operation);
  if (!type) {
    throw new Error(`No root type for operation ${operation.operation}`);
  }
  return type;
}
function formatError(error) {
  if (versionInfo.major < 16) {
    return errorUtilities.formatError(error);
  }
  return error.toJSON();
}
function getGraphQLErrorOptions(nodes) {
  if (versionInfo.major < 16) {
    return nodes;
  }
  return { nodes };
}
function resolveFieldDef(compilationContext, parentType, fieldNodes) {
  const fieldNode = fieldNodes[0];
  if (versionInfo.major < 16) {
    const fieldName = fieldNode.name.value;
    return execute.getFieldDef(
      compilationContext.schema,
      parentType,
      fieldName
    );
  }
  if (versionInfo.major < 17) {
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
export {
  formatError,
  getGraphQLErrorOptions,
  getOperationRootType,
  resolveFieldDef
};
//# sourceMappingURL=compat.mjs.map