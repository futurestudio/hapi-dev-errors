'use strict'

const Fs = require('fs')
const Path = require('path')
const Hoek = require('hoek')
const Youch = require('youch')
const TemplatePath = Path.join(__dirname, './error.html')

/**
 * Render better error views during development
 *
 * @param {*object} server - hapi server instance where the plugin is registered
 * @param {*object} options - plugin options
 */
function register (server, options) {
  // default option values
  const defaults = {
    showErrors: false,
    useYouch: false
  }

  // assign config object from merged options into defaults
  const config = Object.assign(defaults, options)

  // cut early if `showErrors` is false
  // no need to read the template or hook extension point
  if (!config.showErrors) {
    return
  }

  // require `vision` plugin in case the user provides an error template
  if (config.template) {
    server.dependency(['vision'])
  }

  // read and keep the default error template
  const errorTemplate = Fs.readFileSync(TemplatePath, 'utf8')

  // helper function to test if string matches a value
  const matches = (str, regex) => str && str.match(regex)

  // extend the request lifecycle at `onPreResponse`
  // to change the default error handling behavior (if enabled)
  server.ext('onPreResponse', async (request, h) => {
    // error response shortcut
    const error = request.response

    // only show `bad implementation` developer errors (status code 500)
    if (error.isBoom && error.output.statusCode === 500) {
      const accept = request.raw.req.headers.accept
      const agent = request.raw.req.headers['user-agent']
      const statusCode = error.output.statusCode

      const errorResponse = {
        title: error.output.payload.error,
        statusCode,
        message: error.message,
        method: request.raw.req.method,
        url: request.url.path,
        headers: request.raw.req.headers,
        payload: request.raw.req.method !== 'GET' ? request.payload : '',
        stacktrace: error.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
      }

      // take priority: check header if there’s a JSON REST request or request is in CLI
      if (matches(accept, /json/) || matches(agent, /curl|wget/i)) {
        return h.response(errorResponse).code(statusCode)
      }

      // did the user explicitly specify an error template
      // this is high priority: custom template overrides any other template
      if (config.template) {
        return h.view(config.template, errorResponse).code(statusCode)
      }

      // user wants to use Youch over the default template
      if (config.useYouch) {
        // clone the request to not change it
        const req = Hoek.clone(request)

        // assign the url’s path to "url" property of request directly
        // hapi uses a URL object and Youch wants the path directly
        req.url = req.path
        // assign httpVersion -> same as with request.url
        req.httpVersion = req.raw.req.httpVersion

        // let Youch show the error’s status code
        error.status = statusCode

        // create new Youch instance and reply rendered HTML
        const youch = new Youch(error, req)

        // render response HTML template
        const html = await youch.toHTML()

        return h
          .response(html)
          .type('text/html')
          .code(statusCode)
      }

      // prepare the error template and replace `%placeholder%` with error specific details
      const html = errorTemplate.replace(/%(\w+)%/g, (full, token) => {
        return errorResponse[token] || ''
      })

      // go with the default template, because no user template is defined and Youch isn’t selected
      return h
        .response(html)
        .type('text/html')
        .code(statusCode)
    }

    // go ahead with the response, no developer error detected
    return h.continue
  })
}

exports.plugin = {
  register,
  pkg: require('../package.json')
}
