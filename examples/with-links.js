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
    plugin: require('../lib'),
    options: {
      showErrors: process.env.NODE_ENV !== 'production',
      toTerminal: false,
      links: [
        (error) => {
          return `<a rel="noopener noreferrer" target="_blank" href="https://github.com/fs-opensource/hapi-dev-errors/search?q=${error.message}">
                    Search on GitHub
                  </a>`
        }
      ]
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
