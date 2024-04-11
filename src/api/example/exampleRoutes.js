const bodyParser = require('body-parser');
const express = require('express');

const exampleControllers = require('./exampleControllers.js');

const router = express.Router();

// This middleware parses the body of requests where the content-type header
// is 'application/json'.
const jsonBodyParser = bodyParser.json();

router.get('/', exampleControllers.processGetExample);

router.post('/', jsonBodyParser, exampleControllers.processPostExample);

module.exports = router;
