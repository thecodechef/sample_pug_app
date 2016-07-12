# gulp-bower-version

> Check if your Bower dependencies are out of date.

Based on [grunt-version-check](https://github.com/stevewillard/grunt-version-check).

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-bower-version`

## Usage

```javascript
var bowerVersion = require('gulp-bower-version');

gulp.task('bower-version', function() {
  return gulp.src('./bower.json')
    .pipe(bowerVersion());
});
```

## Options

#### showUpToDate
Type: `Boolean`
Default value: `false`

If true, dependencies that are out of date will be listed.

#### showPrerelease
Type: `Boolean`
Default value: `false`

If true, versions of dependencies are compared to prereleased versions and not the last stable version.