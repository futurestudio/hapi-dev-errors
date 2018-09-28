'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const Joi = require('joi')

let server

const { experiment, test, before } = (exports.lab = Lab.script())
const expect = Code.expect

experiment('hapi-dev-error falls back to json', () => {
  before(async () => {
    server = new Hapi.Server()

    // fake dev env, no process.env.NODE_ENV defined
    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: true,
        toTerminal: true
      }
    })

    const routeOptions = {
      path: '/kind',
      method: 'GET',
      config: {
        response: {
          schema: {
            baz: Joi.object().required()
          }
        }
      },
      handler: () => {
        return {
          baz: 'bar'
        }
      }
    }

    server.route(routeOptions)
  })

  test('test if the response schema failed and no specified header', async () => {
    const response = await server.inject({
      url: '/kind',
      method: 'GET'
    })

    expect(response.statusCode).to.equal(500)
    expect(response.headers['content-type']).to.equal('text/html; charset=utf-8')
  })

  test('test if the response schema failed and no specified header', async () => {
    const response = await server.inject({
      url: '/kind',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })

    expect(response.statusCode).to.equal(500)
    expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
  })
})
