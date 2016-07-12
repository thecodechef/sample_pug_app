# gulp-collect

`gulp-collect` collects all the (vinyl) files from a stream,
and then calls a given callback once to process all of them.

## Example

Here is a dummy example which sorts files by name
and then adds properties to the file object to build a doubly linked list.

```js
var gulp = require("gulp");
var collect = require("gulp-collect");

gulp.task("default", function() {
  return gulp.src("src/**")
    .pipe(collect.list(function(files) {
      files.sort(function(a, b) {
        if (a.relative < b.relative) return -1;
        if (a.relative > b.relative) return +1;
        return 0;
      });
      var prev = files[0];
      for (var i = 1; i < files.length; ++i) {
        var next = files[i];
        prev.nextPath = next.relative;
        next.prevPath = prev.relative;
      }
      return files;
    }))
    .pipe(gulp.dst("build"));
});
```

## API

```
collect.list(handler)
collect.dict(handler)
```

The plugin exports two different functions.
A stream created using `collect.list` will pass the files as a list to
the handler.
A stream created using `collect.dict` will instead build a dictionary
using relative path names as keys.
The latter is very similar to how Metalsmith operates,
but the files are still vinyl file objects as gulp uses them.

The handler function has different options regarding its return values.

* The handler may return an array or dictionary object.
  Even a `collect.list` handler may return a dictionary
  or a `collect.dict` handler may return an array.
  The keys of an array are ignored, so if you want to rename a file
  make sure that you actually modify its path in the vinyl object.

* The handler may return a promise. The value of the promise can be as
  described above.

* The transform stream callback is passed on as a second argument
  to the handler.
  So the stream may return nothing, but instead call that function
  at any time to either signal an error (first argument to the callback)
  or a single file (second argument).
  Before calling the callback, the handler may call `this.push`
  to push any number of output files.
