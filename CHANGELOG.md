# Changelog

## Version [3.3.0](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.6...v3.3.0) (2019-10-16)

### Added
- basic TypeScript declarations in `lib/index.d.ts`


## Version [3.2.6](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.5...v3.2.6) (2019-10-11)

### Updated
- refine Readme
- bump dependencies
- remove Node.js v11 from Travis testing
- minor refactorings (a mobile app update would say: “performance improvements”)


## Version [3.2.5](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.4...v3.2.5) (2019-05-19)

### Updated
- fix `.travis.yml` to properly test the hapi version matrix
- fix `@hapi/hapi` import in examples
- minor example refinements
- bump dependencies


## Version [3.2.4](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.3...v3.2.4) (2019-04-27)

### Updated
- bump dependencies
- update to hapi scoped dependencies


## Version [3.2.3](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.2...v3.2.3) (2019-02-18)

### Updated
- bump dependencies
- fix badges in Readme


## Version [3.2.2](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.1...v3.2.2) (2019-01-26)

### Updated
- Readme: rename GitHub references `fs-opensource -> futurestudio`


## Version [3.2.1](https://github.com/futurestudio/hapi-dev-errors/compare/v3.2.0...v3.2.1) (2019-01-22)

### Updated
- use `request.path` over `request.url.path` to support hapi 18
- refactor plugin: error handler class and plugin entry point
- split plugin handling and extension point registration from request handling
- move icons (Google, Stack Overflow) to SVG files
- refine texts in Readme
- refactor code in examples
- bump dependencies
- update tests to use `it` over `test`


## Version [3.2.0](https://github.com/futurestudio/hapi-dev-errors/compare/v3.1.0...v3.2.0) (2018-10-10)
- `add` new option [`links`](https://github.com/futurestudio/hapi-dev-errors#plugin-registration-options) which represents an array of callback functions to render helpful links. By default, `hapi-dev-errors` renders linked SVG icons for Google and Stack Overflow to search for help based on the error message


## Version [3.1.0](https://github.com/futurestudio/hapi-dev-errors/compare/v3.0.1...v3.1.0) (2018-09-28)
- `add` pass `request` to custom view: this allows you to access every request property
- `add` pass `error` to custom view: this allows you to access every response property
- `add` tests to verify plugin functionality for failed response validations (thank you [venikman](https://github.com/futurestudio/hapi-dev-errors/pull/6))
- `update` dependencies

## Version [3.0.1](https://github.com/futurestudio/hapi-dev-errors/compare/v3.0.0...v3.0.1) (2018-08-21)
- `update` readme: quick navigation and logo size fix for small screens


## Version [3.0.0](https://github.com/futurestudio/hapi-dev-errors/compare/v2.3.0...v3.0.0) (2018-07-17)
- `add` Youch error view as the default error view
- `add` Insomnia REST client to list of REST clients
- `add` register plugin only once by activating the hapi plugin’s `once: true` attribute
- `update` response type for JSON responses to `application/json`
- `update` JSON responses have well-formatted payload
- `update` examples: use a wildcard route and show error details for each path
- `remove` the `useYouch` plugin option (Youch is the default now)
- `remove` previous default error view

### Breaking Changes
The most important breaking change is the removed `useYouch` option. Upgrading to `hapi-dev-errors` 3.0 should be no problem, even if you use the `useYouch` option. Because Youch is the default error view in 3.0, you’ll receive the exact same error view.

If you used the default error view before, you’ll now see the Youch error details instead. You’ll like it :)


## Version [2.3.0](https://github.com/futurestudio/hapi-dev-errors/compare/v2.2.0...v2.3.0) (2018-07-12)
- `add` new plugin option: `toTerminal`, default: `true`
- `add` pretty error details in the terminal besides the web view. Based on [`youch-terminal`](https://github.com/poppinss/youch-terminal)
- `update` minor code reformats and restructuring


## Version [2.2.0](https://github.com/futurestudio/hapi-dev-errors/compare/v2.1.0...v2.2.0) (2018-06-02)
- `add` JSON response for CLI requests (cURL, Postman, wget) (thank you @pi0)


## Version [2.1.0](https://github.com/futurestudio/hapi-dev-errors/compare/v2.0.1...v2.1.0) (2018-02-12)
- `add` status code to Youch error and show it in the view
- `update` example code in readme to async/await
- `update` examples to fully async/await code


## Version [2.0.1](https://github.com/futurestudio/hapi-dev-errors/compare/v2.0.0...v2.0.1) (2017-11-06)
- `update` dependencies to latest stable releases
- `update` readme


## Version [2.0.0](https://github.com/futurestudio/hapi-dev-errors/compare/v2.0.0-rc.1...v2.0.0) (2017-11-06)
- `update` readme: requirements and examples


## Version [2.0.0-rc.1](https://github.com/futurestudio/hapi-dev-errors/compare/v1.3.2...v2.0.0-rc.1) (2017-10-27)
- `update` code to support hapi v17
- `update` dependencies to newest versions


## Version [1.3.2](https://github.com/futurestudio/hapi-dev-errors/compare/v1.3.1...v1.3.2) (2017-10-18)
- `update` code formatting to ESLint styling for hapi, based on `eslint-config-hapi`
- `add` Handlebars as devDependency for template example


## Version [1.3.1](https://github.com/futurestudio/hapi-dev-errors/compare/v1.3.0...v1.3.1) (2017-10-17)
- `remove` editor config for code formatting (`.editorconfig` file)
- `add` eslint configuration via `.eslintrc.json`
- `add` required engine in `package.json`: `>=4.0.0`. This package required Node.js v4+ with release 1.0. This setting makes sure that NPM follows this dependency.


## Version [1.3.0](https://github.com/futurestudio/hapi-dev-errors/compare/v1.2.0...v1.3.0) (2017-10-12)
- `add` handling of promise rejections, like `reply(Promise.reject(new Error('')))` (Thank you [Tafari](https://github.com/tafarij))


## Version [1.2.0](https://github.com/futurestudio/hapi-dev-errors/compare/v1.1.0...v1.2.0) (2017-08-18)
- `add` new option `useYouch` (boolean) to delegate the error handling to Youch and use its view
- `add` preview of Youch’s error view in the readme introduction
- `add` examples for the default, Youch and custom templates. Located within the `examples` directory
- `update` preview of default error view to show updated layout
- `update` highlight JS files in stacktrace (via RegEx) on default layout


## Version [1.1.0](https://github.com/futurestudio/hapi-dev-errors/compare/v1.0.0...v1.1.0) (2017-06-14)
- `optimize` plugin registration: abort early if `showErrors` is false, don’t get the template from filesystem and don’t hook the the request lifecycle extension point


## Version 1.0.0 (2017-06-14)
- reply developer friends error details by rendering a web view for browser based requests or via JSON for REST requests
- disable plugin by default
- `add` option `showErrors` to enable plugin by a boolean value or expression
- `add` option `template` to render custom view templates
- `provide` README to document currently available plugin features
