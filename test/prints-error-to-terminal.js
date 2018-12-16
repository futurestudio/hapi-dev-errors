'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Sinon = require('sinon')

let server

const { experiment, test, before } = (exports.lab = Lab.script())

experiment('hapi-dev-error register plugin', () => {
  before(async () => {
    server = new Hapi.Server()

    // fake dev env
    process.env.NODE_ENV = 'develop'

    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: process.env.NODE_ENV !== 'production',
        toTerminal: true // default
      }
    })
  })

  test('test if plugin prints to terminal', async () => {
    const routeOptions = {
      path: '/use-youch',
      method: 'GET',
      handler: () => {
        return new Error('show this error with Youch')
      }
    }

    server.route(routeOptions)

    const request = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    Sinon.stub(console, 'log')

    const response = await server.inject(request)
    Code.expect(response.statusCode).to.equal(500)

    Sinon.assert.called(console.log)

    console.log.restore()
  })
})
