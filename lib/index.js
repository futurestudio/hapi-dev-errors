'use strict'

const Hoek = require('hoek')
const Youch = require('youch')
const ForTerminal = require('youch-terminal')

/**
 * Create a Youch instance for pretty error printing.
 * This instance is used to format output for the
 * console and for a web view.
 *
 * @param {Object} request - the request object
 * @param {Object} error - object with error details
 *
 * @returns {Object}
 */
function createYouch (request, error) {
  // assign the url’s path to "url" property of request directly
  // hapi uses a URL object and Youch wants the path directly
  request.url = request.path

  // assign httpVersion -> same as with request.url
  request.httpVersion = request.raw.req.httpVersion

  // let Youch show the error’s status code
  error.status = error.output.statusCode

  // pretty error printing on terminal or web view
  return new Youch(error, request)
}

/**
 * Check whether the incoming request requires a JSON response.
 * This is true for requests where the "accept" header
 * contains "json" or the agent is a CLI/GUI app.
 *
 * @param {Object}
 *
 * @returns {Boolean}
 */
function wantsJson ({ agent, accept }) {
  return matches(agent, /curl|wget|postman|insomnia/i) || matches(accept, /json/)
}

/**
 * Helper function to test whether a given
 * string matches a RegEx.
 *
 * @param {String} str
 * @param {String} regex
 *
 * @returns {Boolean}
 */
function matches (str, regex) {
  return str && str.match(regex)
}

/**
 * Render better error views during development.
 *
 * @param {Object} server - hapi server instance where the plugin is registered
 * @param {Object} options - plugin options
 */
async function register (server, options) {
  const defaults = {
    showErrors: false,
    toTerminal: true
  }

  const config = Object.assign({}, defaults, options)

  /**
   * Cut early if `showErrors` is false. No need to
   * hook the extension point in production.
   */
  if (!config.showErrors) {
    return
  }

  // require `vision` plugin in case the user provides an error template
  if (config.template) {
    server.dependency(['vision'])
  }

  // extend the request lifecycle at `onPreResponse`
  // to change the default error handling behavior (if enabled)
  server.ext('onPreResponse', async (request, h) => {
    const error = Hoek.clone(request.response)

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
        stacktrace: error.stack
      }

      const youch = createYouch(request, error)

      // print a pretty error to terminal as well
      if (config.toTerminal) {
        const json = await youch.toJSON()
        console.log(ForTerminal(json))
      }

      // take priority:
      //   - check "agent" header for REST request (cURL, Postman & Co.)
      //   - check "accept" header for JSON request
      if (wantsJson({ accept, agent })) {
        const details = Object.assign({}, errorResponse, {
          stacktrace: errorResponse.stacktrace.split('\n').map(line => line.trim())
        })

        return h
          .response(JSON.stringify(details, null, 2))
          .type('application/json')
          .code(statusCode)
      }

      // did the user explicitly specify an error template
      // favor a user’s custom template over the default template
      if (config.template) {
        return h
          .view(config.template, errorResponse)
          .code(statusCode)
      }

      // render Youch HTML template
      const html = await youch.toHTML()

      return h
        .response(html)
        .type('text/html')
        .code(statusCode)
    }

    // no developer error, go ahead with the response
    return h.continue
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
