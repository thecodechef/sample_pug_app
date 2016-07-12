'use strict';

var assert = require('assert');
var committers = require('./');

it('should produce expected result', function (done) {
  committers().on('data', function (file) {
    var contents = file.contents.toString().trim();
    assert.equal(contents, 'Denis Ciccale');
    done();
  });
});
