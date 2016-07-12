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

var gulp          = require('gulp'),
    $             = require('gulp-load-plugins')();

$.loadSubtasks('gulp',$);

gulp.task('watch', function() {
  gulp.watch(['./sass/**/*.{sass,scss,css}'], ['clean:css','build:css']);
  gulp.watch(['./babel/**/*.{coffee,js}'],    ['clean:js','build:js']);
  gulp.watch(['./templates/**/*.{pug,jade}'], ['clean:html','build:html']);
})

gulp.task('default', function() {
  runSequence(
    'build',
    'release'
  )
});