'use strict';

var os = require('os');
var through = require('through');
var gutil = require('gulp-util');
var gitCommitters = require('git-committers');

module.exports = function (options) {
  var stdout = '';

  function write(data) {
    stdout += data;
  }

  function end() {
    var file = new gutil.File({
      path: './',
      contents: new Buffer(stdout)
    });
    this.emit('data', file);
    this.emit('end');
  }

  return gitCommitters(options, gutil.noop).pipe(through(write, end))
};
