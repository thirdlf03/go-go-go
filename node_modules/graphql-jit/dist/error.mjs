import {
  GraphQLError as UpstreamGraphQLError
} from "graphql";
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
  UpstreamGraphQLError.prototype,
  {
    constructor: { value: GraphQLError },
    name: { value: "GraphQLError" }
  }
);
export {
  GraphQLError
};
//# sourceMappingURL=error.mjs.map