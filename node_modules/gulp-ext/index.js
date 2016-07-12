'use strict';

var through = require('through2');
var p = require('path');

function endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function append(path, ext) {
    if (!ext) { return path; }
    if (ext && ext[0] !== '.') { ext = '.' + ext; }
    return p.join(p.dirname(path), p.basename(path) + ext);
}

function replace(path, ext, pattern) {
    if (ext && ext[0] !== '.') { ext = '.' + ext; }

    if (pattern) {
        var re = new RegExp(pattern);
        if (!re.test(p.extname(path))) { return path; }
    }

    var fileName = p.basename(path, p.extname(path)) + ext;
    return p.join(p.dirname(path), fileName);
}

function crop(path, ext) {
    if (ext && ext[0] !== '.') { ext = '.' + ext; }
    if (ext && !endsWith(path, ext)) { return path; }
    return p.join(p.dirname(path), p.basename(path, ext || p.extname(path)));
}

function fileStream() {
    var args = Array.prototype.slice.call(arguments);
    var mapper = args.shift();

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        file.path = mapper.apply(mapper, [file.path].concat(args));

        this.push(file);
        cb();
    });
}

module.exports = {
    append: fileStream.bind(fileStream, append),
    replace: fileStream.bind(fileStream, replace),
    crop: fileStream.bind(fileStream, crop)
};
