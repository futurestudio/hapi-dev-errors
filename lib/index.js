'use strict'

const Hoek = require('hoek')
const Youch = require('youch')
const ForTerminal = require('youch-terminal')

/**
 * Create a Youch instance for pretty error printing.
 * This instance is used to format output for the console
 * and for a web view.
 *
 * @param {object} request - the request object
 * @param {object} error - object with error details
 */
function createYouch (request, error) {
  // assign the url’s path to "url" property of request directly
  // hapi uses a URL object and Youch wants the path directly
  request.url = request.path

  // assign httpVersion -> same as with request.url
  request.httpVersion = request.raw.req.httpVersion

  // let Youch show the error’s status code
  error.status = error.output.statusCode

  // create new Youch instance and print a pretty error to the console
  return new Youch(error, request)
}

/**
 * Check whether the incoming request requires a JSON response.
 * This is true for requests where the "accept" header contains "json"
 * or the agent is a CLI/GUI app.
 *
 * @param {object}
 */
function isJsonRequest ({ agent, accept }) {
  return matches(agent, /curl|wget|postman|insomnia/i) || matches(accept, /json/)
}

/**
 * Helper function to test if string matches a value
 */
function matches (str, regex) {
  return str && str.match(regex)
}

/**
 * Render better error views during development
 *
 * @param {*object} server - hapi server instance where the plugin is registered
 * @param {*object} options - plugin options
 */
async function register (server, options) {
  // default option values
  const defaults = {
    showErrors: false,
    toTerminal: true
  }

  // merge user-defined plugin options into defaults
  const config = Object.assign({}, defaults, options)

  // cut early if `showErrors` is false
  // no need to read the template or hook extension point
  // do this in production!
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
    // error response shortcut
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
      if (isJsonRequest({ accept, agent })) {
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
