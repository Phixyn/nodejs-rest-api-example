const bodyParser = require('body-parser');
const express = require('express');

const exampleController = require('../controllers/exampleController.js');

const router = express.Router();

// This middleware parses the body of requests where the content-type header
// is 'application/json'.
// TODO Use native
const jsonBodyParser = bodyParser.json();

router.post('/', jsonBodyParser, exampleController.processPostExample);

router.get('/', exampleController.processGetExample);

module.exports = router;
