var assert = require('assert')
var loop = require('./index')

var i = 0

loop(function(next) {
  if (i == 1000) return
  i++
  next()
})

assert.equal(i, 1000)

var j = 0

loop(function(next) {
  if (j == 10) return
  j++
  process.nextTick(next)
})

setTimeout(function() {
  assert.equal(j, 10)
  console.log('Ok')
}, 10)