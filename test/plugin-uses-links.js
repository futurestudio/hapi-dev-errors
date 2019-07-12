'use strict'

const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Hapi = require('@hapi/hapi')

const { experiment, it, beforeEach, afterEach } = (exports.lab = Lab.script())

experiment('hapi-dev-error handles custom user links', () => {
  async function createServer (options) {
    const server = new Hapi.Server()

    await server.register({
      plugin: require('../lib/index'),
      options: {
        showErrors: true,
        toTerminal: false,
        ...options
      }
    })

    const routeOptions = {
      path: '/',
      method: 'GET',
      handler: () => new Error('Somethinng bad happened')
    }

    server.route(routeOptions)

    return server
  }

  beforeEach(() => {
    Sinon.stub(console, 'error')
  })

  afterEach(() => {
    console.error.restore()
  })

  it('works fine with empty links', async () => {
    const server = await createServer({ links: [] })

    const response = await server.inject({
      url: '/',
      method: 'GET'
    })

    Sinon.assert.notCalled(console.error)

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.payload).to.startWith('<')
  })

  it('throws if the links are strings', async () => {
    const server = await createServer({ links: ['error'] })

    const response = await server.inject({
      url: '/',
      method: 'GET'
    })

    Sinon.assert.called(console.error)

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.payload).to.startWith('{')
    Code.expect(response.payload).to.include('Internal Server Error')
  })

  it('throws if the links is not an array of functions', async () => {
    const server = await createServer({ links: 'error' })

    const response = await server.inject({
      url: '/',
      method: 'GET'
    })

    Sinon.assert.called(console.error)

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.payload).to.startWith('{')
    Code.expect(response.payload).to.include('Internal Server Error')
  })

  it('works fine with a link function', async () => {
    const server = await createServer({ links: () => `link` })

    const response = await server.inject({
      url: '/',
      method: 'GET',
      headers: { accept: 'application/json' }
    })

    Sinon.assert.notCalled(console.error)

    Code.expect(response.statusCode).to.equal(500)
    Code.expect(response.payload).to.startWith('{')
  })
})
