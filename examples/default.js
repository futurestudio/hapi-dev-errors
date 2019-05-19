'use strict'

const Hapi = require('@hapi/hapi')

const server = new Hapi.Server({ host: 'localhost', port: 3000 })

async function launchIt () {
  await server.register({
    plugin: require('../'),
    options: {
      showErrors: process.env.NODE_ENV !== 'production'
    }
  })

  server.route({
    method: '*',
    path: '/{path*}',
    handler: (_, h) => h.notAvailable()
  })

  await server.start()
  console.log('Server running at: ' + server.info.uri)
}

launchIt()
