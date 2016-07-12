through = require 'through2'
{ File } = require 'gulp-util'
{ assign, clone } = require 'lodash'
fs = require 'fs'

defOpts =
  afterExtension: 'php'
  copy: false

module.exports = (opts) ->

  { afterExtension, copy } = assign clone(defOpts), opts

  transform = (file, encode, callback) ->

    beforeFilePath = file.path
    filePathArr = beforeFilePath.match /(^.+)(\..+$)/
    afterFilePath = "#{filePathArr[1]}.#{afterExtension}"

    file.path = afterFilePath
    file.contents = new Buffer file.contents, 'utf-8'

    @push file

    unless copy
      fs.unlink beforeFilePath, (err) ->
        if err then console.log "successfully deleted #{beforeFilePath}"

    callback()

  # flush = (callback) ->
  #   callback()

  return through.obj transform#, flush
