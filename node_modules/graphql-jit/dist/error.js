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
var error_exports = {};
__export(error_exports, {
  GraphQLError: () => GraphQLError
});
module.exports = __toCommonJS(error_exports);
var import_graphql = require("graphql");
function GraphQLError(message, locations, path, originalError, skipStackCapturing) {
  const extensions = originalError && originalError.extensions;
  Object.defineProperties(this, {
    message: {
      value: message,
      enumerable: true
    },
    locations: {
      value: locations || void 0,
      enumerable: locations && locations.length > 0
    },
    path: {
      value: path || void 0,
      enumerable: Boolean(path)
    },
    originalError: {
      value: originalError
    },
    extensions: {
      // Coercing falsey values to undefined ensures they will not be included
      // in JSON.stringify() when not provided.
      value: extensions || void 0,
      enumerable: Boolean(extensions)
    }
  });
  if (originalError && originalError.stack) {
    Object.defineProperty(this, "stack", {
      value: originalError.stack,
      writable: true,
      configurable: true
    });
  } else if (!skipStackCapturing) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GraphQLError);
    } else {
      Object.defineProperty(this, "stack", {
        value: Error().stack,
        writable: true,
        configurable: true
      });
    }
  }
}
GraphQLError.prototype = Object.create(
  import_graphql.GraphQLError.prototype,
  {
    constructor: { value: GraphQLError },
    name: { value: "GraphQLError" }
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GraphQLError
});
//# sourceMappingURL=error.js.map