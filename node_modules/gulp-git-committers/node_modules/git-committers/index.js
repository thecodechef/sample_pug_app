'use strict';

var exec = require('child_process').exec;
var os = require('os');
var _ = require('lodash');
var Stream = require('stream');

var format = require('./format');
var sort = require('./sort');

module.exports = function (opts, callback) {
  var stream = new Stream;
  var defaults = {
    sort: 'chronological', // alphabetical, commits
    email: false, // Show emails in the output
    nomerges: false, // Only works when sorting by commits
  };
  var cmd = 'git';
  var child;

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var options = _.extend({}, defaults, opts);

  if (options.sort === 'chronological' || options.sort === 'alphabetical') {
    cmd += ' log --pretty="%aN';

    // Show email
    if (options.email) {
      cmd += ' <%aE>';
    }

    cmd += '"';

  // Sort by number of commits
  } else if (options.sort === 'commits') {
    cmd += ' shortlog -ns';

    // Show email
    if (options.email) {
      cmd += 'e';
    }

    // Omit merge commits
    if (options.nomerges) {
      cmd += ' --no-merges';
    }

    // Detect current system use the appropriate terminal
    if (/win32/.test(process.platform)) {
      cmd += ' < CON';
    } else {
      cmd += ' < /dev/tty';
    }
  }

  child = exec(cmd, function (err, stdout, stderr) {
    callback = typeof callback === 'function' ? callback : console.log;
    if (err) {
      stream.emit('data', stderr);
      stream.emit('end', err);
      callback(err, stdout);
    } else {
      stdout = format(stdout);
      stdout = sort(options.sort, stdout);
      stdout = stdout.join(os.EOL);
      stream.emit('data', stdout);
      callback(null, stdout);
    }
  });

  child.on('close', function () {
    stream.emit('end');
  });

  return stream;
};
