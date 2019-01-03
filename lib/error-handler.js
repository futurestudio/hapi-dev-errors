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

  defaultLinks () {
    return [
      (error) => this.google(error),
      (error) => this.stackOverflow(error)
    ]
  }

  google (error) {
    return `
      <a
        rel="noopener noreferrer" target="_blank"
        href="https://google.com/search?q=${encodeURIComponent(error.message)}"
        title="Search Google for &quot;${error.message}&quot;">
          ${this.resolveIcon('google')}
      </a>`
  }

  stackOverflow (error) {
    return `
      <a
        rel="noopener noreferrer" target="_blank"
        href="https://stackoverflow.com/search?q=${encodeURIComponent(error.message)}"
        title="Search Stack Overflow for &quot;${error.message}&quot;">
          ${this.resolveIcon('stackoverflow')}
      </a>`
  }

  resolveIcon (name) {
    return Fs.readFileSync(this.resolveIconPath(name))
  }

  resolveIconPath (name) {
    return Path.resolve(__dirname, 'icons', `${name}.svg`)
  }

  async handle (request, h) {
    if (this.isDeveloperError(request.response)) {
      return this.resolveError(request, h)
    }

    return h.continue
  }

  isDeveloperError (error) {
    return error.isBoom && error.output.statusCode === 500
  }

  async resolveError (request, h) {
    await this.logToTerminal(request)

    if (this.wantsJson(request)) {
      return this.sendJson(request, h)
    }

    if (this.hasTemplate()) {
      return this.renderTemplate(request, h)
    }

    return this.sendHtml(request, h)
  }

  async logToTerminal (request) {
    if (this.toTerminal) {
      const youch = this.createYouch(request)
      const json = await youch.toJSON()

      console.log(ForTerminal(json))
    }
  }

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

  wantsJson (request) {
    const { 'user-agent': agent, accept } = request.raw.req.headers

    return this.matches(agent, /curl|wget|postman|insomnia/i) || this.matches(accept, /json/)
  }

  matches (str, regex) {
    return str && str.match(regex)
  }

  composeError (request) {
    const error = request.response

    return {
      title: error.output.payload.error,
      message: error.message,
      statusCode: error.output.statusCode,
      url: request.url.path,
      method: request.raw.req.method,
      headers: request.raw.req.headers,
      payload: request.raw.req.method !== 'GET' ? request.payload : '',
      stacktrace: error.stack
    }
  }

  sendJson (request, h) {
    const error = this.composeError(request)
    const json = this.resolveJson(error)

    return h
      .response(json)
      .type('application/json')
      .code(error.statusCode)
  }

  resolveJson (data) {
    return JSON.stringify({
      ...data,
      stacktrace: data.stacktrace.split('\n').map(line => line.trim())
    })
  }

  hasTemplate () {
    return !!this.template
  }

  renderTemplate (request, h) {
    const error = this.composeError(request)

    return h
      .view(this.template, { request, error: request.response, ...error })
      .code(error.statusCode)
  }

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
