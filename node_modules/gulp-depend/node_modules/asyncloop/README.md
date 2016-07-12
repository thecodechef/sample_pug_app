#Async loop

Continuation passing loop which never bloats stack.

##Example

```javascript
var loop = require('asyncloop')

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
}, 10)
```

##Installation

via component

```
component install eldargab/asyncloop
```

via npm

```
npm install asyncloop
```

##License

MIT