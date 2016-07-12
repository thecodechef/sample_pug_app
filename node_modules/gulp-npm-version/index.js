'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var semver = require('semver');
var npm = require('npm');
var async = require('async');

// Consts
const PLUGIN_NAME = 'gulp-npm-version';

// Plugin level function(dealing with files)
var gulpNpmVersion = function (options) {

  var dependencyCalls = [];
  //var done = async();
  options = options || {};
  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      //gutil.log('File is null');
      return cb(null, file);
    }
    if (file.isStream()) {
      //gutil.log('File is stream');
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb(null, file);
    }
    if (file.isBuffer()) {
      //gutil.log('File is buffer');
      var json = JSON.parse(file.contents);
      var allDependencies = _.merge(json.dependencies || {}, json.devDependencies || {}, json.optionalDependencies || {});
      npm.load({}, function() {

          async.parallel(dependencyCalls, function(err, results) {
            _.each(_.sortBy(results, sortFunc), function(result) {
              if (!result.upToDate) {
                gutil.log(result.name + ' is out of date. Your version: ' + result.version + ' latest: ' + result.latest);
              } else {
                if (options.showUpToDate) {
                  gutil.log(result.name + ' is up to date.');
                }
              }
            });
            //done();
          });
        });
      _.each(allDependencies, function(value, key) {
        if (value.indexOf('#') > -1) {
          gutil.log('Custom semver for ' + key + ' : ' + value);
          var split = value.split('#');
          key = split[0];
          value = split[1];
        }
        if (semver.validRange(value)) {
          var dependency = {
            'name': key,
            'version': value
          };
          npmCallback(dependency);
        } else {
          gutil.log('Incorrect semver for ' + key + ' : ' + value);
        }
        dependencyCalls.push(npmCallback(dependency));
      });
      //gutil.log(allDependencies);
    }
    cb(null, file);
  });
};

function npmCallback(dependency) {
  return function(callback) {
    npm.commands.info([dependency.name, 'version'], true, function(err, data) {
      if (!data || !Object.keys(data).length) {
        return callback(null, _.merge({
          latest : 'unknown',
          upToDate : true
        }, dependency));
      }
      // Data is structured as: { '1.2.1': { version: '1.2.1' } } so get the first key of the object
      var latest = data[Object.keys(data)[0]].version;

      callback(null, _.merge({
        latest : latest,
        upToDate : semver.satisfies(latest, dependency.version)
      }, dependency));
    });
  };
}

function sortFunc(dep) {
  return dep.name.toLowerCase();
}

// Exporting the plugin main function
module.exports = gulpNpmVersion;
