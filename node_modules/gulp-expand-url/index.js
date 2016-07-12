'use strict';

var gutil   = require('gulp-util');
var through = require('through2');
var lodash  = require('lodash');
var path    = require('path');

var templateUrlRegExp = /templateUrl\:[^\'\"]*(?:\'|\")([^\'\"]+)(?:\'|\")/g;
var imgSrcRegExp = /<img[^>]*?(?:src=)(?:\'|\")([^\'\"]+)/g;
var extRegExp = function (extension) {
  var escapedExt = extension.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  return new RegExp('(?:\'|")([^\'"]+' + escapedExt + ')(?:\'|")', 'g');
};

function expandUrlPlugin(options) {

  var opts = lodash.extend({
    root: '',
    type: null,
    extension: '',
    regexp: null,
    sep: '/'
  }, options);

  switch(opts.type) {
    case 'templateUrl':
      opts.regexp = templateUrlRegExp;
      break;
    case 'imgSrc':
      opts.regexp = imgSrcRegExp;
      break;
    case 'extension':
      opts.regexp = extRegExp(opts.extension);
      break;
  }

  return through.obj(objectStream);

  function objectStream(file, enc, cb) {
    /* jshint validthis: true */

    var _this = this;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      _this.emit('error', pluginError('Streaming not supported'));
      return cb();
    }

    try {
      var relPath = path.relative(file.base, path.dirname(file.path));
      var contents = file.contents.toString();
      file.contents = new Buffer(expandUrl(contents, relPath, opts));
    } catch (err) {
      err.fileName = file.path;
      _this.emit('error', pluginError(err));
    }

    _this.push(file);
    cb();
  }
}

function pluginError(msg) {
  return new gutil.PluginError('gulp-strip-line', msg);
}


function expandUrl(content, relPath, opts) {
  if (!content) { return content; }

  var data    = content.toString();
  var matches;

  opts.regexp.lastIndex = 0;
  matches = opts.regexp.exec(data)
  if (!matches) { return data; }

  var expansion   = [opts.root, relPath, '$1'].join(opts.sep);
  var replacement = matches[0].replace(matches[1], expansion);
  return data.replace(opts.regexp, replacement);
}

module.exports = expandUrlPlugin;
