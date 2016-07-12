var File, assign, clone, defOpts, fs, ref, through;
through = require('through2');
File = require('gulp-util').File;
ref = require('lodash'), assign = ref.assign, clone = ref.clone;
fs = require('fs');
defOpts = {
  afterExtension: 'php',
  copy: false
};
module.exports = function(opts) {
  var afterExtension, copy, ref1, transform;
  ref1 = assign(clone(defOpts), opts), afterExtension = ref1.afterExtension, copy = ref1.copy;
  transform = function(file, encode, callback) {
    var afterFilePath, beforeFilePath, filePathArr;
    beforeFilePath = file.path;
    filePathArr = beforeFilePath.match(/(^.+)(\..+$)/);
    afterFilePath = filePathArr[1] + "." + afterExtension;
    file.path = afterFilePath;
    file.contents = new Buffer(file.contents, 'utf-8');
    this.push(file);
    if (!copy) {
      fs.unlink(beforeFilePath, function(err) {
        if (err) {
          return console.log("successfully deleted " + beforeFilePath);
        }
      });
    }
    return callback();
  };
  return through.obj(transform);
};
