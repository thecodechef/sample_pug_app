var gulp = require('gulp');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var codeclimate = require('gulp-codeclimate-reporter');
var downloader = require('./');

gulp.task('download', function download() {
  return downloader([
    'http://img-9gag-fun.9cache.com/photo/am8KKrV_460s.jpg',
    'http://img-9gag-fun.9cache.com/photo/aBrjobD_460s.jpg',
    {
      fileName: 'gulp-downloader.zip',
      request: {
        url: 'https://github.com/MrBoolean/gulp-downloader/archive/master.zip'
      }
    }
  ], { verbose: true })
    .pipe(gulp.dest('./dist'))
  ;
});

gulp.task('lint', function lint() {
  return gulp
    .src(['index.js', 'gulpfile.js', 'lib/**/*.js', 'test/**/*.test.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('test.instrument', function instrument() {
  return gulp
    .src(['index.js', 'lib/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
  ;
});

gulp.task('test', ['test.instrument'], function test() {
  return gulp
    .src(['test/**/*.test.js'])
    .pipe(mocha({
      require: ['./test/bootstrap']
    }))
    .pipe(istanbul.writeReports({
      dir: './dist/report'
    }))
  ;
});

gulp.task('codeclimate', function sendToCodeclimate() {
  return gulp
    .src(['dist/report/lcov.info'], { read: false })
    .pipe(codeclimate({
      token: '4feb2d83c00898022b94c985b36d7bef9759427f938518bdbe17a3f47ce67ec0'
    }))
  ;
});

gulp.task('default', ['lint', 'test']);
