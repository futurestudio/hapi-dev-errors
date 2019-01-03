'use strict'

const ErrorHandler = require('./error-handler')

async function register (server, options) {
  const { showErrors = false, template, ...config } = options

  /**
   * Cut early and don’t register extension point,
   * e.g. when in production.
   */
  if (!showErrors) {
    return
  }

  /**
   * Ensure the user server is able to render
   * templates when going for a custom one.
   */
  if (template) {
    server.dependency(['vision'])
  }

  /**
   * Alright, go for gold!
   */
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
