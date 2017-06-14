# Changelog

## Version 1.1.0 (2017-06-14)
- `optimize` plugin registration: abort early if `showErrors` is false, don’t get the template from filesystem and don’t hook the the request lifecycle extension point

## Version 1.0.0 (2017-06-14)
- reply developer friends error details by rendering a web view for browser based requests or via JSON for REST requests
- disable plugin by default
- `add` option `showErrors` to enable plugin by a boolean value or expression
- `add` option `template` to render custom view templates
- `provide` README to document currently available plugin features
