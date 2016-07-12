var fs = require('fs'),
    path = require('path'),
    url = require('url'),
	File = require('vinyl'),
    cheerio = require('cheerio'),
    through = require('through2'),
    extend = require('extend'),
    q = require('q');
module.exports=function(options){
	var defaults = {
		fragment: '*',//script|css|*
		createReadStream : fs.createReadStream
	};
	var fragments = {
		script : {
			selector: 'script:not([data-ignore=true], [data-remove=true])',
			ele:'<script type=\"text/javascript\"></script>',
			eleSelector:'script[type=\"text/javascript\"]:not([data-ignore=true], [data-remove=true],[src$=\".js\"])',
			getFileName: function(node) { return node.attr('src'); }
		},
		css : {
			selector: 'link[rel=stylesheet]:not([data-ignore=true], [data-remove=true])',
			ele:'<style type=\"text/css\"></style>',
			eleSelector:'style[type=\"text/css\"]:not([data-ignore=true], [data-remove=true],[href$=\".css\"])',
			getFileName: function(node) { return node.attr('href'); }
		}
	}
	//var selectedPresets = (options && options.presets && presets[options.presets]) ||
	 //                    presets[defaults.presets];
	options = extend({}, defaults, options);	 
    if(!fragments[options.fragment] && options.fragment!=='*'){
			console.log("unsupport fragment :" + options.fragment);
			return ;
    }
    resolveFragments(options,fragments);
	if(options.fragments.length<=0){
		return;
	}	
	function resolveFragments(options, fragments) {
		var _frag = [];
		if (options.fragment === '*') {
			for (var key in fragments) {
				_frag.push(fragments[key]);
			}
			
		}else{
			_frag.push(fragments[options.fragment]);
		} 
		options.fragments = _frag;
	}
	function makeAbsoluteFileName(file, fileName) {
		//return file.base + fileName; // path.join(file.base, fileName);
		return path.join(path.dirname(file.path), fileName);
	}
	function isRelative(path) {
		return (url.parse(path).protocol == null);
	}
    function streamToBuffer(stream) {
		var buffers = [];
		var deferred = q.defer();
		var totalLength = 0;
		stream.on('readable', function() {
			data = stream.read();
			if (data !== null) {
				buffers.push(data);
				totalLength += data.length;
			}
		});
		stream.on('error', function(err) {
			deferred.reject(err);
		});

		stream.on('end', function() {
			deferred.resolve(Buffer.concat(buffers, totalLength));
		});

		return deferred.promise;
	}
	function bufferToStream(buf){
        var _stream = through();
        _stream.write(buf);
        return _stream;
	}
	// Calls the callback for each matching in the contents, with an error object
	// and the filename.  callback(err, fileName).
	// fileName === null signals the end of the matches
	function transformFile(contents, callback) {
		var replaceScript=function($){
			var vBody = $('body');
		    if(!vBody){
			   console.log("invalid file");
           	   return;
			}
		    if(!!options.scriptFiles && options.scriptFiles.length>0){
             $(fragments.script.selector).each(function() {
               $(this).remove();
             });
             for(var i=0;i<options.scriptFiles.length;i++){
             	var newEle = $(fragments.script.ele);
             	newEle.attr('src',options.scriptFiles[i]);
             	//newEle.src = options.scriptFiles[i];
                vBody.append(newEle);
             }
			}
		};
		var replaceCssLink=function($){
			var vhead = $('head');
		    if(!vhead){
			   console.log("invalid file");
           	   return;
			}
		    if(!!options.cssFiles && options.cssFiles.length>0){
             $(fragments.css.selector).each(function() {
               $(this).remove();
             });
             for(var i=0;i<options.cssFiles.length;i++){
             	var newEle = $(fragments.css.ele);
             	newEle.attr('link',options.cssFiles[i]);
                vhead.append(newEle)
             }
			}
		}		
		var $ = cheerio.load(contents.toString());
		if(options.fragment==='*'){
			if (!$('body') || !$('head')) {
				console.log("invalid file");
				return;
			}
			replaceScript($);
			replaceCssLink($);
		}else if(options.fragment==='script'){
			if(!$('body')){
			   console.log("invalid file");
           	   return;
			}
            replaceScript($);
		}else if(options.fragment==='css'){
			if(!$('head')){
			   console.log("invalid file");
           	   return;
			}
			replaceCssLink($);
		}
		callback($.root());
	}	
	var transform = function(file, enc, callback){
		//console.log("------>"+file.path);
		var stream = this;
		stream.on('error', function(err) {
			console.log(err);
		});
		var bufferReadPromises = [];
		if(file.isNull()) {// No contents - do nothing
			stream.push(file);
			callback();
		}else if(file.isStream()){
           streamToBuffer(file.contents)
           .then(function(contents) {
				transformFile(contents,function(eleJQLite){
					file.contents = new Buffer(eleJQLite.html());
					stream.push(file);
					callback();
				});
				
			},
		function(err) {
			stream.emit('error', err);
		});
		}else if(file.isBuffer()){
              transformFile(file.contents,function(eleJQLite){
              	file.contents = new Buffer(eleJQLite.html());
              	stream.push(file);
              	callback();
              });		
              	
             
		}

	}	
	return through.obj(transform);	
}