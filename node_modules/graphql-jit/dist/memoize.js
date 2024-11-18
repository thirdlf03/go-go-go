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
var memoize_exports = {};
__export(memoize_exports, {
  memoize2: () => memoize2,
  memoize3: () => memoize3,
  memoize4: () => memoize4
});
module.exports = __toCommonJS(memoize_exports);
var import_lodash = __toESM(require("lodash.memoize"));
function uncurry2(fn) {
  return (a, b) => fn(a)(b);
}
function uncurry3(fn) {
  return (a, b, c) => fn(a)(b)(c);
}
function uncurry4(fn) {
  return (a, b, c, d) => fn(a)(b)(c)(d);
}
function memoize2(fn) {
  return uncurry2((0, import_lodash.default)((a) => (0, import_lodash.default)((b) => fn(a, b))));
}
function memoize3(fn) {
  return uncurry3(
    (0, import_lodash.default)((a) => (0, import_lodash.default)((b) => (0, import_lodash.default)((c) => fn(a, b, c))))
  );
}
function memoize4(fn) {
  return uncurry4(
    (0, import_lodash.default)(
      (a) => (0, import_lodash.default)((b) => (0, import_lodash.default)((c) => (0, import_lodash.default)((d) => fn(a, b, c, d))))
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  memoize2,
  memoize3,
  memoize4
});
//# sourceMappingURL=memoize.js.map