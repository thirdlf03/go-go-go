import { genFn } from "./generate";
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  isEnumType,
  isInputType,
  isListType,
  isNonNullType,
  isScalarType,
  print,
  typeFromAST,
  valueFromAST
} from "graphql";
import { addPath, computeLocations } from "./ast.js";
import { GraphQLError as GraphQLJITError } from "./error.js";
import createInspect from "./inspect.js";
const inspect = createInspect();
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
      inputPath: addPath(void 0, "input"),
      responsePath: addPath(void 0, "coerced"),
      dependencies
    };
    const varName = varDefNode.variable.name.value;
    const varType = typeFromAST(schema, varDefNode.type);
    if (!varType || !isInputType(varType)) {
      errors.push(
        new GraphQLJITError(
          `Variable "$${varName}" expected value of type "${varType || print(varDefNode.type)}" which cannot be used as an input type.`,
          computeLocations([varDefNode.type])
        )
      );
      continue;
    }
    coercedValues[varName] = void 0;
    const hasValueName = hasValue(addPath(context.inputPath, varName));
    mainBody += `const ${hasValueName} = Object.prototype.hasOwnProperty.call(${getObjectPath(
      context.inputPath
    )}, "${varName}");
`;
    context.inputPath = addPath(context.inputPath, varName);
    context.responsePath = addPath(context.responsePath, varName);
    mainBody += generateInput(
      context,
      varType,
      varName,
      hasValueName,
      valueFromAST(varDefNode.defaultValue, varType),
      false
    );
  }
  if (errors.length > 0) {
    throw errors;
  }
  const gen = genFn();
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
    [GraphQLJITError, inspect].concat(Array.from(dependencies.values()))
  );
}
const MAX_32BIT_INT = 2147483647;
const MIN_32BIT_INT = -2147483648;
function generateInput(context, varType, varName, hasValueName, defaultValue, wrapInList) {
  const currentOutput = getObjectPath(context.responsePath);
  const currentInput = getObjectPath(context.inputPath);
  const errorLocation = printErrorLocation(
    computeLocations([context.varDefNode])
  );
  const gen = genFn();
  gen(`if (${currentInput} == null) {`);
  if (isNonNullType(varType)) {
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
  if (isScalarType(varType)) {
    switch (varType.name) {
      case GraphQLID.name:
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
      case GraphQLString.name:
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
      case GraphQLBoolean.name:
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
      case GraphQLInt.name:
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
      case GraphQLFloat.name:
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
  } else if (isEnumType(varType)) {
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
  } else if (isListType(varType)) {
    context.errorMessage = `'Variable "$${varName}" got invalid value ' + inspect(${currentInput}) + '; '`;
    const hasValueName2 = hasValue(context.inputPath);
    const index = `idx${context.depth}`;
    const subContext = createSubCompilationContext(context);
    subContext.responsePath = addPath(
      subContext.responsePath,
      index,
      "variable"
    );
    subContext.inputPath = addPath(subContext.inputPath, index, "variable");
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
  } else if (isInputType(varType)) {
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
      const hasValueName2 = hasValue(addPath(subContext.inputPath, field.name));
      gen(`
        const ${hasValueName2} = Object.prototype.hasOwnProperty.call(
          ${getObjectPath(subContext.inputPath)}, "${field.name}"
        );
      `);
      subContext.inputPath = addPath(subContext.inputPath, field.name);
      subContext.responsePath = addPath(subContext.responsePath, field.name);
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
export {
  compileVariableParsing,
  failToParseVariables
};
//# sourceMappingURL=variables.mjs.map