# gulp-decorate-index
合并页面中引用文件到当前页面
## Usage

First, install `gulp-decorate-index` as a development dependency:

```shell
npm install --save-dev gulp-decorate-index
```

Then, add it to your `gulpfile.js`:

```javascript
var decorate-index = require("gulp-decorate-index");

gulp.src("./src/index.html")
	.pipe(merge-fragment({
        "fragment":"*",
         "scriptFiles":["js/a.js"
                         ,"js/b.js"
                        ],
         "cssFiles":["aa.css"]))
	.pipe(gulp.dest("./dist"));
```

## API

### merge-fragment(options)

#### options.msg
Type: `String`  
Default: `Hello World`

The message you wish to attach to file.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)