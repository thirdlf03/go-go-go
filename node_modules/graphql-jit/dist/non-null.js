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
var non_null_exports = {};
__export(non_null_exports, {
  createNullTrimmer: () => createNullTrimmer
});
module.exports = __toCommonJS(non_null_exports);
var import_graphql = require("graphql");
var import_lodash = __toESM(require("lodash.merge"));
var import_ast = require("./ast.js");
var import_compat = require("./compat.js");
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
  const type = (0, import_compat.getOperationRootType)(
    compilationContext.schema,
    compilationContext.operation
  );
  const fields = (0, import_ast.collectFields)(
    compilationContext,
    type,
    compilationContext.operation.selectionSet,
    /* @__PURE__ */ Object.create(null),
    /* @__PURE__ */ Object.create(null)
  );
  const properties = /* @__PURE__ */ Object.create(null);
  for (const responseName of Object.keys(fields)) {
    const fieldType = (0, import_ast.resolveFieldDef)(
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
  if ((0, import_graphql.isNonNullType)(type)) {
    const nullable = transformNode(compilationContext, fieldNodes, type.ofType);
    if (nullable != null) {
      nullable.isNullable = false;
      return nullable;
    }
    return null;
  }
  if ((0, import_graphql.isObjectType)(type)) {
    const subfields = (0, import_ast.collectSubfields)(compilationContext, type, fieldNodes);
    const properties = /* @__PURE__ */ Object.create(null);
    for (const responseName of Object.keys(subfields)) {
      const fieldType = (0, import_ast.resolveFieldDef)(
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
  if ((0, import_graphql.isListType)(type)) {
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
  if ((0, import_graphql.isAbstractType)(type)) {
    return compilationContext.schema.getPossibleTypes(type).reduce(
      (res, t) => {
        const property = transformNode(compilationContext, fieldNodes, t);
        if (property != null) {
          res.children = (0, import_lodash.default)(res.children, property.children);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createNullTrimmer
});
//# sourceMappingURL=non-null.js.map