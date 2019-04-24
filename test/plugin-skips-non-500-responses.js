'use strict'

const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')

let server

const { experiment, it, before } = (exports.lab = Lab.script())
const expect = Code.expect

experiment('hapi-dev-error works only with 500 errors', () => {
  before(async () => {
    server = new Hapi.Server()

    // fake dev env, no process.env.NODE_ENV defined
    await server.register({
      plugin: require('../lib'),
      options: {
        showErrors: process.env.NODE_ENV !== 'production'
      }
    })
  })

  it('skips handling for non-error response', async () => {
    const routeOptions = {
      path: '/ok',
      method: 'GET',
      handler: () => 'ok'
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    const payload = response.payload

    expect(response.statusCode).to.equal(200)
    expect(payload).to.equal('ok')
  })

  it('skips handling for 404 errors', async () => {
    const routeOptions = {
      path: '/404',
      method: 'GET',
      handler: () => Boom.notFound()
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(request)
    expect(response.statusCode).to.equal(404)
  })
})
