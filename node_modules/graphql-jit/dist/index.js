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
var src_exports = {};
__export(src_exports, {
  compileQuery: () => import_execution.compileQuery,
  fieldExpansionEnricher: () => import_resolve_info.fieldExpansionEnricher,
  isCompiledQuery: () => import_execution.isCompiledQuery,
  isLeafField: () => import_resolve_info.isLeafField
});
module.exports = __toCommonJS(src_exports);
var import_execution = require("./execution.js");
var import_resolve_info = require("./resolve-info.js");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compileQuery,
  fieldExpansionEnricher,
  isCompiledQuery,
  isLeafField
});
//# sourceMappingURL=index.js.map