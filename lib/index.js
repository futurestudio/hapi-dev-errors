'use strict'

const ErrorHandler = require('./error-handler')

async function register (server, options) {
  const { template = false, ...config } = options

  const error = new ErrorHandler({ template, config })

  if (template) {
    server.dependency(['vision'])
  }

  server.ext('onPreResponse', async (request, h) => {
    return error.handle(request)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
