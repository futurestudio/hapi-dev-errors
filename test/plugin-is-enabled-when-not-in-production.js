'use strict'

const Lab = require('lab')
const Code = require('code')
const Boom = require('boom')
const Hapi = require('hapi')

let server

const { experiment, test, beforeEach } = (exports.lab = Lab.script())
const expect = Code.expect

experiment('hapi-dev-error register plugin', () => {
  beforeEach(async () => {
    server = new Hapi.Server()

    // fake dev env, no process.env.NODE_ENV defined
    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: process.env.NODE_ENV !== 'production'
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
})
