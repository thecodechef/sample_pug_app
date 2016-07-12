"use strict";

var through = require("through2"),
	gutil = require("gulp-util"),
	includer = require("includer");

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		includer(file.path, opts, function (err, src) {
			if (err) {
				this.emit("error", new gutil.PluginError("gulp-includer", err));
			}
			file.contents = new Buffer(src);
			this.push(file);
			cb();
		}.bind(this));
	});
};
