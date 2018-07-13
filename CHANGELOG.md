# Changelog

## Version 3.0.0 (2018-07-xx)
- `add` Youch error view as the default error view
- `add` Insomnia REST client to list of REST clients
- `update` response type for JSON responses to `application/json`
- `update` JSON responses have well-formatted payload
- `update` examples: use a wildcard route and show error details for each path
- `remove` plugin option: `useYouch` because Youch is the default now
- `remove` default error view

### Breaking Changes
The most important breaking change is the removed `useYouch` option. Upgrading to `hapi-dev-errors` 3.0 should be no problem, even if you use the `useYouch` option. Because Youch is the default error view in 3.0, you'll receive the exact same error view.

If you used the default error view before, you'll now see the Youch error details instead. You'll like it :)


## Version 2.3.0 (2018-07-12)
- `add` new plugin option: `toTerminal`, default: `true`
- `add` pretty error details in the terminal besides the web view. Based on [`youch-terminal`](https://github.com/poppinss/youch-terminal)
- `update` minor code reformats and restructuring

## Version 2.2.0 (2018-06-02)
- `add` JSON response for CLI requests (cURL, Postman, wget) (thank you @pi0)

## Version 2.1.0 (2018-02-12)
- `add` status code to Youch error and show it in the view
- `update` example code in readme to async/await
- `update` examples to fully async/await code

## Version 2.0.1 (2017-11-06)
- `update` dependencies to latest stable releases
- `update` readme

## Version 2.0.0 (2017-11-06)
- `update` readme: requirements and examples

## Version 2.0.0-rc.1 (2017-10-27)
- `update` code to support hapi v17
- `update` dependencies to newest versions

## Version 1.3.2 (2017-10-18)
- `update` code formatting to ESLint styling for hapi, based on `eslint-config-hapi`
- `add` Handlebars as devDependency for template example

## Version 1.3.1 (2017-10-17)
- `remove` editor config for code formatting (`.editorconfig` file)
- `add` eslint configuration via `.eslintrc.json`
- `add` required engine in `package.json`: `>=4.0.0`. This package required Node.js v4+ with release 1.0. This setting makes sure that NPM follows this dependency.

## Version 1.3.0 (2017-10-12)
- `add` handling of promise rejections, like `reply(Promise.reject(new Error('')))` (Thank you [Tafari](https://github.com/tafarij))

## Version 1.2.0 (2017-08-18)
- `add` new option `useYouch` (boolean) to delegate the error handling to Youch and use its view
- `add` preview of Youch’s error view in the readme introduction
- `add` examples for the default, Youch and custom templates. Located within the `examples` directory
- `update` preview of default error view to show updated layout
- `update` highlight JS files in stacktrace (via RegEx) on default layout

## Version 1.1.0 (2017-06-14)
- `optimize` plugin registration: abort early if `showErrors` is false, don’t get the template from filesystem and don’t hook the the request lifecycle extension point

## Version 1.0.0 (2017-06-14)
- reply developer friends error details by rendering a web view for browser based requests or via JSON for REST requests
- disable plugin by default
- `add` option `showErrors` to enable plugin by a boolean value or expression
- `add` option `template` to render custom view templates
- `provide` README to document currently available plugin features
