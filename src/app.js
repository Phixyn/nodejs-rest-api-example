require('dotenv').config();

const axios = require('axios');
// const cors = require("cors");
const express = require('express');
const morgan = require('morgan');

const config = require('./config.js');

const exampleRoutes = require('./api/example/exampleRoutes.js');

const { logger } = require('./utils/logging.js');
const { validateEnv } = require('./utils/environment.js');

const SERVER_VERSION = '1.0.0';

if (validateEnv() === false) {
  logger.error('Failed to start server');
  logger.error('One or more variables are missing from your .env file');
  logger.error(
    'Please go through the errors and add each missing variable to your .env file'
  );
  process.exit(1);
}

// Port number in .env file takes precedence over config (.env overwrites
// config port property).
const port = config.app.port;
const app = express();

let serverRunning = false;

// HTTP request logger middleware. Should be registered before the
// request handler middlewares.
app.use(
  morgan(config.logging.morgan.logLineFormat, {
    skip: (req, res) => {
      // Do not log requests to health check endpoint, as it can make logs very
      // spammy in deployments. Same for requests that result in a HTTP 404
      // response, as most likely it comes from a bot or crawler.
      // Replace the endpoint with your healthcheck endpoint.
      if (req.baseUrl === '/serverStatus') {
        return true;
      } else if (res.statusCode === 404) {
        return true;
      }

      return false;
    },
  })
);

// If you need CORS handling. Additional setup might be necessary.
// app.use(cors());

app.use('/api/v1/example', exampleRoutes);

// TODO Docs: Documentation for error handlers
app.use((req, res, next) => {
  const error = new Error('Not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  let errorResponse = {
    status: err.status || 500,
    statusText: err.statusText || 'Internal Server Error',
    errorType: err.errorType || 'ServerError',
    message: err.message,
  };

  if (axios.isAxiosError(err)) {
    logger.error('Axios request error:');
    // TODO Bug: See comment in ./utils/logging.js for why we have to make a
    // separate object here with "messageText" instead of "message".
    logger.error({
      status: err.response.status,
      statusText: err.response.statusText,
      messageText: err.message,
      requestURL: err.response.config.url,
      data: err.response.data,
    });

    errorResponse = {
      status: err.response.status,
      statusText: err.response.statusText,
      message: err.message,
      requestURL: err.response.config.url,
      data: err.response.data,
    };
  } else {
    logger.error({
      status: errorResponse.status,
      statusText: errorResponse.statusText,
      messageText: errorResponse.message,
    });
  }

  res.status(errorResponse.status);
  res.json(errorResponse);
});

const server = app.listen(port, () => {
  serverRunning = true;
  logger.info(`Example Server v${SERVER_VERSION}`);
  logger.info(`Listening on port ${port}`);
});

/**
 * Shuts down the Express HTTP server and cleans up.
 *
 * @returns {void}
 */
function shutdownServer() {
  logger.info('Shutting down HTTP server...');

  server.close((error) => {
    if (error) {
      logger.error('Error closing server:');
      logger.error(error);
      return;
    }

    serverRunning = false;
    logger.info('HTTP server closed');

    // Additional cleanup tasks go here, for example closing DB connection
    
  });
}

/**
 * Handles OS termination signals for graceful shutdown of the Express HTTP
 * server.
 *
 * @param {NodeJS.Signals} signal - The termination signal received.
 * @returns {void}
 */
function handleTermSignal(signal) {
  logger.info(`${signal} signal received: shutting down HTTP server`);
  if (serverRunning === true) {
    shutdownServer();
  }
}

process.on('SIGINT', handleTermSignal);
process.on('SIGTERM', handleTermSignal);

process.on('exit', (code) => {
  logger.info(`About to exit with code: ${code}`);
  if (serverRunning === true) {
    shutdownServer();
  }
});
