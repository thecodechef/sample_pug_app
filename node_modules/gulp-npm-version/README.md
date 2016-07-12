# gulp-npm-version

> Checks if your NPM dependencies are out of date.

Based on [grunt-version-check](https://github.com/stevewillard/grunt-version-check).

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-npm-version`

## Usage

```javascript
var npmVersion = require('gulp-npm-version');

gulp.task('npm-version', function() {
  return gulp.src('./package.json')
    .pipe(npmVersion());
});
```

## Options

#### showUpToDate
Type: `Boolean`
Default value: `false`

If true, dependencies that are out of date will be listed.