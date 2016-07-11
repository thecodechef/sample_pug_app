var gulp                       = require('gulp'),
    path                       = require('path'),
    colors                     = require('colors'),
    sleep                      = require('sleep'),
    mergeJson                  = require('gulp-merge-json'),
    runSequence                = require('run-sequence'),
    conventionalChangelog      = require('gulp-conventional-changelog'),
    conventionalGithubReleaser = require('conventional-github-releaser'),
    argv                       = require('yargs').argv,
    del                        = require('del'),
    fs                         = require('fs'),
    _                          = require('lodash'),
    $                          = require('gulp-load-plugins')();


gulp.task('bump', function(cb) {
  runSequence(
    'bump-version',
    'commit-version',
    function (error) {
      if (error) {
        console.log('[bump]'.bold.magenta + ' There was an issue bumping version:\n'.bold.red + error.message);
      } else {
        console.log('[bump]'.bold.magenta + ' Finished successfully'.bold.green);
      }
      cb(error);
    }
  );
});

gulp.task('bump-version', function() {
  return gulp.src(['bower.json','./package.json'])
    .pipe($.if((Object.keys(argv).length === 2), $.bump()))
    .pipe($.if(argv.patch, $.bump()))
    .pipe($.if(argv.minor, $.bump({ type: 'minor' })))
    .pipe($.if(argv.major, $.bump({ type: 'major' })))
    .pipe(gulp.dest('./'));
});

gulp.task('clean:js', function(cb) {
  return del(['./_site/javascripts/*.js']);
});

gulp.task('clean:css', function(cb) {
  return del(['./_site/stylesheets/*css']);
});

gulp.task('clean:html', function(cb) {
  return del(['./_site/*.html']);
});

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md')
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('generate:license', function() {
  return gulp.src('LICENSE')
    .pipe($.license('MIT', {organization: "Simple Pug App",tiny: false}))
    .pipe(gulp.dest('./'))
});

gulp.task('commit-version', function() {
  return gulp.src('.')
    .pipe($.git.add())
    .pipe($.git.commit('chore: bump version number'));
});

gulp.task('commit-changelog', function() {
  return gulp.src('.')
    .pipe($.git.add())
    .pipe($.git.commit('chore: update CHANGELOG.md'));
});

gulp.task('create-new-tag', function(cb) {
  var version = getPackageJsonVersion();

  $.git.tag('v' + version, 'version: ' + version, function (error) {
    if (error) {
      return cb(error);
    }
    $.git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  }
});

gulp.task('cson', function(file) {
  return gulp.src('./_data/cson/*.cson')
    .pipe($.cson())
    .pipe(gulp.dest('./_data'));
});

gulp.task('build:data',['cson'], function() {
  return gulp.src('./_data/*.json')
    .pipe(mergeJson('settings.json'))
    .pipe(gulp.dest('./_data/'))
    .on('end', function(){
      return del(['./_data/*.json','!./_data/settings.json']);
    });
});

gulp.task('build:scripts',['clean:js'], function() {
  return gulp.src(['./babel/**/*.babel.js'])
    .pipe($.babel())
    .pipe($.concat('scripts.js'))
    .pipe($.license('MIT', {organization: "Simple Pug App",tiny: false}))
    .pipe($.if(argv.production, $.uglify()))
    .pipe($.if(argv.production, $.rename({extname: '.min.js'})))
    .pipe(gulp.dest('./_site/javascripts/'));
});

gulp.task('build:styles',['clean:css'], function() {
  return gulp.src(['./sass/**/*.scss','!./sass/_**/*.scss','!./sass/_settings.scss'])
    .pipe($.sass())
    .pipe($.concat('styles.css'))
    .pipe($.license('MIT', {organization: "Simple Pug App",tiny: false}))
    .pipe($.if(argv.production, $.csso()))
    .pipe($.if(argv.production, $.rename({extname: '.min.css'})))
    .pipe(gulp.dest('./_site/stylesheets/'));
});

gulp.task('build:html',['clean:html'], function() {
  return gulp.src('./templates/index.pug')
    .pipe($.data(function(){
      return require('./_data/settings.json');
    }))
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('./_site'))
    .pipe($.if(argv.production, $.replace("./stylesheets/styles.css","./stylesheets/styles.min.css")))
    .pipe($.if(argv.production, $.replace("./javascripts/scripts.js","./javascripts/scripts.min.js")))
    .pipe($.if(argv.production, $.replace("../components/tether/dist/js/tether.js","../components/tether/dist/js/tether.min.js")))
    .pipe(gulp.dest('./_site'));
});

gulp.task('build', function(cb) {
  runSequence(
    'generate:license',
    'build:scripts',
    'build:styles',
    'build:data',
    'build:html',
    function (error) {
      if (error) {
        console.log('[build]'.bold.magenta + ' There was an issue building:\n'.bold.red + error.message);
      } else {
        console.log('[build]'.bold.magenta + ' Finished successfully'.bold.green);
      }
      cb(error);
    }
  );
});

gulp.task('release', function(cb) {
  runSequence(
    'changelog',
    'commit-changelog',
    // 'create-new-tag',
    // 'github-release',
    function (error) {
      if (error) {
        console.log('[release]'.bold.magenta + ' There was an issue releasing project:\n'.bold.red + error.message);
      } else {
        console.log('[release]'.bold.magenta + ' Finished successfully'.bold.green);
      }
      cb(error);
    }
  );
});

gulp.task('default', function() {
  runSequence(
    'build',
    'bump',
    'release'
  )
});