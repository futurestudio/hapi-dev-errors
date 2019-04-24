'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')

const server = new Hapi.Server()

const { experiment, test, before } = (exports.lab = Lab.script())

experiment('plugin-is-disabled-by-default,', () => {
  before(async () => {
    await server.register({
      plugin: require('../lib/index'),
      options: {}
    })
  })

  test('test if the plugin is disabled by default', async () => {
    const routeOptions = {
      path: '/no-options',
      method: 'GET',
      handler: () => new Error('failure')
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(payload.message).to.equal('An internal server error occurred')
    Code.expect(payload.error).to.equal('Internal Server Error')
  })

  test('does not render the gorgeous error view for 503 errors', async () => {
    const routeOptions = {
      path: '/503-unhandled',
      method: 'GET',
      handler: () => Boom.serverUnavailable('not ready')

    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(503)
    Code.expect(payload.message).to.equal('not ready')
    Code.expect(payload.error).to.equal('Service Unavailable')
  })
})
