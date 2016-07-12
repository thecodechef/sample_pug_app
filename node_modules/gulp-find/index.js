'use strict';

var Transform = require('readable-stream/transform');
var rs = require('replacestream');

module.exports = function (search) {
  return new Transform({
    objectMode: true,
    transform: function (file, enc, callback) {

      if (file.isNull()) return callback(null, file);

      function doSearch() {
        var result;

        if (file.isStream()) {
          file.contents = file.contents.pipe(rs(search));
        } else if (file.isBuffer()) {
          result = String(file.contents).match(search) || [];
          file.contents = new Buffer(result.join(','));
        }

        return callback(null, file);
      }

      doSearch();
    }
  });
};
