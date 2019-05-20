'use strict'

const Fs = require('fs')
const Path = require('path')
const Youch = require('youch')
const ForTerminal = require('youch-terminal')

class ErrorHandler {
  constructor (options) {
    const {
      toTerminal = true,
      template,
      links = this.defaultLinks()
    } = options

    this.template = template
    this.toTerminal = toTerminal
    this.links = Array.isArray(links) ? links : [links]
  }

  /**
   * Creates Google and Stack Overflow links
   * which allow the user to search for
   * help on these platforms.
   *
   * @returns {Array}
   */
  defaultLinks () {
    return [
      (error) => this.google(error),
      (error) => this.stackOverflow(error)
    ]
  }

  /**
   * Resolve a Google link with
   * the error’s message.
   *
   * @param {Object} error
   *
   * @returns {String}
   */
  google (error) {
    return `
      <a
        rel="noopener noreferrer" target="_blank"
        href="https://google.com/search?q=${encodeURIComponent(error.message)}"
        title="Search Google for &quot;${error.message}&quot;">
          ${this.resolveIcon('google')}
      </a>`
  }

  /**
   * Resolve a Stack Overflow link
   * with the error’s message.
   *
   * @param {Object} error
   *
   * @returns {String}
   */
  stackOverflow (error) {
    return `
      <a
        rel="noopener noreferrer" target="_blank"
        href="https://stackoverflow.com/search?q=${encodeURIComponent(error.message)}"
        title="Search Stack Overflow for &quot;${error.message}&quot;">
          ${this.resolveIcon('stackoverflow')}
      </a>`
  }

  /**
   * Read the icon from disk.
   *
   * @param {String} name
   *
   * @returns {String}
   */
  resolveIcon (name) {
    return Fs.readFileSync(this.resolveIconPath(name))
  }

  /**
   * Resolve the icon’s path on the disk.
   *
   * @param {String} name
   *
   * @returns {String}
   */
  resolveIconPath (name) {
    return Path.resolve(__dirname, 'icons', `${name}.svg`)
  }

  /**
   * Check the outgoing response whether it’s
   * a developer error. If yes, show the
   * error details view.
   *
   * @param {Request} request
   * @param {Toolkit} h
   *
   * @returns {Response}
   */
  async handle (request, h) {
    if (this.isDeveloperError(request.response)) {
      return this.resolveError(request, h)
    }

    return h.continue
  }

  /**
   * Check whether the `error` is a 500 error
   *
   * @param {Object} error
   *
   * @returns {Boolean}
   */
  isDeveloperError (error) {
    return error.isBoom && error.output.statusCode === 500
  }

  /**
   * Resolve the error and format, JSON or HTML.
   *
   * @param {Request} request
   * @param {Toolkit} h
   *
   * @returns {Response}
   */
  async resolveError (request, h) {
    if (this.shouldLogToTerminal()) {
      await this.logToTerminal(request)
    }

    if (this.wantsJson(request)) {
      return this.sendJson(request, h)
    }

    if (this.hasTemplate()) {
      return this.renderTemplate(request, h)
    }

    return this.sendHtml(request, h)
  }

  /**
   * Returns a boolean whether to log
   * the error to the terminal.
   *
   * @returns {Boolean}
   */
  shouldLogToTerminal () {
    return this.toTerminal
  }

  /**
   * Logs the error to terminal.
   *
   * @param {Request} request
   */
  async logToTerminal (request) {
    const youch = this.createYouch(request)
    const json = await youch.toJSON()

    console.log(ForTerminal(json))
  }

  /**
   * Create a Youch instance to render a
   * detailed error view or serialize
   * the error to JSON.
   *
   * @param {Request} request
   *
   * @returns {Object}
   */
  createYouch (request) {
    const error = request.response
    error.status = error.output.statusCode

    try {
      const youch = new Youch(error, request.raw.req)

      this.links.forEach(link => youch.addLink(link))

      return youch
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * Determines whether the request
   * expects JSON in response.
   *
   * @param {Request} request
   *
   * @returns {Boolean}
   */
  wantsJson (request) {
    const { 'user-agent': agent, accept } = request.raw.req.headers

    return this.matches(agent, /curl|wget|postman|insomnia/i) || this.matches(accept, /json/)
  }

  /**
   * Determine whether the given `str`
   * matches the `regex`.
   *
   * @param {String} str
   * @param {String} regex
   *
   * @returns {Boolean}
   */
  matches (str, regex) {
    return str && str.match(regex)
  }

  /**
   * Create an error object.
   *
   * @param {Request} request
   *
   * @returns {Object}
   */
  composeError (request) {
    const error = request.response

    return {
      title: error.output.payload.error,
      message: error.message,
      statusCode: error.output.statusCode,
      url: request.path,
      method: request.raw.req.method,
      headers: request.raw.req.headers,
      payload: request.raw.req.method !== 'GET' ? request.payload : '',
      stacktrace: error.stack
    }
  }

  /**
   * Respond the request with JSON.
   *
   * @param {Request} request
   * @param {Toolkit} h
   *
   * @returns {Response}
   */
  sendJson (request, h) {
    const error = this.composeError(request)

    return h
      .response(this.resolveJson(error))
      .type('application/json')
      .code(error.statusCode)
  }

  /**
   * JSON.stringify the error object and
   * prettify the stackstrace.
   *
   * @param {Object} data
   *
   * @returns {String}
   */
  resolveJson (data) {
    return JSON.stringify({
      ...data,
      stacktrace: data.stacktrace.split('\n').map(line => line.trim())
    })
  }

  /**
   * Determine whether the user wants to
   * render their own template.
   *
   * @returns {Boolean}
   */
  hasTemplate () {
    return !!this.template
  }

  /**
   * Render the defined user template.
   *
   * @param {Request} request
   * @param {Toolkit} h
   *
   * @returns {Response}
   */
  renderTemplate (request, h) {
    const error = this.composeError(request)

    return h
      .view(this.template, { request, error: request.response, ...error })
      .code(error.statusCode)
  }

  /**
   * Respond the request with HTML.
   *
   * @param {Request} request
   * @param {Toolkit} h
   *
   * @returns {Response}
   */
  async sendHtml (request, h) {
    const youch = this.createYouch(request)
    const statusCode = request.response.output.statusCode

    return h
      .response(await youch.toHTML())
      .type('text/html')
      .code(statusCode)
  }
}

module.exports = ErrorHandler
