var Hapi = require('hapi')
var hapiStore = require('hapi-couchdb-store')
var server = new Hapi.Server()
var Inert = require('inert');
var Path = require('path');

server.connection({
  port: 8000
})

// serve static files from ./public
server.register(Inert, function () {
  server.connection({ port: port });
  server.route( {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: { path: 'Public' }
    }
  });

  server.register({
  register: hapiStore,
  options: {
}
}, function (error) {
if (error) throw error
})

server.start(function () {
  console.log('Server running at %s', server.info.uri)
})
}
