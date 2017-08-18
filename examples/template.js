'use strict'

const Hapi = require('hapi')

// create new server instance
const server = new Hapi.Server()

// add server’s connection information
server.connection({
    host: 'localhost',
    port: 3000
})

// register plugins to server instance
server.register([
    {
        register: require('vision')
    },
    {
        register: require('../'),
        options: {
            showErrors: process.env.NODE_ENV !== 'production',
            template: 'error',
            useYouch: true      // this will be ignored, option 'template' > 'useYouch'
        }
    }
]).then(() => {

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: __dirname + '/views',
        layout: 'layout',
        isCached: process.env.NODE_ENV !== 'production'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.notAvailable()
        }
    })

    // start your server
    server.start().then(() => {
        console.log('Server running at: ' + server.info.uri)
    })
}).catch(err => {
    throw err
})
