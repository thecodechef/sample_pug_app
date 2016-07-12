"use strict";

var stream = require("stream");
var util = require("util");

function CollectStream(handler) {

    if (typeof handler !== "function")
        throw new TypeError("handler must be a function");

    var cache = [];

    function handleResult(cb, res) {
        var i;
        try {
            if (Array.isArray(res)) {
                // Result is an array of vinyl files
                for (i = 0; i < res.length; ++i)
                    this.push(res[i]);
                cb();
            } else if (typeof res.then === "function") {
                // Result is a promise
                if (typeof res.done === "function") {
                    res.done(handleResult.bind(this, cb), cb);
                } else {
                    res.then(handleResult.bind(this, cb), function(err) {
                        // Ensure that if cb throws an exception, it
                        // doesn't get caught by the Promise machinery.
                        process.nextTick(function() { cb(err); });
                    });
                }
            } else {
                // Result is a dictionary of vinyl files
                var keys = Object.keys(res);
                for (i = 0; i < keys.length; ++i)
                    this.push(res[keys[i]]);
                cb();
            }
        } catch (err) {
            cb(err);
        }
    }

    stream.Transform.call(this, {objectMode: true});

    this._transform = function CollectStream_transform(chunk, enc, cb) {
        try {
            cache.push(chunk);
            cb();
        } catch (err) {
            cb(err);
        }
    };

    this._flush = function CollectStream_flush(cb) {
        var res;
        try {
            res = handler.call(this, cache, cb);
        } catch (err) {
            cb(err);
        }
        handleResult.call(this, cb, res);
    };

}

util.inherits(CollectStream, stream.Transform);

exports.list = function gulpCollect_list(handler) {
    return new CollectStream(handler);
};

exports.dict = function gulpCollect_dict(handler) {
    return new CollectStream(function(list, cb) {
        var dict = {};
        for (var i = 0; i < list.length; ++i) {
            var elt = list[i];
            var key = elt.relative;
            if (dict.hasOwnProperty(key))
                throw new Error("Duplicate relative path: " + key);
            dict[key] = elt;
        }
        return handler.call(this, dict, cb);
    });
};
