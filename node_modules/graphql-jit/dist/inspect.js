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
var inspect_exports = {};
__export(inspect_exports, {
  default: () => createInspect,
  nodejsCustomInspectSymbol: () => nodejsCustomInspectSymbol
});
module.exports = __toCommonJS(inspect_exports);
const nodejsCustomInspectSymbol = Symbol.for(
  "nodejs.util.inspect.custom"
);
function createInspect(maxArrayLength = 10, maxRecursiveDepth = 2) {
  return function inspect(value) {
    return formatValue(value, []);
  };
  function formatValue(value, seenValues) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(value);
      case "function":
        return value.name ? `[function ${value.name}]` : "[function]";
      case "object":
        return formatObjectValue(value, seenValues);
      default:
        return String(value);
    }
  }
  function formatObjectValue(value, previouslySeenValues) {
    if (previouslySeenValues.indexOf(value) !== -1) {
      return "[Circular]";
    }
    const seenValues = [...previouslySeenValues, value];
    if (value) {
      const customInspectFn = getCustomFn(value);
      if (customInspectFn) {
        const customValue = customInspectFn.call(value);
        if (customValue !== value) {
          return typeof customValue === "string" ? customValue : formatValue(customValue, seenValues);
        }
      } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
      }
      return formatObject(value, seenValues);
    }
    return String(value);
  }
  function formatObject(object, seenValues) {
    const keys = Object.keys(object);
    if (keys.length === 0) {
      return "{}";
    }
    if (seenValues.length > maxRecursiveDepth) {
      return "[" + getObjectTag(object) + "]";
    }
    const properties = keys.map((key) => {
      const value = formatValue(object[key], seenValues);
      return key + ": " + value;
    });
    return "{ " + properties.join(", ") + " }";
  }
  function formatArray(array, seenValues) {
    if (array.length === 0) {
      return "[]";
    }
    if (seenValues.length > maxRecursiveDepth) {
      return "[Array]";
    }
    const len = Math.min(maxArrayLength, array.length);
    const remaining = array.length - len;
    const items = [];
    for (let i = 0; i < len; ++i) {
      items.push(formatValue(array[i], seenValues));
    }
    if (remaining === 1) {
      items.push("... 1 more item");
    } else if (remaining > 1) {
      items.push(`... ${remaining} more items`);
    }
    return "[" + items.join(", ") + "]";
  }
  function getCustomFn(object) {
    const customInspectFn = object[String(nodejsCustomInspectSymbol)];
    if (typeof customInspectFn === "function") {
      return customInspectFn;
    }
    if (typeof object.inspect === "function") {
      return object.inspect;
    }
  }
  function getObjectTag(object) {
    const tag = Object.prototype.toString.call(object).replace(/^\[object /, "").replace(/]$/, "");
    if (tag === "Object" && typeof object.constructor === "function") {
      const name = object.constructor.name;
      if (typeof name === "string") {
        return name;
      }
    }
    return tag;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nodejsCustomInspectSymbol
});
//# sourceMappingURL=inspect.js.map