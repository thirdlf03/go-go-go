import { GraphQLResolveInfo, GraphQLObjectType, GraphQLOutputType, FieldNode } from 'graphql';

type GraphQLJitResolveInfo<Enrichments> = GraphQLResolveInfo & Enrichments;
interface ResolveInfoEnricherInput {
    schema: GraphQLResolveInfo["schema"];
    fragments: GraphQLResolveInfo["fragments"];
    operation: GraphQLResolveInfo["operation"];
    parentType: GraphQLObjectType;
    returnType: GraphQLOutputType;
    fieldName: string;
    fieldNodes: FieldNode[];
}
interface FieldExpansion {
    [returnType: string]: TypeExpansion;
}
declare const LeafFieldSymbol: unique symbol;
interface LeafField {
    [LeafFieldSymbol]: true;
}
interface TypeExpansion {
    [fieldName: string]: FieldExpansion | LeafField;
}
declare function isLeafField(obj: LeafField | FieldExpansion): obj is LeafField;
/**
 * Compute the GraphQLJitResolveInfo's `fieldExpansion` and return a function
 * that returns the computed resolveInfo. This thunk is registered in
 * context.dependencies for the field's resolveInfoName
 */
declare function createResolveInfoThunk<T>({ schema, fragments, operation, parentType, fieldName, fieldType, fieldNodes }: {
    schema: GraphQLResolveInfo["schema"];
    fragments: GraphQLResolveInfo["fragments"];
    operation: GraphQLResolveInfo["operation"];
    parentType: GraphQLObjectType;
    fieldType: GraphQLOutputType;
    fieldName: string;
    fieldNodes: FieldNode[];
}, enricher?: (inp: ResolveInfoEnricherInput) => T): any;
declare function fieldExpansionEnricher(input: ResolveInfoEnricherInput): {
    fieldExpansion: FieldExpansion;
};

export { type FieldExpansion, type GraphQLJitResolveInfo, type LeafField, type ResolveInfoEnricherInput, type TypeExpansion, createResolveInfoThunk, fieldExpansionEnricher, isLeafField };
