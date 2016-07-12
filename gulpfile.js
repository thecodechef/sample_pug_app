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



gulp.task('add:headers', function(file) {
    var filesIgnored = [
      '!./node_modules',
      '!./components',
      '!./bower_components',
      '!./*.md',
      '!./*.json',
      '!./LICENSE',
      '!./.gitignore',
      '!./.bowerrc'
    ];
    var version = getPackageJson().version,
        author  = getPackageJson().author,
        email   = getPackageJson().email,
        license = getPackageJson().license;
    
    var headerTmpl   = [
    '/*',
    ' *  Project:   Simple Pug App',
    ' *  Version:   v'+ version,
    ' *  Author:    '+ author,
    ' *  Email:     '+ email,
    ' *  ---------------------------------',
    ' *  Copyright: '+ new Date().getFullYear() +' All Rights Reserved.',
    ' *  License:   '+ license,
    ' */\n'
    ].join('\n');
    return gulp.src(['./**/*.*', filesIgnored])
      .pipe($.header(headerTmpl))
      .pipe(gulp.dest('./'));
    
    function getPackageJson() {
      return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    }
  });

gulp.task('watch', function() {
  gulp.watch(['./sass/**/*.{sass,scss,css}'], ['clean:css','build:css','add:headers']);
  gulp.watch(['./babel/**/*.{coffee,js}'],    ['clean:js','build:js','add:headers']);
  gulp.watch(['./templates/**/*.{pug,jade}'], ['clean:html','build:html','add:headers']);
})

gulp.task('default', function() {
  runSequence(
    'build',
    'release'
  )
});