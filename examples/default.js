'use strict'

const Hapi = require('hapi')

// create new server instance
// add server’s connection information
const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
})

async function launchIt () {
  await server.register({
    plugin: require('../'),
    options: {
      showErrors: process.env.NODE_ENV !== 'production'
    }
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, h) => {
      h.notAvailable()
    }
  })

  try {
    await server.start()
    console.log('Server running at: ' + server.info.uri)
  } catch (err) {
    throw err
  }
}

launchIt()
