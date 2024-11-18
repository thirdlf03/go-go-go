import {
  isListType,
  isNonNullType,
  isObjectType,
  isAbstractType
} from "graphql";
import merge from "lodash.merge";
import { collectFields, collectSubfields, resolveFieldDef } from "./ast.js";
import { getOperationRootType } from "./compat.js";
function createNullTrimmer(compilationContext) {
  return trimData(parseQueryNullables(compilationContext));
}
function trimData(nullable) {
  return (data, errors) => {
    const finalErrors = [];
    const processedErrors = /* @__PURE__ */ new Set();
    for (const error of errors) {
      if (!error.path) {
        throw new Error("no path available for tree trimming");
      }
      if (processedErrors.has(error.path.join("."))) {
        continue;
      }
      const ancestors = findNullableAncestor(nullable, error.path);
      if (ancestors.length === 0) {
        data = null;
        finalErrors.push(error);
        break;
      }
      removeBranch(data, ancestors);
      processedErrors.add(error.path.join("."));
      finalErrors.push(error);
    }
    return { data, errors: finalErrors };
  };
}
function removeBranch(tree, branch) {
  for (let i = 0; i < branch.length - 1; ++i) {
    if (tree[branch[i]] === null) {
      return;
    }
    tree = tree[branch[i]];
  }
  const toNull = branch[branch.length - 1];
  tree[toNull] = null;
}
const ARRAY_CHILD_NAME = "index";
function findNullableAncestor(nullable, paths) {
  let lastNullable = 0;
  for (let i = 0; i < paths.length; ++i) {
    const path = paths[i];
    const child = nullable.children[typeof path === "string" ? path : ARRAY_CHILD_NAME];
    if (!child) {
      break;
    }
    if (child.isNullable) {
      lastNullable = i + 1;
    }
    nullable = child;
  }
  return paths.slice(0, lastNullable);
}
function parseQueryNullables(compilationContext) {
  const type = getOperationRootType(
    compilationContext.schema,
    compilationContext.operation
  );
  const fields = collectFields(
    compilationContext,
    type,
    compilationContext.operation.selectionSet,
    /* @__PURE__ */ Object.create(null),
    /* @__PURE__ */ Object.create(null)
  );
  const properties = /* @__PURE__ */ Object.create(null);
  for (const responseName of Object.keys(fields)) {
    const fieldType = resolveFieldDef(
      compilationContext,
      type,
      fields[responseName]
    );
    if (!fieldType) {
      continue;
    }
    const property = transformNode(
      compilationContext,
      fields[responseName],
      fieldType.type
    );
    if (property != null) {
      properties[responseName] = property;
    }
  }
  return {
    isNullable: true,
    children: properties
  };
}
function transformNode(compilationContext, fieldNodes, type) {
  if (isNonNullType(type)) {
    const nullable = transformNode(compilationContext, fieldNodes, type.ofType);
    if (nullable != null) {
      nullable.isNullable = false;
      return nullable;
    }
    return null;
  }
  if (isObjectType(type)) {
    const subfields = collectSubfields(compilationContext, type, fieldNodes);
    const properties = /* @__PURE__ */ Object.create(null);
    for (const responseName of Object.keys(subfields)) {
      const fieldType = resolveFieldDef(
        compilationContext,
        type,
        subfields[responseName]
      );
      if (!fieldType) {
        continue;
      }
      const property = transformNode(
        compilationContext,
        subfields[responseName],
        fieldType.type
      );
      if (property != null) {
        properties[responseName] = property;
      }
    }
    return {
      isNullable: true,
      children: properties
    };
  }
  if (isListType(type)) {
    const child = transformNode(compilationContext, fieldNodes, type.ofType);
    if (child != null) {
      return {
        isNullable: true,
        children: { [ARRAY_CHILD_NAME]: child }
      };
    }
    return {
      isNullable: true,
      children: {}
    };
  }
  if (isAbstractType(type)) {
    return compilationContext.schema.getPossibleTypes(type).reduce(
      (res, t) => {
        const property = transformNode(compilationContext, fieldNodes, t);
        if (property != null) {
          res.children = merge(res.children, property.children);
        }
        return res;
      },
      {
        isNullable: true,
        children: {}
      }
    );
  }
  return null;
}
export {
  createNullTrimmer
};
//# sourceMappingURL=non-null.mjs.map