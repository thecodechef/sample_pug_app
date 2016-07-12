var gulp = require('gulp');
var npmVersion = require('./');
var eslint = require('gulp-eslint');

gulp.task('default', ['npm-version', 'lint']);

gulp.task('npm-version', function() {
  return gulp.src('./package.json')
    .pipe(npmVersion({
      showUpToDate: false
    }));
});

gulp.task('lint', function () {
  return gulp.src(['*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});