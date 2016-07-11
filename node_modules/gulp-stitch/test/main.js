/*global describe, it*/
"use strict";

var fs = require("fs"),
	es = require("event-stream"),
	should = require("should");

var PluginError = require('gulp-util').PluginError;
var gulp = require('gulp');

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
	stitch = require("../");

describe("gulp-stitch", function () {

	var expectedFile = new gutil.File({
		path: "test/expected/foo_stitch.js",
		cwd: "test/",
		base: "test/expected",
		contents: fs.readFileSync("test/expected/foo_stitch.js")
	});

	it("should produce expected file via buffer", function (done) {

		var srcFile = new gutil.File({
			path: "test/test_out",
			cwd: "test/",
			base: "test/",
		  contents: new Buffer("test = 123")
		});

		var stream = stitch("output_file",['test/fixtures/js']);

		stream.on("error", function(err) {
			should.exist(err);
			done(err);
		});

		stream.on("data", function (newFile) {
			should.exist(newFile);
			should.exist(newFile.contents);
      srcFile.contents = newFile.contents;
		});
		stream.on("end", function () {
			done();
			String(srcFile.contents).should.equal(String(expectedFile.contents));
    });

    stream.write(srcFile);
    stream.end();

			//String(srcFile.contents).should.equal(String(expectedFile.contents));
	});

	it("should error on stream", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/hello.txt",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.createReadStream("test/fixtures/hello.txt")
		});

		var stream = stitch('dummy');

		stream.on("error", function(err) {
			should.exist(err);
			done();
		});

		stream.write(srcFile);
		stream.end();
	});

	it("should PluginError on stream", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/hello.txt",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.createReadStream("test/fixtures/hello.txt")
		});

    try {
		  var stream = stitch();
    }
    catch(err) {
      should.ok(err instanceof PluginError,'not an instance of PluginError');
      done();
    }
	});


	/*
	it("should produce expected file via stream", function (done) {

		var srcFile = new gutil.File({
			path: "test/fixtures/hello.txt",
			cwd: "test/",
			base: "test/fixtures",
			contents: fs.createReadStream("test/fixtures/hello.txt")
		});

		var stream = stitch("World");

		stream.on("error", function(err) {
			should.exist(err);
			done();
		});

		stream.on("data", function (newFile) {

			should.exist(newFile);
			should.exist(newFile.contents);

			newFile.contents.pipe(es.wait(function(err, data) {
				should.not.exist(err);
				data.should.equal(String(expectedFile.contents));
				done();
			}));
		});

		stream.write(srcFile);
		stream.end();
	});
	*/
});
