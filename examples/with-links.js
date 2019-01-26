'use strict'

const Hapi = require('hapi')

const server = new Hapi.Server({ host: 'localhost', port: 3000 })

async function launchIt () {
  await server.register({
    plugin: require('../lib'),
    options: {
      showErrors: process.env.NODE_ENV !== 'production',
      toTerminal: false,
      links: [
        (error) => {
          return `<a rel="noopener noreferrer" target="_blank" href="https://github.com/futurestudio/hapi-dev-errors/search?q=${error.message}">
                    Search hapi-dev-errors on GitHub
                  </a>`
        }
      ]
    }
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (_, h) => {
      h.notAvailable()
    }
  })

  await server.start()
  console.log('Server running at: ' + server.info.uri)
}

launchIt()
