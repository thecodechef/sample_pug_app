
# gulp-stitch
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> stitch plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-stitch` as a development dependency:

```shell
npm install --save-dev gulp-stitch
```

Then, add it to your `gulpfile.js`:

```javascript
var stitch = require("gulp-stitch");

gulp.src("./src/*.ext")
	.pipe(stitch('pkg.js',['./src']))
	.pipe(gulp.dest("./dist"));
```

## API

### stitch(options)

#### options.msg

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-stitch
[npm-image]: https://badge.fury.io/js/gulp-stitch.png

[travis-url]: http://travis-ci.org/someuser/gulp-stitch
[travis-image]: https://secure.travis-ci.org/someuser/gulp-stitch.png?branch=master

[coveralls-url]: https://coveralls.io/r/someuser/gulp-stitch
[coveralls-image]: https://coveralls.io/repos/someuser/gulp-stitch/badge.png

[depstat-url]: https://david-dm.org/someuser/gulp-stitch
[depstat-image]: https://david-dm.org/someuser/gulp-stitch.png
