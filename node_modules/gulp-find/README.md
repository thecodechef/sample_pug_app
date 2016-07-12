# gulp-find 
[![Codacy Badge](https://api.codacy.com/project/badge/grade/32d3a1bc4bb34b3891efca49834c6adc)](https://www.codacy.com/app/se-panfilov/gulp-find)
[![bitHound Overall Score](https://www.bithound.io/github/se-panfilov/gulp-find/badges/score.svg)](https://www.bithound.io/github/se-panfilov/gulp-find)
[![bitHound Code](https://www.bithound.io/github/se-panfilov/gulp-find/badges/code.svg)](https://www.bithound.io/github/se-panfilov/gulp-find)
[![Code Climate](https://codeclimate.com/github/se-panfilov/gulp-find/badges/gpa.svg)](https://codeclimate.com/github/se-panfilov/gulp-find)
[![Build Status](https://travis-ci.org/se-panfilov/gulp-find.svg?branch=master)](https://travis-ci.org/se-panfilov/gulp-find)
[![npm version](https://badge.fury.io/js/gulp-find.svg)](http://badge.fury.io/js/x-date-core)
[![Dependency Status](https://david-dm.org/se-panfilov/gulp-find.svg)](https://david-dm.org/se-panfilov/gulp-find)
[![devDependency Status](https://david-dm.org/se-panfilov/gulp-find/dev-status.svg)](https://david-dm.org/se-panfilov/x-date-core#info=devDependencies)
[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/se-panfilov/gulp-find/blob/master/LICENSE)

## Overview
Simple text finder(files, streams) via gulp.

[![NPM](https://nodei.co/npm/gulp-find.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gulp-find/)

### Install

```shell
npm install --save-dev gulp-find
```

### Usage

##### Regex find

```javascript
var find = require('gulp-find');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(find(/foo(.{3})/g))
    .pipe(gulp.dest('build/file.txt'));
});
```

##### String find

```javascript
var find = require('gulp-find');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(find('bar'))
    .pipe(gulp.dest('build/file.txt'));
});
```
##### What if I need replace?

Use [gulp-replace][1] for string replace.

if you need first find, and replace after, you may combine `gulp-find` and `gulp-replace` via pipe

[1]:https://github.com/lazd/gulp-replace
