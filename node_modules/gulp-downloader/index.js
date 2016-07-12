var PluginError = require('gulp-util').PluginError;
var request = require('request');
var path = require('path');
var isString = require('lodash.isstring');
var isArray = require('lodash.isarray');
var defaults = require('lodash.defaultsdeep');
var es = require('event-stream');
var File = require('vinyl');
var progressBar = require('./lib/progress-bar');

function download(tasks, globalOptions) {
  var stream;
  var completed = 0;
  var taskCount;

  globalOptions = globalOptions || {};

  stream = es.through(function eachFile(file, encoding, next) {
    this.push(file);
    next();
  });

  if (!isArray(tasks)) {
    tasks = [tasks];
  }

  taskCount = tasks.length;

  tasks.forEach(function eachTask(options) {
    if (!options) {
      throw new PluginError({
        plugin: 'gulp-downloader',
        message: 'The passed options are not valid'
      });
    }

    if (isString(options)) {
      options = {
        fileName: path.parse(options).base,
        request: {
          url: options
        }
      };
    }

    options = defaults(options || {}, globalOptions, {
      fileName: null,
      verbose: false,
      request: {
        encoding: null
      }
    });

    if (!options.fileName) {
      options.fileName = path.parse(options.request.url || options.request.uri).base;
    }

    request(options.request, function onResponse(err, res, body) {
      var file = new File({
        path: options.fileName,
        contents: new Buffer(body)
      });

      stream.queue(file);
      completed++;

      if (completed === taskCount) {
        stream.emit('end');
      }
    })
      .on('response', progressBar(options))
    ;
  });

  return stream;
}

module.exports = download;
