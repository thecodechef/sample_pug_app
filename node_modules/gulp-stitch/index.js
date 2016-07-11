var stitch=require('stitch');
var path=require('path');
var through = require("through2"),
	gutil = require("gulp-util");

var File = gutil.File;

module.exports = function (fileName,pathList,id) {
	"use strict";

  if (!fileName) {
    throw new gutil.PluginError("gulp-stitch", "No fileName supplied");
  }
  if (!pathList) pathList= [];
  if (!id) id= 'require';

  var filePathList=pathList;
  var firstFile = null;
  var moduleList = [];

	// see "Writing a plugin"
	// https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
	function transform(file,enc,callback) {
		/*jshint validthis:true*/

		// Do nothing if no contents
    if(file.isNull()) {
      this.push(file);
			return callback();
    }

		if (file.isStream()) {

			// http://nodejs.org/api/stream.html
			// http://nodejs.org/api/child_process.html
			// https://github.com/dominictarr/event-stream

			// accepting streams is optional
			this.emit("error",
				new gutil.PluginError("gulp-stitch", "Stream content is not supported"));
			return callback();
		}


    if (!firstFile) firstFile = file;  
    var f = file.relative.replace(/\.js$/,'');
    moduleList.push("'"+f+"':1");
		callback();

	}

  function endStream(cb) {

    if(firstFile) {
        var stitch_package = stitch.createPackage({
          paths: filePathList,
          identifier: id
        });

        var that = this;

        var joinedPath = path.join(firstFile.base , fileName);

        stitch_package.compile(function (err, source){
          var file = new File({
             cwd: firstFile.cwd,
             base: firstFile.base,
             path: joinedPath,
             stat: firstFile.stat
          });
          var list=id+'.modules = {'+moduleList.join(',\n')+'};\n';
          file.contents=new Buffer(source+list);
          that.push(file);
          cb();
        });
    }
    else {
      cb();
    }
  }

	return through.obj(transform,endStream);
};
