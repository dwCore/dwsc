var dwsc = require('./')
var tape = require('tape')
var dws2 = require('@dwcore/dws2')

var dwStream = function() {
  var s = dws2.obj()
  s.write('a')
  s.write('b')
  s.write('c')
  s.end()
  return s
}

tape('DWSC Tests: Buffers', function(t) {
  dwsc(dwStream(), function(err, list) {
    t.same(list, ['a', 'b', 'c'], 'buffered output')
    t.end()
  })
})

tape('DWSC Tests: Errors On Error', function(t) {
  var s = dws2()
  dwsc(s, function(err) {
    t.same(err.message, 'stop', 'had error')
    t.end()
  })
  s.destroy(new Error('stop'))
})

tape('DWSC Tests: Errors On Premature Close', function(t) {
  var s = dws2()
  dwsc(s, function(err) {
    t.ok(err, 'had error')
    t.end()
  })
  s.destroy()
})

tape('DWSC Tests: dwStream Not Collected. No Buffer Allowed.', function(t) {
  var s = dwsc(dwStream())

  setTimeout(function() {
    var list = ['a', 'b', 'c']
    s.on('data', function(data) {
      t.same(data, list.shift(), 'streaming output matches')
    })
    s.on('end', function() {
      t.same(list.length, 0, 'no more data')
      t.end()
    })
  }, 250)
})
