"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var json_exports = {};
__export(json_exports, {
  queryToJSONSchema: () => queryToJSONSchema
});
module.exports = __toCommonJS(json_exports);
var import_graphql = require("graphql");
var import_ast = require("./ast.js");
var import_compat = require("./compat.js");
const PRIMITIVES = {
  Int: "integer",
  Float: "number",
  String: "string",
  Boolean: "boolean",
  ID: "string"
};
function queryToJSONSchema(compilationContext) {
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
  const fieldProperties = /* @__PURE__ */ Object.create(null);
  for (const responseName of Object.keys(fields)) {
    const fieldType = (0, import_ast.resolveFieldDef)(
      compilationContext,
      type,
      fields[responseName]
    );
    if (!fieldType) {
      continue;
    }
    fieldProperties[responseName] = transformNode(
      compilationContext,
      fields[responseName],
      fieldType.type
    );
  }
  return {
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: fieldProperties,
        nullable: true
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: true,
          properties: {
            message: {
              type: "string"
            },
            path: {
              type: "array",
              items: {
                type: ["string", "number"]
              }
            },
            locations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  line: {
                    type: "number"
                  },
                  column: {
                    type: "number"
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}
function transformNode(compilationContext, fieldNodes, type) {
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
      properties[responseName] = transformNode(
        compilationContext,
        subfields[responseName],
        fieldType.type
      );
    }
    return {
      type: "object",
      properties,
      nullable: true
    };
  }
  if ((0, import_graphql.isListType)(type)) {
    return {
      type: "array",
      items: transformNode(compilationContext, fieldNodes, type.ofType),
      nullable: true
    };
  }
  if ((0, import_graphql.isNonNullType)(type)) {
    const nullable = transformNode(compilationContext, fieldNodes, type.ofType);
    nullable.nullable = false;
    return nullable;
  }
  if ((0, import_graphql.isEnumType)(type)) {
    return {
      type: "string",
      nullable: true
    };
  }
  if ((0, import_graphql.isScalarType)(type)) {
    const jsonSchemaType = PRIMITIVES[type.name];
    if (!jsonSchemaType) {
      throw new Error(`Got unexpected PRIMITIVES type: ${type.name}`);
    }
    return {
      type: jsonSchemaType,
      nullable: true
    };
  }
  if ((0, import_graphql.isAbstractType)(type)) {
    return compilationContext.schema.getPossibleTypes(type).reduce(
      (res, t) => {
        const jsonSchema = transformNode(compilationContext, fieldNodes, t);
        res.properties = {
          ...res.properties,
          ...jsonSchema.properties
        };
        return res;
      },
      {
        type: "object",
        properties: {},
        nullable: true
      }
    );
  }
  throw new Error(`Got unhandled type: ${type.name}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  queryToJSONSchema
});
//# sourceMappingURL=json.js.map