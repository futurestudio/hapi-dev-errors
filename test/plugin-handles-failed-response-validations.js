'use strict'

const Joi = require('@hapi/joi')
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

let server

const { experiment, test, before } = (exports.lab = Lab.script())

experiment('hapi-dev-error handles failed response validations', () => {
  before(async () => {
    server = new Hapi.Server()

    await server.register({
      plugin: require('../lib'),
      options: {
        showErrors: true,
        toTerminal: false
      }
    })

    server.route({
      path: '/',
      method: 'GET',
      config: {
        response: {
          schema: Joi.object({
            user: Joi.object().required()
          })
        }
      },
      handler: () => {
        return { user: 'Marcus' }
      }
    })
  })

  test('that hapi-dev-errors returns an HTML response with no headers', async () => {
    const response = await server.inject({
      url: '/',
      method: 'GET'
    })

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.headers['content-type']).to.equal('text/html; charset=utf-8')
  })

  test('that hapi-dev-errors returns JSON with accept header set to application/json', async () => {
    const response = await server.inject({
      url: '/',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.headers['content-type']).to.equal('application/json; charset=utf-8')
  })
})
