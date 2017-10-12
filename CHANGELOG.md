# Changelog

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
