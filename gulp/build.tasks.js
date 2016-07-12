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
  gulp.task('build:js', function() {
    return gulp.src(['./babel/**/*.babel.js'])
      .pipe($.cached())
      .pipe($.babel())
      .pipe($.concat('scripts.js'))
      .pipe(gulp.dest('./_site/javascripts'))
      .pipe($.if(argv.production, $.uglify(), $.nop()))
      .pipe($.if(argv.production, $.rename({extname: '.min.js'}), $.nop()))
      .pipe(gulp.dest('./_site/javascripts'));
  });
  
  gulp.task('build:css', function() {
    return gulp.src(['./sass/**/*.{sass,scss}','!./sass/_**/*.{sass,scss}'])
      .pipe($.cached())
      .pipe($.sass())
      .pipe($.concat('styles.css'))
      .pipe(gulp.dest('./_site/stylesheets'))
      .pipe($.if(argv.production, $.csso(), $.nop()))
      .pipe($.if(argv.production, $.rename({extname: '.min.css'}), $.nop()))
      .pipe(gulp.dest('./_site/stylesheets'));
  });
  
  gulp.task('build:data', function() {
    return gulp.src('./_data/cson/*.cson')
      .pipe($.cached())
      .pipe($.cson())
      .pipe(gulp.dest('./_data'))
      .pipe($.mergeJson('settings.json'))
      .pipe(gulp.dest('./_data'));
  });
  
  gulp.task('build:html',['build:data'], function() {
    return gulp.src(['./templates/*.pug'])
      .pipe($.cached())
      .pipe($.data(function(){
        return require('../_data/settings.json');
      }))
      .pipe($.pug({pretty: true}))
      .pipe(gulp.dest('./_site'))
  });
  
  gulp.task('build', function(){
    runSequence(
      'build:js',
      'build:css',
      'build:html',
      function(error) {
        if(error) {
          console.log('[Building] '.bold.red + 'There was a problem in the building process.\n\n'.bold.red + error.message);
        } else {
          console.log('[Building] '.bold.green + 'Finished Building the WebApp.'.bold.green);
        }
      }
    )
  })
}