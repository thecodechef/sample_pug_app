'use strict';

var assert = require('assert');

var gitCommitters = require('./index');

gitCommitters(function (err, output) {
  if (err) throw err;
  assert.equal(output, 'Denis Ciccale');
}, 'Should show committer full name');

gitCommitters({email: true}, function (err, output) {
  if (err) throw err;
  assert.equal(output, 'Denis Ciccale <dciccale@gmail.com>');
}, 'Should retrieve email');
