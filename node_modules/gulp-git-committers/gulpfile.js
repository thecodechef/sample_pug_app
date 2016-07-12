'use strict';

var gulp = require('gulp');
var committers = require('./index');

gulp.task('default', function () {
  committers().pipe(gulp.dest('./AUTHORS.txt'));
});
