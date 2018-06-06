const webpackConfig = require('./webpack.config')();
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

webpackConfig.module.rules.push({
  test: /\.ts$/,
  loader: 'istanbul-instrumenter-loader',
  exclude: /\.spec\.ts$/
});

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-webpack')
    ],
    files: [
      { pattern: './src/*.spec.ts', watched: false }
    ],
    preprocessors: {
      './src/**/*.ts': ['webpack']
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov',
        "text-summary": ''
      }
    },
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false
  });
};
