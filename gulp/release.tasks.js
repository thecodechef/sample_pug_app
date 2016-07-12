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
var conventionalChangelog       = require('gulp-conventional-changelog');
var conventionalGithubReleaser  = require('conventional-github-releaser');

module.exports = function(gulp, $) {
  
  gulp.task('generate:changelog', function() {
    return gulp.src('./CHANGLOG.md')
      .pipe(conventionalChangelog({
        preset: "angular"
      }))
      .pipe(gulp.dest('./'));
  });
  
  gulp.task('generate:todo', function() {
    return gulp.src(['./_site/**/*'])
      .pipe($.todo({
        fileName: 'TODO.md'
      }))
      .pipe($.size())
      .pipe($.duration())
      .pipe(gulp.dest('./'))
      .on('end', function() {
        return del(['./javascripts','./stylesheets']);
      });
  });
  
  gulp.task('generate:readme', function() {
    return gulp.src(['./.verbrc.md'])
      .pipe($.verb({dest: 'README.md'}))
      .pipe($.size())
      .pipe(gulp.dest('./'))
      .on('end', function() {
        return gulp.src('./README.md')
          .pipe($.alex())
          .pipe($.alex.reporter())
          .pipe($.duration())
          .pipe(gulp.dest('./'));
      });
  });
  
  gulp.task('bump', function() {
    return gulp.src(['./package.json','./bower.json'])
      .pipe($.if((Object.keys(argv).length === 2), $.bump()))
      .pipe($.if(argv.patch, $.bump()))
      .pipe($.if(argv.minor, $.bump({ type: 'minor' })))
      .pipe($.if(argv.major, $.bump({ type: 'major' })))
      .pipe(gulp.dest('./'));
  });
  
  gulp.task('commit-changes', function(cb) {
    return gulp.src('.')
      .pipe($.gitignore())
      .pipe($.git.add())
      .pipe($.git.commit('commit: Project Updated'))
      .pipe($.git.push("origin","master",cb));
  });
  
  gulp.task('create-new-tag', function() {
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
  
  gulp.task('github-release', function(done) {
    conventionalGithubReleaser({
      type: 'oauth',
      token: '9b5edae1a97f7600009ebe7bb7f15884b6e0bb56'
    }, {
      preset: 'angular'
    }, done);
  });
  
  gulp.task('originRemote', function(cb) {
    var baseHtml = "http://www.github.com/";
    var gitUser = "thecodechef";
    var gitRepo = "sample_pug_app";
    $.git.addRemote('origin', baseHtml + gitUser + '/' + gitRepo + '.git' ,cb);
  });
  
  gulp.task('release',function(){
    runSequence(
      'generate:readme',
      'generate:changelog',
      'generate:todo',
      'bump',
      'commit-changes',
      'create-new-tag',
      'github-release',
      function(error) {
        if (error) {
          console.log('[Releasing] '.bold.red + 'There was a problem when Releasing to Github.\n\n'.bold.red + error.message);
        } else {
          console.log('[Releasing] '.bold.green + 'Finished Releasing to Github.'.bold.green);
        }
      }
    )
  })
}