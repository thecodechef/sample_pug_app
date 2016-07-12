#  Sample Pug App [![NPM version](https://badge.fury.io/js/sample_pug_app.svg)](http://badge.fury.io/js/sample_pug_app)

> A Simple Pug App Built With Bootstrap & Gulp

<a name="toc">
## Table of Contents
 + [Install](#install)
  + [Cloning](#cloning)
  + [Dependencies](#dependencies)
 + [Usage](#usage)
 + [Contributing](#contributing)
  + [Tests](#tests)
  + [Bug Reports](#bug-reports)
 + [Author](#author)
 + [License](#license)

<a name="install">
## Install

<a name="cloning">
### Cloning
```bash
cd path/to/project/folder
git clone https://www.github.com/thecodechef/sample_pug_app.git
```

<a name="dependencies">
### Dependencies
[NPM]("https://www.npmjs.com") & [BOWER]("https://www.bower.io")
---
```bash
cd path/to/project
npm install && bower install
```
_Note: Macs/Linux may need `sudo` in front of `npm install`_

<a name="usage">
## Usage
Add verb to your `gulpfile.js`:

```javascript
var verb = require("gulp-verb");

gulp.task('verb', function () {
  gulp.src(['.verbrc.md'])
    // dest filename is defined in options,
    // otherwise gulp will overwrite .verbrc.md
    .pipe(verb({dest: 'README.md'}))
    .pipe(gulp.dest('./'));
});
```

<a name= "contributing">
## Contribute

<a name="tests">
### Tests

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<a name="bug-reports">
### Bug Reporting

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<a name="auther">
## Author

**Jeremy Bolding**
 
+ [github/thecodechef](https://github.com/thecodechef)
+ [twitter/thecodechef](http://twitter.com/thecodechef) 

<a name="license">
## License
Copyright (c) 2016 Jeremy Bolding All Rights Reserved.
Licensed under the MIT license.

---

_This file was generated by [gulp-verb](https://github.com/assemble/gulp-verb) on July 12, 2016._

[Back to Top](#toc)