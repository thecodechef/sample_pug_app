/*global describe, it*/
"use strict";

var fs = require("fs"),
	should = require("should");

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
	includer = require("../");

describe("gulp-includer", function () {

	var expectedFile = new gutil.File({
		path: "test/expected/entry.js",
		cwd: "test/",
		base: "test/expected",
		contents: fs.readFileSync("test/expected/entry.js")
	});

	it("should produce expected file via buffer", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/entry.js",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.readFileSync("test/fixtures/entry.js")
		});

		var stream = includer();

		stream.on("error", function (err) {
			should.exist(err);
			done(err);
		});

		stream.on("data", function (newFile) {
			process.nextTick(function () {

				should.exist(newFile);
				should.exist(newFile.contents);

				String(newFile.contents).should.equal(String(expectedFile.contents));
				done();
			});
		});

		stream.write(srcFile);
		stream.end();
	});
});
