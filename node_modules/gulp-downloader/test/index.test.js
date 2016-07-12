var PluginError = require('gulp-util').PluginError;
var download = require('../');

describe('gulp-downloader', function gulpDownloaderTest() {
  var mock;

  before(function runBefore() {
    mock = require('./mock');
  });

  after(function runAfter() {
    mock.done();
  });

  it('throws an error if the passed argument is undefined', function throwsAnErrorTest() {
    (function shouldThrow() {
      download();
    }).should.throw(PluginError);
  });

  it('uses the original fileName if the passed argument is a string', function originalFileName(done) {
    download('http://gulp-downloader.com/test.jpg')
      .on('data', function onData(file) {
        file.path.substr(-8).should.equal('test.jpg');
        done();
      })
    ;
  });

  it('accept arrays', function arrayTest() {
    var streamed = [];

    download([
      'http://gulp-downloader.com/test.jpg',
      {
        fileName: 'asdf.jpg',
        request: {
          url: 'http://gulp-downloader.com/test.jpg'
        }
      }
    ])
      .on('data', function onData(file) {
        streamed.push(file);
      })
      .on('end', function onEnd() {
        streamed.should.have.length(2);
        streamed[0].path.substr(-8).should.equal('test.jpg');
        streamed[1].path.substr(-8).should.equal('asdf.jpg');
      })
    ;
  });
});
