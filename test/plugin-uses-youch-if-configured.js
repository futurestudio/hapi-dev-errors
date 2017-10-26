'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

let server

const { experiment, test, before } = (exports.lab = Lab.script())
const expect = Code.expect

experiment('hapi-dev-error register plugin', () => {
  before(async () => {
    server = new Hapi.Server()

    // fake dev env, no process.env.NODE_ENV defined
    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: process.env.NODE_ENV !== 'production',
        useYouch: true
      }
    })
  })

  test('test if the plugin uses Youch', async () => {
    const routeOptions = {
      path: '/use-youch',
      method: 'GET',
      handler: () => {
        return new Error('show this error with Youch')
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
})
