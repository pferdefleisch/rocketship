var Hapi = require('hapi')
var hapiStore = require('hapi-couchdb-store')
var server = new Hapi.Server()

server.connection({ port: 8000 })

// serve static files from ./public
server.register(require('inert'), function () {})
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: { path: 'Public' }
  }
})

server.register(require('h2o2'), function () {})
server.register(hapiStore, function () {
  server.start(function () {
    console.log('Server running at %s', server.info.uri)
  })
})
