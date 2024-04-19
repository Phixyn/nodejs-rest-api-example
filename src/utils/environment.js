const { logger } = require('./logging.js');

/**
 * Represents the schema for environment variables used in the application.
 *
 * @typedef {Object} EnvSchema
 * @property {string} propertyName - The name of the environment variable.
 * @property {string} description - A brief description of the purpose of the
 *    environment variable.
 * @property {boolean} isRequired - A flag indicating if the environment
 *    variable is required or not.
 */
/**
 * An array of objects representing the schema for environment variables used
 * in the application.
 * @type {EnvSchema[]}
 */
const envSchema = [
  {
    propertyName: 'PORT',
    description: 'Port number on which the server will listen on.',
    isRequired: false,
  },
  {
    propertyName: 'ENV',
    description:
      'Name of the environment, for example development or production.',
    isRequired: false,
  },
];

/**
 * Validates the environment variables by checking if all required variables
 * are present. Required variables are described in the {@link envSchema}
 * const defined above. The validation fails if one or more required variables
 * are missing.
 *
 * @returns {boolean} Whether the environment file is valid or not.
 * @see {@link envSchema} for the environment file schema.
 */
function validateEnv() {
  let isEnvFileValid = true;

  for (property of envSchema) {
    if (
      property.isRequired === true &&
      (process.env.hasOwnProperty(property.propertyName) === false ||
        process.env[property.propertyName] === '')
    ) {
      logger.error(
        `[Env] Property '${property.propertyName}' is required but missing or blank`
      );
      logger.error(
        `[Env] Please add ${property.propertyName} to your .env file`
      );
      logger.error(
        `[Env] ${property.propertyName} description: ${property.description}`
      );
      isEnvFileValid = false;
    }
  }

  return isEnvFileValid;
}

module.exports = { validateEnv };
