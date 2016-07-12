var runSequence                 = require('run-sequence');
var del                         = require('del');
var argv                        = require('yargs').argv;
var sleep                       = require('sleep');
var colors                      = require('colors');
var path                        = require('path');
var pump                        = require('pump');
var _                           = require('lodash');
var fs                          = require('fs');
var merge                       = require('merge-stream');
var vinylPaths                  = require('vinyl-paths');

module.exports = function(gulp, $) {
  gulp.task('clean:js', function(cb) {
    return del(['./_site/javascripts/*.js']);
    cb();
  });
  
  gulp.task('clean:css', function(cb) {
    return del(['./_site/stylesheets/*.css']);
    cb();
  });
  
  gulp.task('clean:html', function(cb) {
    return del(['./_site/*.html']);
    cb();
  });
  
  gulp.task('clean', function() {
    runSequence(
      'clean:js',
      'clean:css',
      'clean:html',
      function(error) {
        if(error){
          console.log('[Cleaning] '.bold.red + 'There was a problem cleaning out the trash.\n\n'.bold.red + error.message)
        } else {
          console.log('[Cleaning] '.bold.green + 'Finished cleaning the Trash Successfully.'.bold.green)
        }
      }
    )
  });
}