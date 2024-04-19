const config = require('../config.js');

const { format } = require('logform');
const { createLogger, transports } = require('winston');

/**
 * TODO Docs: JSDoc
 */
const customLineFormat = format.printf((logLine) => {
  if (logLine.stack) {
    logLine.message = `${logLine.message}\n${logLine.stack}`;
  }
  if (typeof logLine.message === 'object') {
    try {
      // FIXME Bug if the object has a "message" property too, this breaks
      // It's particularly affecting error objects.
      logLine.message = JSON.stringify(logLine.message, null, 2);
    } catch (error) {
      console.warn('Unable to convert object in log line to string');
      console.warn('Original line:');
      console.warn(logLine);
      console.error(error);
    }
  }

  return `[${logLine.timestamp}][${logLine.level.toUpperCase()}][${logLine.service}] ${
    logLine.message
  }`;
});

// The main application logger object.
// Logs to a file and to the console.
const logger = createLogger({
  // level: "debug", // set per transport instead
  format: format.combine(
    format.timestamp({
      format: config.logging.winston.timestampFormat,
    }),
    format.errors({ stack: config.logging.winston.includeErrorStackTrace }),
    format.splat(),
    customLineFormat
  ),
  defaultMeta: { service: config.logging.winston.defaultService },
  transports: [
    new transports.File({
      filename: config.logging.winston.logFilename,
      level: config.logging.winston.fileLogLevel,
    }),
    new transports.Console({ level: config.logging.winston.consoleLogLevel }),
  ],
});

module.exports = { logger };
