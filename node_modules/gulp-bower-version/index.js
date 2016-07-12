'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');
var semver = require('semver');
var bower = require('bower');

// Consts
const PLUGIN_NAME = 'gulp-bower-version';

// Plugin level function(dealing with files)
var gulpBowerVersion = function (options) {

  //var dependencyCalls = [];
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
      //npm.load({}, function() {

          /*async.parallel(dependencyCalls, function(err, results) {
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
          });*/
        //});
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
          bower.commands
            .info(dependency.name, '')
            .on('end', function(results) {
              var latest = results.latest.version;
              if (options.showPrerelease || value.indexOf('-') > -1) {
                latest = results.versions[0];
              }
              if (!semver.satisfies(latest, dependency.version)) {
                gutil.log(dependency.name + ' is out of date. Your version: ' + dependency.version + ' latest: ' + latest);
              } else {
                if (options.showUpToDate) {
                  gutil.log(dependency.name + ' is up to date.');
                }
              }
            });
          //bowerCallback(dependency);
        } else {
          gutil.log('Incorrect semver for ' + key + ' : ' + value);
        }
        //dependencyCalls.push(bowerCallback(dependency));
      });
      //gutil.log(allDependencies);
    }
    cb(null, file);
  });
};
/*
function bowerCallback(dependency) {
  return function(callback) {
    bower.commands
      .info(dependency.name, '')
      .on('end', function(results) {
        var latest = results.versions[0];

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
*/
// Exporting the plugin main function
module.exports = gulpBowerVersion;
