var gulp = require('gulp');
var bowerVersion = require('./');
var eslint = require('gulp-eslint');

gulp.task('default', ['bower-version', 'lint']);

gulp.task('bower-version', function() {
  return gulp.src('./test/bower.json')
    .pipe(bowerVersion({
      showUpToDate: false,
      showPrerelease: false
    }));
});

gulp.task('lint', function () {
  return gulp.src(['*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});