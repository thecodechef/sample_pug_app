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
  
  // gulp.task('generate:todo', function() {
  //   return gulp.src('./_site/**/*.*')
  //     .pipe($.notes({
  //       fileName: 'TODO.md',
  //       formats:[
  //         ['/*','*/'],
  //         ['//','\n'],
  //         ['<!--','-->']
  //       ],
  //       teamplates: {
  //         header: '# TODO',
  //         label: '## <%= label %>',
  //         note: '* <%= note %> - <%= fileName %> | <%= lineNumber %>\n',
  //         empty: '\nNo more TODO\'s or FIXME\'s need to be done.',
  //         footer: 'Generated: **<%= dateCreated %>**'
  //       }
  //     }))
  //     .pipe(gulp.dest('./'))
  // });
  
  gulp.task('generate:license', function() {
    if (fs.readFileSync('./LICENSE')) {
      console.log('[License Already Exists]'.bold.blue);
    } else {
      return fs.writeFileSync('./LICENSE',$.license('MIT',{tiny: false, organization: 'Simple Pug App'}));
    }
  });
  
  gulp.task('generate:readme', function() {
      // content
  });
  
  gulp.task('generate:gitignore', function() {
    if (fs.readFileSync('./.gitignore')) {
      console.log('[GitIgnore Already Exists]'.bold.blue);
    } else {
      return fs.writeFileSync('./.gitignore','./_site\n./node_modules\n./components\n./bower_components\n');
    }
  });
  
  gulp.task('bump-version', function() {
    return gulp.src(['./package.json','./bower.json'])
      .pipe($.if((Object.keys(argv).length === 2), $.bump()))
      .pipe($.if(argv.pre,   $.bump({ type: 'prerelease'})))
      .pipe($.if(argv.patch, $.bump()))
      .pipe($.if(argv.minor, $.bump({ type: 'minor' })))
      .pipe($.if(argv.major, $.bump({ type: 'major' })))
      .pipe(gulp.dest('./'));
  });
  
  gulp.task('commit-changes', function() {
    var commitMessage = argv.message || "chore: update README.md";
    return gulp.src('.')
      .pipe($.git.add())
      .pipe($.git.commit(commitMessage));
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
    $.git.addRemote('origin', baseHtml + argv.gituser + '/' + argv.gitrepo ,cb);
  });
  
  gulp.task('release',function(){
    runSequence(
      'generate:gitignore',
      // 'generate:readme',
      'generate:changelog',
      'generate:license',
      // 'generate:todo',
      'bump-version',
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