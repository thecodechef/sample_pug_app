gulp-extension-change
===============

```
gulp = require 'gulp'
extensionChange = require 'gulp-extension-change'

gulp.task 'extension-change', ->
  gulp
    .src './htdocs/**/*.html'
    .pipe extensionChange
      afterExtension: 'php'
      copy: true
    .pipe gulp.dest './'
```
