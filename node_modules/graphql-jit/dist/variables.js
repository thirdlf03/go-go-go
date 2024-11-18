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
var variables_exports = {};
__export(variables_exports, {
  compileVariableParsing: () => compileVariableParsing,
  failToParseVariables: () => failToParseVariables
});
module.exports = __toCommonJS(variables_exports);
var import_generate = require("./generate");
var import_graphql = require("graphql");
var import_ast = require("./ast.js");
var import_error = require("./error.js");
var import_inspect = __toESM(require("./inspect.js"));
const inspect = (0, import_inspect.default)();
function failToParseVariables(x) {
  return x.errors;
}
function createSubCompilationContext(context) {
  return { ...context };
}
function compileVariableParsing(schema, varDefNodes) {
  const errors = [];
  const coercedValues = /* @__PURE__ */ Object.create(null);
  let mainBody = "";
  const dependencies = /* @__PURE__ */ new Map();
  for (const varDefNode of varDefNodes) {
    const context = {
      varDefNode,
      depth: 0,
      inputPath: (0, import_ast.addPath)(void 0, "input"),
      responsePath: (0, import_ast.addPath)(void 0, "coerced"),
      dependencies
    };
    const varName = varDefNode.variable.name.value;
    const varType = (0, import_graphql.typeFromAST)(schema, varDefNode.type);
    if (!varType || !(0, import_graphql.isInputType)(varType)) {
      errors.push(
        new import_error.GraphQLError(
          `Variable "$${varName}" expected value of type "${varType || (0, import_graphql.print)(varDefNode.type)}" which cannot be used as an input type.`,
          (0, import_ast.computeLocations)([varDefNode.type])
        )
      );
      continue;
    }
    coercedValues[varName] = void 0;
    const hasValueName = hasValue((0, import_ast.addPath)(context.inputPath, varName));
    mainBody += `const ${hasValueName} = Object.prototype.hasOwnProperty.call(${getObjectPath(
      context.inputPath
    )}, "${varName}");
`;
    context.inputPath = (0, import_ast.addPath)(context.inputPath, varName);
    context.responsePath = (0, import_ast.addPath)(context.responsePath, varName);
    mainBody += generateInput(
      context,
      varType,
      varName,
      hasValueName,
      (0, import_graphql.valueFromAST)(varDefNode.defaultValue, varType),
      false
    );
  }
  if (errors.length > 0) {
    throw errors;
  }
  const gen = (0, import_generate.genFn)();
  gen(`
    return function getVariables(input) {
      const errors = [];
      const coerced = ${JSON.stringify(coercedValues)}
      ${mainBody}
      if (errors.length > 0) {
        return {errors, coerced: undefined};
      }
      return {errors: undefined, coerced};
    }
  `);
  return Function.apply(
    null,
    ["GraphQLJITError", "inspect"].concat(Array.from(dependencies.keys())).concat(gen.toString())
  ).apply(
    null,
    [import_error.GraphQLError, inspect].concat(Array.from(dependencies.values()))
  );
}
const MAX_32BIT_INT = 2147483647;
const MIN_32BIT_INT = -2147483648;
function generateInput(context, varType, varName, hasValueName, defaultValue, wrapInList) {
  const currentOutput = getObjectPath(context.responsePath);
  const currentInput = getObjectPath(context.inputPath);
  const errorLocation = printErrorLocation(
    (0, import_ast.computeLocations)([context.varDefNode])
  );
  const gen = (0, import_generate.genFn)();
  gen(`if (${currentInput} == null) {`);
  if ((0, import_graphql.isNonNullType)(varType)) {
    let nonNullMessage;
    let omittedMessage;
    if (context.errorMessage) {
      const objectPath = printObjectPath(context.responsePath);
      nonNullMessage = `${context.errorMessage} + \`Expected non-nullable type ${varType} not to be null at ${objectPath}.\``;
      omittedMessage = `${context.errorMessage} + \`Field ${objectPath} of required type ${varType} was not provided.\``;
    } else {
      nonNullMessage = `'Variable "$${varName}" of non-null type "${varType}" must not be null.'`;
      omittedMessage = `'Variable "$${varName}" of required type "${varType}" was not provided.'`;
    }
    varType = varType.ofType;
    gen(`
      if (${currentOutput} == null) {
        errors.push(new GraphQLJITError(${hasValueName} ? ${nonNullMessage} : ${omittedMessage}, ${errorLocation}));
      }
    `);
  } else {
    gen(`
      if (${hasValueName}) { ${currentOutput} = null; }
    `);
    if (defaultValue !== void 0) {
      gen(`else { ${currentOutput} = ${JSON.stringify(defaultValue)} }`);
    }
  }
  gen(`} else {`);
  if ((0, import_graphql.isScalarType)(varType)) {
    switch (varType.name) {
      case import_graphql.GraphQLID.name:
        gen(`
          if (typeof ${currentInput} === "string") {
            ${currentOutput} = ${currentInput};
          } else if (Number.isInteger(${currentInput})) {
            ${currentOutput} = ${currentInput}.toString();
          } else {
            errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
              inspect(${currentInput}) + "; " +
              'Expected type ${varType.name}; ' +
              '${varType.name} cannot represent value: ' +
              inspect(${currentInput}), ${errorLocation})
            );
          }
        `);
        break;
      case import_graphql.GraphQLString.name:
        gen(`
          if (typeof ${currentInput} === "string") {
              ${currentOutput} = ${currentInput};
          } else {
            errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
              inspect(${currentInput}) + "; " +
              'Expected type ${varType.name}; ' +
              '${varType.name} cannot represent a non string value: ' +
              inspect(${currentInput}), ${errorLocation})
            );
          }
        `);
        break;
      case import_graphql.GraphQLBoolean.name:
        gen(`
        if (typeof ${currentInput} === "boolean") {
            ${currentOutput} = ${currentInput};
        } else {
          errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
          inspect(${currentInput}) + "; " +
          'Expected type ${varType.name}; ' +
          '${varType.name} cannot represent a non boolean value: ' +
          inspect(${currentInput}), ${errorLocation}));
        }
        `);
        break;
      case import_graphql.GraphQLInt.name:
        gen(`
        if (Number.isInteger(${currentInput})) {
          if (${currentInput} > ${MAX_32BIT_INT} || ${currentInput} < ${MIN_32BIT_INT}) {
            errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
            inspect(${currentInput}) + "; " +
            'Expected type ${varType.name}; ' +
            '${varType.name} cannot represent non 32-bit signed integer value: ' +
            inspect(${currentInput}), ${errorLocation}));
          } else {
            ${currentOutput} = ${currentInput};
          }
        } else {
          errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
            inspect(${currentInput}) + "; " +
            'Expected type ${varType.name}; ' +
            '${varType.name} cannot represent non-integer value: ' +
            inspect(${currentInput}), ${errorLocation})
          );
        }
        `);
        break;
      case import_graphql.GraphQLFloat.name:
        gen(`
        if (Number.isFinite(${currentInput})) {
            ${currentOutput} = ${currentInput};
        } else {
          errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
            inspect(${currentInput}) + "; " +
            'Expected type ${varType.name}; ' +
            '${varType.name} cannot represent non numeric value: ' +
            inspect(${currentInput}), ${errorLocation})
          );
        }
        `);
        break;
      default:
        context.dependencies.set(
          `${varType.name}parseValue`,
          varType.parseValue.bind(varType)
        );
        gen(`
          try {
            const parseResult = ${varType.name}parseValue(${currentInput});
            if (parseResult === undefined || parseResult !== parseResult) {
              errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
              inspect(${currentInput}) + "; " +
              'Expected type ${varType.name}.', ${errorLocation}));
            }
            ${currentOutput} = parseResult;
          } catch (error) {
            errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
              inspect(${currentInput}) + "; " +
              'Expected type ${varType.name}.', ${errorLocation}, undefined, error)
            );
          }
        `);
    }
  } else if ((0, import_graphql.isEnumType)(varType)) {
    context.dependencies.set(
      `${varType.name}getValue`,
      varType.getValue.bind(varType)
    );
    gen(`
      if (typeof ${currentInput} === "string") {
        const enumValue = ${varType.name}getValue(${currentInput});
        if (enumValue) {
          ${currentOutput} = enumValue.value;
        } else {
          errors.push(
            new GraphQLJITError('Variable "$${varName}" got invalid value ' +
            inspect(${currentInput}) + "; " +
            'Expected type ${varType.name}.', ${errorLocation})
          );
        }
      } else {
        errors.push(
          new GraphQLJITError('Variable "$${varName}" got invalid value ' +
          inspect(${currentInput}) + "; " +
          'Expected type ${varType.name}.', ${errorLocation})
        );
      }
      `);
  } else if ((0, import_graphql.isListType)(varType)) {
    context.errorMessage = `'Variable "$${varName}" got invalid value ' + inspect(${currentInput}) + '; '`;
    const hasValueName2 = hasValue(context.inputPath);
    const index = `idx${context.depth}`;
    const subContext = createSubCompilationContext(context);
    subContext.responsePath = (0, import_ast.addPath)(
      subContext.responsePath,
      index,
      "variable"
    );
    subContext.inputPath = (0, import_ast.addPath)(subContext.inputPath, index, "variable");
    subContext.depth++;
    gen(`
      if (Array.isArray(${currentInput})) {
        ${currentOutput} = [];
        for (let ${index} = 0; ${index} < ${currentInput}.length; ++${index}) {
          const ${hasValueName2} =
          ${getObjectPath(subContext.inputPath)} !== undefined;
          ${generateInput(
      subContext,
      varType.ofType,
      varName,
      hasValueName2,
      void 0,
      false
    )}
        }
      } else {
        ${generateInput(
      context,
      varType.ofType,
      varName,
      hasValueName2,
      void 0,
      true
    )}
      }
    `);
  } else if ((0, import_graphql.isInputType)(varType)) {
    gen(`
      if (typeof ${currentInput} !== 'object') {
        errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
        inspect(${currentInput}) + "; " +
        'Expected type ${varType.name} to be an object.', ${errorLocation}));
      } else {
        ${currentOutput} = {};
    `);
    const fields = varType.getFields();
    const allowedFields = [];
    for (const field of Object.values(fields)) {
      const subContext = createSubCompilationContext(context);
      allowedFields.push(field.name);
      const hasValueName2 = hasValue((0, import_ast.addPath)(subContext.inputPath, field.name));
      gen(`
        const ${hasValueName2} = Object.prototype.hasOwnProperty.call(
          ${getObjectPath(subContext.inputPath)}, "${field.name}"
        );
      `);
      subContext.inputPath = (0, import_ast.addPath)(subContext.inputPath, field.name);
      subContext.responsePath = (0, import_ast.addPath)(subContext.responsePath, field.name);
      subContext.errorMessage = `'Variable "$${varName}" got invalid value ' + inspect(${currentInput}) + '; '`;
      gen(`
        ${generateInput(
        subContext,
        field.type,
        field.name,
        hasValueName2,
        field.defaultValue,
        false
      )}
      `);
    }
    gen(`
      const allowedFields = ${JSON.stringify(allowedFields)};
      for (const fieldName of Object.keys(${currentInput})) {
        if (!allowedFields.includes(fieldName)) {
          errors.push(new GraphQLJITError('Variable "$${varName}" got invalid value ' +
            inspect(${currentInput}) + "; " +
            'Field "' + fieldName + '" is not defined by type ${varType.name}.', ${errorLocation}));
          break;
        }
      }
    }`);
  } else {
    throw new Error(`unknown type: ${varType}`);
  }
  if (wrapInList) {
    gen(`${currentOutput} = [${currentOutput}];`);
  }
  gen(`}`);
  return gen.toString();
}
function hasValue(path) {
  const flattened = [];
  let curr = path;
  while (curr) {
    flattened.push(curr.key);
    curr = curr.prev;
  }
  return `hasValue${flattened.join("_")}`;
}
function printErrorLocation(location) {
  return JSON.stringify(location);
}
function getObjectPath(path) {
  const flattened = [];
  let curr = path;
  while (curr) {
    flattened.unshift({ key: curr.key, type: curr.type });
    curr = curr.prev;
  }
  let name = flattened[0].key;
  for (let i = 1; i < flattened.length; ++i) {
    name += flattened[i].type === "literal" ? `["${flattened[i].key}"]` : `[${flattened[i].key}]`;
  }
  return name;
}
function printObjectPath(path) {
  const flattened = [];
  let curr = path;
  while (curr) {
    flattened.unshift({ key: curr.key, type: curr.type });
    curr = curr.prev;
  }
  const initialIndex = Math.min(flattened.length - 1, 1);
  let name = "value";
  for (let i = initialIndex + 1; i < flattened.length; ++i) {
    name += flattened[i].type === "literal" ? `.${flattened[i].key}` : `[\${${flattened[i].key}}]`;
  }
  return name;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  compileVariableParsing,
  failToParseVariables
});
//# sourceMappingURL=variables.js.map