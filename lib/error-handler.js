'use strict'

const Youch = require('youch')
const ForTerminal = require('youch-terminal')

constructor (options) {
  const {
    showErrors = false,
    toTerminal = true,
    links = [
      (error) => this.googleIcon(error),
      (error) => this.stackOverflowIcon(error)
    ],
    template
   } = options;

   this.links = links
   this.template = template
   this.showErrors = showErrors
   this.toTerminal = toTerminal
}

async handle (request, h) {

  if (this.isDisabled()) {
    return h.continue
  }

  const error = request.response;

  if (!(error.isBoom && error.output.statusCode === 500)) {
    return h.continue
  }

  const errorResponse = this.errorResponse(request);
  const accept = request.raw.req.headers.accept
  const agent = request.raw.req.headers['user-agent'];

  const youch = this.createYouch({ request ,error, this.links });

  if (this.toTerminal) {
    const json = await youch.toJSON()
    console.log(ForTerminal(json))
  }

  if (this.wantsJson ({ agent,accept })) {
    const details = Object.assign({}, errorResponse, {
      stacktrace: errorResponse.stacktrace.split('\n').map(line => line.trim())
    })

    return h
      .response(JSON.stringify(details, null, 2))
      .type('application/json')
      .code(errorResponse.statusCode)
  }

  if (this.template) {
    return h
      .view(this.template, { request, error, ...errorResponse })
      .code(errorResponse.statusCode)
  }

  const html = await youch.toHTML()

  return h
    .response(html)
    .type('text/html')
    .code(errorResponse.statusCode)
}

isDisabled () {
  return this.showErrors
}

errorResponse (request) {
  const error = request.response

  const statusCode = error.output.statusCode

  const response = {
    title: error.output.payload.error,
    statusCode,
    message: error.message,
    method: request.raw.req.method,
    url: request.url.path,
    headers: request.raw.req.headers,
    payload: request.raw.req.method !== 'GET' ? request.payload : '',
    stacktrace: error.stack
  }

  return response
}


createYouch ({ request, error, links =[] }) {
  request.url = request.path
  request.httpVersion = request.raw.req.httpVersion
  error.status = error.output.statusCode

  try {
    const youch = new Youch(error, request)

    links.forEach(link => youch.addLink(link))

    return youch
  } catch (error) {
    console.error(error)
    throw error
  }
}

googleIcon (error) {
  return `<a rel="noopener noreferrer" target="_blank" href="https://google.com/search?q=${encodeURIComponent(error.message)}" title="Search Google for &quot;${error.message}&quot;">
            <!-- Google icon by Picons.me, found at https://www.iconfinder.com/Picons -->
            <!-- Free for commercial use -->
            <svg width="24" height="24" viewBox="0 0 56.6934 56.6934" xmlns="http://www.w3.org/2000/svg">
              <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"/>
            </svg>
          </a>`
}

stackOverflowIcon (error) {
  return `<a rel="noopener noreferrer" target="_blank" href="https://stackoverflow.com/search?q=${encodeURIComponent(error.message)}" title="Search Stack Overflow for &quot;${error.message}&quot;">
            <!-- Stack Overflow icon by Picons.me, found at https://www.iconfinder.com/Picons -->
            <!-- Free for commercial use -->
            <svg width="24" height="24" viewBox="-1163 1657.697 56.693 56.693" xmlns="http://www.w3.org/2000/svg">
              <rect height="4.1104" transform="matrix(-0.8613 -0.508 0.508 -0.8613 -2964.1831 2556.6357)" width="19.2465" x="-1142.8167" y="1680.7778"/><rect height="4.1105" transform="matrix(-0.9657 -0.2596 0.2596 -0.9657 -2672.0498 3027.386)" width="19.2462" x="-1145.7363" y="1688.085"/><rect height="4.1098" transform="matrix(-0.9958 -0.0918 0.0918 -0.9958 -2425.5647 3282.8535)" width="19.246" x="-1146.9451" y="1695.1263"/><rect height="4.111" width="19.2473" x="-1147.2625" y="1701.293"/><path d="M-1121.4579,1710.9474c0,0,0,0.9601-0.0323,0.9601v0.0156h-30.7953c0,0-0.9598,0-0.9598-0.0156h-0.0326v-20.03h3.2877  v16.8049h25.2446v-16.8049h3.2877V1710.9474z"/><rect height="4.111" transform="matrix(0.5634 0.8262 -0.8262 0.5634 892.9033 1662.7915)" width="19.247" x="-1136.5389" y="1674.2235"/><rect height="4.1108" transform="matrix(0.171 0.9853 -0.9853 0.171 720.9987 2489.031)" width="19.2461" x="-1128.3032" y="1670.9347"/>
            </svg>
          </a>`
}

wantsJson ({ agent, accept }) {
  return matches(agent, /curl|wget|postman|insomnia/i) || matches(accept, /json/)
}

matches (str, regex) {
  return str && str.match(regex)
}