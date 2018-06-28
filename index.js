var once = require('once')

module.exports = function(stream, dwsc) {
  if (!dwsc) return stream

  var list = []

  dwsc = once(dwsc)

  stream.on('data', function(data) {
    list.push(data)
  })

  stream.on('end', function() {
    dwsc(null, list)
  })

  stream.on('close', function() {
    dwsc(new Error('Premature close'))
  })

  stream.on('error', dwsc)

  return stream
}
