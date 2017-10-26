'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

const server = new Hapi.Server()

const { experiment, test, before } = (exports.lab = Lab.script())

experiment('hapi-dev-error register plugin', () => {
  before(async () => {
    // fake production env
    process.env.NODE_ENV = 'prod'

    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: process.env.NODE_ENV !== 'prod'
      }
    })
  })

  test('test if the plugin is disabled in production', async () => {
    const routeOptions = {
      path: '/showErrorsIsFalse',
      method: 'GET',
      handler: () => {
        return new Error('failure')
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(payload.message).to.equal('An internal server error occurred')
    Code.expect(payload.error).to.equal('Internal Server Error')
  })
})
