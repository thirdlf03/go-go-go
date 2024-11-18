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
var resolve_info_exports = {};
__export(resolve_info_exports, {
  createResolveInfoThunk: () => createResolveInfoThunk,
  fieldExpansionEnricher: () => fieldExpansionEnricher,
  isLeafField: () => isLeafField
});
module.exports = __toCommonJS(resolve_info_exports);
var import_generate = require("./generate");
var import_graphql = require("graphql");
var import_lodash = __toESM(require("lodash.memoize"));
var import_lodash2 = __toESM(require("lodash.mergewith"));
var import_memoize = require("./memoize.js");
const LeafFieldSymbol = Symbol("LeafFieldSymbol");
function createLeafField(props) {
  return {
    [LeafFieldSymbol]: true,
    ...props
  };
}
function isLeafField(obj) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, LeafFieldSymbol);
}
function createResolveInfoThunk({
  schema,
  fragments,
  operation,
  parentType,
  fieldName,
  fieldType,
  fieldNodes
}, enricher) {
  let enrichedInfo = {};
  if (typeof enricher === "function") {
    enrichedInfo = enricher({
      fieldName,
      fieldNodes,
      returnType: fieldType,
      parentType,
      schema,
      fragments,
      operation
    }) || {};
    if (typeof enrichedInfo !== "object" || Array.isArray(enrichedInfo)) {
      enrichedInfo = {};
    }
  }
  const gen = (0, import_generate.genFn)();
  gen(`return function getGraphQLResolveInfo(rootValue, variableValues, path) {
      return {
          fieldName,
          fieldNodes,
          returnType: fieldType,
          parentType,
          path,
          schema,
          fragments,
          rootValue,
          operation,
          variableValues,`);
  Object.keys(enrichedInfo).forEach((key) => {
    gen(`${key}: enrichedInfo["${key}"],
`);
  });
  gen(`};};`);
  return new Function(
    "fieldName",
    "fieldNodes",
    "fieldType",
    "parentType",
    "schema",
    "fragments",
    "operation",
    "enrichedInfo",
    gen.toString()
  ).call(
    null,
    fieldName,
    fieldNodes,
    fieldType,
    parentType,
    schema,
    fragments,
    operation,
    enrichedInfo
  );
}
function fieldExpansionEnricher(input) {
  const { schema, fragments, returnType, fieldNodes } = input;
  const fieldExpansion = {};
  for (const fieldNode of fieldNodes) {
    deepMerge(
      fieldExpansion,
      memoizedExpandFieldNode(schema, fragments, fieldNode, returnType)
    );
  }
  return {
    fieldExpansion
  };
}
const MEMOIZATION = true;
const memoizedGetReturnType = MEMOIZATION ? (0, import_memoize.memoize2)(getReturnType) : getReturnType;
const memoizedHasField = MEMOIZATION ? (0, import_memoize.memoize2)(hasField) : hasField;
const memoizedResolveEndType = MEMOIZATION ? (0, import_lodash.default)(resolveEndType) : resolveEndType;
const memoizedGetPossibleTypes = MEMOIZATION ? (0, import_memoize.memoize2)(getPossibleTypes) : getPossibleTypes;
const memoizedExpandFieldNodeType = MEMOIZATION ? (0, import_memoize.memoize4)(expandFieldNodeType) : expandFieldNodeType;
const memoizedExpandFieldNode = MEMOIZATION ? (0, import_memoize.memoize4)(expandFieldNode) : expandFieldNode;
function expandFieldNode(schema, fragments, node, fieldType) {
  if (node.selectionSet == null) {
    return createLeafField({});
  }
  const typ = memoizedResolveEndType(fieldType);
  const possibleTypes = memoizedGetPossibleTypes(schema, typ);
  const fieldExpansion = {};
  for (const possibleType of possibleTypes) {
    if (!(0, import_graphql.isUnionType)(possibleType)) {
      fieldExpansion[possibleType.name] = memoizedExpandFieldNodeType(
        schema,
        fragments,
        possibleType,
        node.selectionSet
      );
    }
  }
  return fieldExpansion;
}
function expandFieldNodeType(schema, fragments, parentType, selectionSet) {
  const typeExpansion = {};
  for (const selection of selectionSet.selections) {
    if (selection.kind === import_graphql.Kind.FIELD) {
      if (!(0, import_graphql.isUnionType)(parentType) && memoizedHasField(parentType, selection.name.value)) {
        typeExpansion[selection.name.value] = memoizedExpandFieldNode(
          schema,
          fragments,
          selection,
          memoizedGetReturnType(parentType, selection.name.value)
        );
      }
    } else {
      const selectionSet2 = selection.kind === import_graphql.Kind.INLINE_FRAGMENT ? selection.selectionSet : fragments[selection.name.value].selectionSet;
      const nextType = selection.kind === import_graphql.Kind.INLINE_FRAGMENT ? selection.typeCondition ? schema.getType(
        selection.typeCondition.name.value
      ) : parentType : schema.getType(
        fragments[selection.name.value].typeCondition.name.value
      );
      if (nextType === parentType || (0, import_graphql.isAbstractType)(nextType)) {
        deepMerge(
          typeExpansion,
          memoizedExpandFieldNodeType(
            schema,
            fragments,
            parentType,
            selectionSet2
          )
        );
      }
    }
  }
  return typeExpansion;
}
function getPossibleTypes(schema, compositeType) {
  if ((0, import_graphql.isObjectType)(compositeType)) {
    return [compositeType];
  }
  const possibleTypes = [];
  const types = schema.getTypeMap();
  for (const typeName in types) {
    if (Object.prototype.hasOwnProperty.call(types, typeName)) {
      const typ = types[typeName];
      if ((0, import_graphql.isCompositeType)(typ) && (0, import_graphql.doTypesOverlap)(schema, typ, compositeType)) {
        possibleTypes.push(typ);
      }
    }
  }
  return possibleTypes;
}
function getReturnType(parentType, fieldName) {
  const fields = parentType.getFields();
  if (!Object.prototype.hasOwnProperty.call(fields, fieldName)) {
    throw new import_graphql.GraphQLError(
      `Field "${fieldName}" does not exist in "${parentType.name}"`
    );
  }
  const outputType = fields[fieldName].type;
  return memoizedResolveEndType(outputType);
}
function resolveEndType(typ) {
  if ((0, import_graphql.isListType)(typ) || (0, import_graphql.isNonNullType)(typ)) {
    return memoizedResolveEndType(typ.ofType);
  }
  return typ;
}
function hasField(typ, fieldName) {
  return Object.prototype.hasOwnProperty.call(typ.getFields(), fieldName);
}
function deepMerge(obj, src) {
  (0, import_lodash2.default)(obj, src, (objValue, srcValue) => {
    if (isLeafField(objValue)) {
      if (isLeafField(srcValue)) {
        return {
          ...objValue,
          ...srcValue
        };
      }
      return objValue;
    } else if (isLeafField(srcValue)) {
      return srcValue;
    }
    return void 0;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createResolveInfoThunk,
  fieldExpansionEnricher,
  isLeafField
});
//# sourceMappingURL=resolve-info.js.map