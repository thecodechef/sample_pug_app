var util = require('util');
var ProgressBar = require('progress');

/* istanbul ignore next */
module.exports = function progressBar(options) {
  if (!options.verbose) {
    return function noop() {};
  }

  return function response(res) {
    var total;
    var bar;

    if (res.headers['content-length']) {
      total = parseInt(res.headers['content-length'], 10);
    }

    if (total) {
      bar = new ProgressBar(
        util.format(' downloading "%s" [:bar] :percent :etas', options.fileName),
        {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: total
        }
      );
    }

    res.on('data', function onChunk(chunk) {
      if (bar) {
        bar.tick(chunk.length || 0);
      }
    });
  };
};
