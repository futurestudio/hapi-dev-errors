'use strict'

const Lab = require('lab')
const Code = require('code')
const Boom = require('boom')
const Hapi = require('hapi')
const Path = require('path')

let server

const { experiment, test, before, beforeEach } = (exports.lab = Lab.script())
const expect = Code.expect

experiment('hapi-dev-error register plugin', () => {
  beforeEach(async () => {
    server = new Hapi.Server()
    // fake dev env
    process.env.NODE_ENV = 'development'

    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: process.env.NODE_ENV !== 'production',
        toTerminal: false
      }
    })
  })

  test('test if the plugin is enabled in development for web requests', async () => {
    const routeOptions = {
      path: '/showErrorsForWeb',
      method: 'GET',
      handler: () => {
        return Boom.badImplementation('a fancy server error')
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = response.payload

    expect(response.statusCode).to.equal(500)
    expect(payload).to.startWith('<!DOCTYPE html>')
  })

  test('test if the plugin is enabled in development for JSON/REST requests', async () => {
    const routeOptions = {
      path: '/showErrorsForREST',
      method: 'GET',
      handler: () => {
        return Boom.badImplementation('JSON/REST server error')
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: {
        accept: 'application/json'
      }
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    expect(response.statusCode).to.equal(500)
    expect(payload.stacktrace).to.exist()
    expect(payload.url).to.equal(routeOptions.path)
    expect(payload.method).to.equal(routeOptions.method)
  })

  test('test when the error is from a rejected Promise', async () => {
    const routeOptions = {
      path: '/showPromiseError',
      method: 'GET',
      handler: () => {
        return Promise.reject(new Error('server error'))
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: {
        accept: 'application/json'
      }
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    expect(response.statusCode).to.equal(500)
    expect(payload.stacktrace).to.exist()
    expect(payload.url).to.equal(routeOptions.path)
    expect(payload.method).to.equal(routeOptions.method)
  })

  test('test if the request payload is added to the error response', async () => {
    const routeOptions = {
      path: '/with-request-payload',
      method: 'POST',
      handler: () => {
        return Promise.reject(new Error('server error with payload'))
      }
    }

    server.route(routeOptions)

    const requestPayload = { name: 'Future Studio' }
    const options = {
      url: routeOptions.path,
      method: routeOptions.method,
      headers: {
        accept: 'application/json'
      },
      payload: requestPayload
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    expect(response.statusCode).to.equal(500)
    expect(payload.stacktrace).to.exist()
    expect(payload.payload)
      .to.be.not.empty()
      .and.to.equal(requestPayload)
    expect(payload.url).to.equal(routeOptions.path)
    expect(payload.method).to.equal(routeOptions.method)
  })
})

experiment('hapi-dev-error renders a custom template', () => {
  before(async () => {
    server = new Hapi.Server()

    // fake dev env, no process.env.NODE_ENV defined
    await server.register([
      {
        plugin: require('vision')
      },
      {
        plugin: require('../lib/index'),
        options: {
          showErrors: process.env.NODE_ENV !== 'production',
          template: 'error',
          toTerminal: false
        }
      }
    ])

    server.views({
      engines: {
        html: require('handlebars')
      },
      path: Path.resolve(__dirname, '..', 'examples', 'views'),
      layout: 'layout'
    })
  })

  test('render a template', async () => {
    const routeOptions = {
      path: '/custom-view',
      method: 'GET',
      handler: () => {
        return Boom.badImplementation('a custom view rendering error')
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = response.payload

    expect(response.statusCode).to.equal(500)
    expect(payload).to.startWith('<!DOCTYPE html>')
    expect(payload).to.contains('Called URL') // this string is part of the custom template
  })
})
