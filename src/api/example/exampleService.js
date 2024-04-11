// Import as needed for future use
// const { logger } = require('../../shared/utils/logging.js');

/**
 * TODO Docs: JSDoc
 * Of course right now there's no reason for it to be async,
 * but it's just an example.
 */
async function exampleGetData() {
  return {
    a: 1,
    b: 2,
  };
}

/**
 * Same as above.
 */
async function examplePostData() {
  return { status: '1 new document created' };
}

module.exports = {
  exampleGetData,
  examplePostData,
};
