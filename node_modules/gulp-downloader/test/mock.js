var nock = require('nock');
var fs = require('fs');
var mock = nock('http://gulp-downloader.com');

mock
  .get('/test.jpg')
  .times(3)
  .reply(200, fs.readFileSync(__dirname + '/test.jpg'))
;

module.exports = mock;
