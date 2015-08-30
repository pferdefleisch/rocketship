var Hapi = require('hapi')
var hapiStore = require('hapi-couchdb-store')
var server = new Hapi.Server()
var Inert = require('inert')
var Path = require('path')

// serve static files from ./public

server.register(Inert, function () {
  server.connection({ port: 8000 })
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: { path: 'Public' }
    }
  })})
server.start(function () {
  console.log('Server running at %s', server.info.uri)
})
