import { GraphQLSchema, VariableDefinitionNode, GraphQLError } from 'graphql';

interface FailedVariableCoercion {
    errors: ReadonlyArray<GraphQLError>;
}
interface VariableValues {
    coerced: {
        [key: string]: any;
    };
}
type CoercedVariableValues = FailedVariableCoercion | VariableValues;
declare function failToParseVariables(x: any): x is FailedVariableCoercion;
declare function compileVariableParsing(schema: GraphQLSchema, varDefNodes: ReadonlyArray<VariableDefinitionNode>): (inputs: {
    [key: string]: any;
}) => CoercedVariableValues;

export { type CoercedVariableValues, compileVariableParsing, failToParseVariables };
