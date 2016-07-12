module.exports = function loop(fn) {
  var sync = true
  while(sync) {
    var done = false
    fn(function() {
      done = true
      if (!sync) loop(fn)
    })
    sync = done
  }
}