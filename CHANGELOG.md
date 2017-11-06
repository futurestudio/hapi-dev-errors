# Changelog

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
