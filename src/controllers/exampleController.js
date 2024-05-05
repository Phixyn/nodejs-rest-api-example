const exampleService = require('../services/exampleService.js');

const { logger } = require('../utils/logging.js');

/**
 * TODO Docs: JSDoc
 */
async function processGetExample(req, res, next) {
  const data = await exampleService.exampleGetData();
  // TODO Add error handling as appropriate, log anything
  // if needed (already imported the logger)
  res.status(200).json(data);
}

/**
 * TODO Docs: JSDoc
 */
async function processPostExample(req, res, next) {
  const addDataResult = await exampleService.examplePostData();
  res.status(201).json(addDataResult);
}

module.exports = {
  processGetExample,
  processPostExample,
};
