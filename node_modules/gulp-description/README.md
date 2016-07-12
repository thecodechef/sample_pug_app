# gulp-description [![Build Status](https://travis-ci.org/Horyuji/gulp-description.svg)](https://travis-ci.org/Horyuji/gulp-description)


it gulp help setting. the detail description for gulp all task.

## Install

```sh
$ npm install --save-dev gulp-description
```

## Usage

```js

const gulp = require('gulp');
const gulpDep = require('gulp-description');

let description = {
  "main":[
    "test1"
  ],
  "description":{
    "test0" : "test0 description",
    "test1" : "test1 description",
    "test2" : "test2 description",
    "test3" : "test3 description",
  }
};

gulp.task('help', ()=> gulpDep.help(description));

```

#### main

gulp main task list

#### description

all gulp task description

### gulp task description is main only

```javascript

  gulp.task('help', ()=> gulpDep.help(description));

```

### all gulp task description

```javascript

  gulp.task('help:all', ()=> gulpDep.all(description));

```

### gulp task dependency state

```javascript

  gulp.task('help:dep', ()=> gulpDep.dependency(description));

```

## License

MIT © M.Sakamaki
