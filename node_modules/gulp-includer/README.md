# [gulp][gulp-url]-includer
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Concatenate JavaScript files with [Includer][includer-url] as a [gulp][gulp-url] plugin.

## Usage

First, install `gulp-includer` as a development dependency:

```shell
npm install --save-dev gulp-includer
```

Then, add it to your `gulpfile.js`:

```javascript
var includer = require("gulp-includer");

gulp.src("./js/app.js", { read:false })
	.pipe(includer(options))
	.pipe(gulp.dest("./dist"));
```

## API

### includer(options)

These options are passed directly to [Includer's options argument](https://github.com/timrwood/includer#options).

#### [options.separator](https://github.com/timrwood/includer#separator)
Type: `String`  
Default: `\n`

The string to use to join files together.

#### [options.wrap](https://github.com/timrwood/includer#wrap)
Type: `Function`  
Default: `function (src) { return '(function(){' + src + '})()'; }`

A function to optionally wrap each file in a closure.

#### [options.debug](https://github.com/timrwood/includer#debug)
Type: `Boolean|Function`  
Default: `false`

Sometimes included globs have no matches. Includer will skip these globs silently.

If the `debug` option is true, a notification will be logged to the console when globs have no matches.

If the `debug` option is a function, it will be called with the debug message as the only parameter.

```js
includer({
	debug : function (message) {
		logs.push(message);
	}
});
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[gulp-url]: https://github.com/wearefractal/gulp
[includer-url]: https://github.com/timrwood/includer

[npm-url]: https://npmjs.org/package/gulp-includer
[npm-image]: https://badge.fury.io/js/gulp-includer.png

[travis-url]: http://travis-ci.org/timrwood/gulp-includer
[travis-image]: https://secure.travis-ci.org/timrwood/gulp-includer.png?branch=master

[coveralls-url]: https://coveralls.io/r/timrwood/gulp-includer
[coveralls-image]: https://coveralls.io/repos/timrwood/gulp-includer/badge.png

[depstat-url]: https://david-dm.org/timrwood/gulp-includer
[depstat-image]: https://david-dm.org/timrwood/gulp-includer.png
