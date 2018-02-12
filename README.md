<p align="center">
  <img height="256" src="https://github.com/fs-opensource/hapi-dev-errors/blob/master/media/hapi-dev-errors.png?raw=true" alt="hapi-dev-errors logo">
</p>

<p align="center">
    <a href="https://travis-ci.org/fs-opensource/hapi-dev-errors"><img src="https://camo.githubusercontent.com/9f56ef242c6f588f74f39f0bd61c1acd34d853af/68747470733a2f2f7472617669732d63692e6f72672f66732d6f70656e736f757263652f686170692d67656f2d6c6f636174652e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/fs-opensource/hapi-dev-errors.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://snyk.io/test/github/fs-opensource/hapi-dev-errors"><img src="https://snyk.io/test/github/fs-opensource/hapi-dev-errors/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/fs-opensource/hapi-dev-errors" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/hapi-dev-errors"><img src="https://img.shields.io/npm/v/hapi-dev-errors.svg" alt="hapi-dev-errors Version" data-canonical-src="https://img.shields.io/npm/v/hapi-dev-errors.svg" style="max-width:100%;"></a>
</p>

------

<p align="center"><sup>Development of this hapi plugin is supported by <a href="https://futurestud.io">Future Studio University 🚀</a></sup>
<br><b>
Join the <a href="https://futurestud.io/university">Future Studio University and Skyrocket in Node.js</a></b>
</p>

------


## Introduction
A hapi plugin to return an error view for web requests, providing more details of the issue. Also, provides the
error stacktrace within the browser and you can skip the extra look at your command line to catch the issue.

![hapi-dev-errors default error view](media/hapi-dev-errors-default-view.png)

You can choose [Youch](https://github.com/poppinss/youch) to handle your error reporting by using the `useYouch: true`
[option](https://github.com/fs-opensource/hapi-dev-errors#plugin-registration-options). `hapi-dev-errors` integrates
seamlessly with Youch and delegates the error handling, if activated. The view will look like this:

![hapi-dev-errors Youch error view](media/hapi-dev-errors-useYouch-view.png)


## Requirements
This plugin uses async/await which requires **Node.js v8 or newer**.


## Installation
Add `hapi-dev-errors` as a dependency to your project:

```bash
npm i -S hapi-dev-errors
# you’re using NPM shortcuts to (i)nstall and (-S)ave the module as a dependency

# NPM v5 users, this way is yours
npm i hapi-dev-errors
```


### Do you use hapi v16 (or lower)?
Use the `1.3.2` release of `hapi-dev-errors` with hapi v16. Later versions are only compatible with hapi v17.

```bash
npm i -S hapi-dev-errors@1.3.2
# you’re using NPM shortcuts to (i)nstall and (-S)ave the module as a dependency

# NPM v5 users, this way is yours
npm i hapi-dev-errors@1.3.2
```


## Examples
Check out the [examples](https://github.com/fs-opensource/hapi-dev-errors/tree/master/examples) directory and get
an impression on how to configure `hapi-dev-errors` with the individual plugins options and how to customize the
error view.

## Usage
**`hapi-dev-errors` is disabled by default to avoid leaking sensitive error details during production.**

Enable the plugin by define a "truthy" value for the `showErrors` option.

The most straight forward way to register the `hapi-dev-errors` plugin:

```js
await server.register({
    plugin: require('hapi-dev-errors'),
    options: {
      showErrors: process.env.NODE_ENV !== 'production'
    }
})

// went smooth like chocolate :)
```


## Plugin Registration Options
The following plugin options allow you to customize the default behavior of `hapi-dev-errors`:

- **showErrors**: `(boolean)`, default: `false` — by default, the plugin is disabled and keeps hapi's default error handling behavior
- **useYouch**: `(boolean)`, default: `false` — use [Youch](https://github.com/poppinss/youch) to handle and display the error instead of using `hapi-dev-error`’s default handling
- **template**: `(string)`, no default — provide the template name that you want to render with `h.view(template, errorData)`

```js
await server.register({
    plugin: require('hapi-dev-errors'),
    options: {
        showErrors: process.env.NODE_ENV !== 'production',
        template: 'my-error-view'
    }
})

// went smooth like chocolate :)
```

## Provided Values for Your Custom Error View
`hapi-dev-errors` supports the `template` option while registering the plugin. Provide a template name to
use your personal error template and not the default one shipped with `hapi-dev-errors`. In case you pass a string
value for the template name, the view will be rendered with `h.view(template, errorData).code(500)`.

Available properties to use in your custom error view:

- `title`: error title like `Internal Server Error`
- `statusCode`: HTTP response status code (always 500)
- `message`: error message, like `Uncaught error: h.view(...).test is not a function`
- `method`: HTTP request method, like `GET`
- `url`: URL request path, like `/signup`
- `headers`: HTTP request headers object, in key-value format
- `payload`: HTTP request payload, only available for HTTP methods other than `GET`, in key-value format
- `stacktrace`: error stacktrace


## Feature Requests
Do you miss a feature? Please don’t hesitate to
[create an issue](https://github.com/fs-opensource/hapi-dev-errors/issues) with a short description of your
desired addition to this plugin.


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running) with 80+ tutorials
- [Youch](https://github.com/poppinss/youch) - Pretty error reporting for Node.js

## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@fs-opensource](https://github.com/fs-opensource/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
