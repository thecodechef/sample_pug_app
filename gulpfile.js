var gulp                       = require('gulp'),
    path                       = require('path'),
    colors                     = require('colors'),
    sleep                      = require('sleep'),
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

gulp.task('clean', function(cb) {
    runSequence(
      'clean:js',
      'clean:css',
      'clean:html',
      function (error) {
        if (error) {
          console.log('[clean]'.bold.magenta + ' There was an issue cleaning the Trash:\n'.bold.red + error.message);
        } else {
          console.log('[clean]'.bold.magenta + ' Finished successfully'.bold.green);
        }
        cb(error);
      }
    );
});

gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md')
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
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

gulp.task('cson', function() {
    return gulp.src('./_data/**/*.cson')
      .pipe($.cson())
      .pipe($.concat('settings.json'))
      .pipe(gulp.dest('./_data'));
});
gulp.task('build:html', function() {
  return gulp.src('./templates/index.pug')
    .pipe($.data(function(file) {
      return require('./_data/settings.json');
    }))
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('./_site'));
});

gulp.task('release', function(cb) {
  runSequence(
    'changelog',
    'commit-changelog',
    // 'create-new-tag',
    // 'github-release',
    function (error) {
      if (error) {
        console.log('[release]'.bold.magenta + ' There was an issue releasing themes:\n'.bold.red + error.message);
      } else {
        console.log('[release]'.bold.magenta + ' Finished successfully'.bold.green);
      }
      cb(error);
    }
  );
});

gulp.task('default',['bump'], function() {
  runSequence(
    'cson',
    'build:html',
    'release'
  )
});