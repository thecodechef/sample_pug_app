# gulp-git-committers [![Build Status](https://travis-ci.org/dciccale/gulp-git-committers.svg)](https://travis-ci.org/dciccale/gulp-git-committers)

> Get a committer list from a git repository with some sorting and formatting options.

## Install

```sh
$ npm install --save-dev gulp-git-committers
```

## Usage

```javascript
var gulp = require('gulp');
var committers = require('gulp-git-committers');

gulp.task('default', function () {
  return committers()
    .pipe(gulp.dest('./AUTHORS.txt'));
});
```

## Options

For a full list of options visit the official `git-committers` documentation.

[git-committers documentation](https://github.com/dciccale/git-committers/blob/master/README.md#options)

## License

MIT: [http://denis.mit-license.org](http://denis.mit-license.org)
