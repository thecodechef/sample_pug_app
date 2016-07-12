/*
 * Format stdout
 */

'use strict';

var _ = require('lodash');

module.exports = function (stdout) {
  var maxcol = 0;
  var pad = ' ';

  return _.trim(stdout).split('\n').map(function (l) {
    var numl = l.match(/\d+/);

    if (numl) {
      numl = numl[0].length;
      maxcol = numl > maxcol ? numl : maxcol;
      pad = '  ' + new Array(maxcol - numl + 1).join(' ');
    }

    return _.trim(l.replace(/\t+/, pad));
  });
};
