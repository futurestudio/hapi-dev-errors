'use strict'

const ErrorHandler = require('./error-handler')

async function register (server, options) {
  const { showErrors = false, template, ...config } = options

  if (!showErrors) {
    return
  }

  if (template) {
    server.dependency(['vision'])
  }

  const errorHandler = new ErrorHandler({ template, ...config })

  server.ext('onPreResponse', async (request, h) => {
    return errorHandler.handle(request, h)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
