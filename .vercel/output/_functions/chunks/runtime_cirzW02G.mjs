;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ac91afbf-5d34-4cdd-8c61-5277ed3b79a3",e._sentryDebugIdIdentifier="sentry-dbid-ac91afbf-5d34-4cdd-8c61-5277ed3b79a3")}catch(e){}}();import { A as AstroError, E as EnvInvalidVariables } from './astro/server_D4xJ1nRx.mjs';

function invalidVariablesToError(invalid) {
  const _errors = [];
  for (const { key, type, errors } of invalid) {
    if (errors[0] === "missing") {
      _errors.push(`${key} is missing`);
    } else if (errors[0] === "type") {
      _errors.push(`${key}'s type is invalid, expected: ${type}`);
    } else {
      _errors.push(`The following constraints for ${key} are not met: ${errors.join(", ")}`);
    }
  }
  return _errors;
}

let _getEnv = (key) => process.env[key];
function setGetEnv(fn) {
  _getEnv = fn;
  _onSetGetEnv();
}
let _onSetGetEnv = () => {
};
function setOnSetGetEnv(fn) {
  _onSetGetEnv = fn;
}
function getEnv(...args) {
  return _getEnv(...args);
}
function createInvalidVariablesError(key, type, result) {
  return new AstroError({
    ...EnvInvalidVariables,
    message: EnvInvalidVariables.message(
      invalidVariablesToError([{ key, type, errors: result.errors }])
    )
  });
}

export { setGetEnv as a, createInvalidVariablesError as c, getEnv as g, setOnSetGetEnv as s };
