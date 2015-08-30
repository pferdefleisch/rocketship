// my-server.js
var Hapi = require('hapi')
var hapiStore = require('hapi-couchdb-store')

// serve static files from ./public
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
})

server.register({
  register: hapiStore,
  options: {
    // optional. If no options passed, a pouchdb server
    // will be started at http://localhost:5985
    couch: 'http://localhost:5984'
    // Alternatively, pass spawn-pouchdb-server options:
    // https://github.com/gr2m/spawn-pouchdb-server#options
  }
}, function (error) {
  if (error) throw error
})

server.connection({
  port: 8000
})
server.start(function () {
  console.log('Server running at %s', server.info.uri)
})
