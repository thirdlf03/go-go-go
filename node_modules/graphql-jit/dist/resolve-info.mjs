import { genFn } from "./generate";
import {
  doTypesOverlap,
  GraphQLError,
  isAbstractType,
  isCompositeType,
  isListType,
  isNonNullType,
  isObjectType,
  isUnionType,
  Kind
} from "graphql";
import memoize from "lodash.memoize";
import mergeWith from "lodash.mergewith";
import { memoize2, memoize4 } from "./memoize.js";
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
  const gen = genFn();
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
const memoizedGetReturnType = MEMOIZATION ? memoize2(getReturnType) : getReturnType;
const memoizedHasField = MEMOIZATION ? memoize2(hasField) : hasField;
const memoizedResolveEndType = MEMOIZATION ? memoize(resolveEndType) : resolveEndType;
const memoizedGetPossibleTypes = MEMOIZATION ? memoize2(getPossibleTypes) : getPossibleTypes;
const memoizedExpandFieldNodeType = MEMOIZATION ? memoize4(expandFieldNodeType) : expandFieldNodeType;
const memoizedExpandFieldNode = MEMOIZATION ? memoize4(expandFieldNode) : expandFieldNode;
function expandFieldNode(schema, fragments, node, fieldType) {
  if (node.selectionSet == null) {
    return createLeafField({});
  }
  const typ = memoizedResolveEndType(fieldType);
  const possibleTypes = memoizedGetPossibleTypes(schema, typ);
  const fieldExpansion = {};
  for (const possibleType of possibleTypes) {
    if (!isUnionType(possibleType)) {
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
    if (selection.kind === Kind.FIELD) {
      if (!isUnionType(parentType) && memoizedHasField(parentType, selection.name.value)) {
        typeExpansion[selection.name.value] = memoizedExpandFieldNode(
          schema,
          fragments,
          selection,
          memoizedGetReturnType(parentType, selection.name.value)
        );
      }
    } else {
      const selectionSet2 = selection.kind === Kind.INLINE_FRAGMENT ? selection.selectionSet : fragments[selection.name.value].selectionSet;
      const nextType = selection.kind === Kind.INLINE_FRAGMENT ? selection.typeCondition ? schema.getType(
        selection.typeCondition.name.value
      ) : parentType : schema.getType(
        fragments[selection.name.value].typeCondition.name.value
      );
      if (nextType === parentType || isAbstractType(nextType)) {
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
  if (isObjectType(compositeType)) {
    return [compositeType];
  }
  const possibleTypes = [];
  const types = schema.getTypeMap();
  for (const typeName in types) {
    if (Object.prototype.hasOwnProperty.call(types, typeName)) {
      const typ = types[typeName];
      if (isCompositeType(typ) && doTypesOverlap(schema, typ, compositeType)) {
        possibleTypes.push(typ);
      }
    }
  }
  return possibleTypes;
}
function getReturnType(parentType, fieldName) {
  const fields = parentType.getFields();
  if (!Object.prototype.hasOwnProperty.call(fields, fieldName)) {
    throw new GraphQLError(
      `Field "${fieldName}" does not exist in "${parentType.name}"`
    );
  }
  const outputType = fields[fieldName].type;
  return memoizedResolveEndType(outputType);
}
function resolveEndType(typ) {
  if (isListType(typ) || isNonNullType(typ)) {
    return memoizedResolveEndType(typ.ofType);
  }
  return typ;
}
function hasField(typ, fieldName) {
  return Object.prototype.hasOwnProperty.call(typ.getFields(), fieldName);
}
function deepMerge(obj, src) {
  mergeWith(obj, src, (objValue, srcValue) => {
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
export {
  createResolveInfoThunk,
  fieldExpansionEnricher,
  isLeafField
};
//# sourceMappingURL=resolve-info.mjs.map