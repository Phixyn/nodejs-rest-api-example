const config = {
  app: {
    port: process.env.PORT || 21768,
    serviceName: 'example-server',
  },
  logging: {
    morgan: {
      logLineFormat: 'combined',
    },
    winston: {
      logFilename: 'example-server.log',
      consoleLogLevel: 'debug',
      fileLogLevel: 'debug',
      timestampFormat: 'YYYY-MM-DD HH:mm:ss',
      defaultService: 'server',
      includeErrorStackTrace: true,
    },
  },
};

module.exports = config;
