/*
 * Sort stdout
 */

'use strict';

var _ = require('lodash');

// Sort types
var SORT_METHODS = {
  alphabetical: 'sort',
  chronological: 'reverse'
};

module.exports = function (sort, stdout) {
  if (SORT_METHODS[sort]) {
    stdout = _.unique(stdout[SORT_METHODS[sort]]());
  }
  return stdout;
};
