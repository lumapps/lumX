# LumX²

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

[![Join the chat at https://gitter.im/lumapps/lumX](https://badges.gitter.im/lumapps/lumX.svg)](https://gitter.im/lumapps/lumX?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The first responsive front-end framework based on [Angular2][angular2] & [Google Material Design specifications][material]. *lumX²* will help you to design your applications faster and easier. We followed Google Material Design recommendations to bring the best experience to your users.

## Quick start

Three quick start options are available:

- [Download the latest release][release].
- Clone the repo: git clone https://github.com/lumapps/lumx.git.
- Install with NPM: `npm install lumx2`.

## Documentation

lumX²'s documentation, included in this repo in the demo directory, is built with [Webpack][webpack] and hosted on [Google App Engine][gae] at http://ui2.lumapps.com. The docs may also be run locally.

### Running documentation locally

1. If necessary, install the [Python SDK of Google App Engine][gaepython].
2. In your environment, declare the variable `APPENGINE` with the path to your Google App Engine binaries.
For example, using bash in a Unix system with the default path will need to edit the `.bashrc` in your home to add:
    ```bash
    export APPENGINE=/home/USER/google-cloud-sdk/bin/
    ```
3. Run `npm run setup`.
4. Run `npm start`.
5. Visit [http://localhost:8880][local-live] in your browser, and voilà.

#### or

1. Run `npm run setup`.
2. Run `npm serve:prod`.
3. Visit [http://localhost:8881][local-prod] in your browser, and voilà.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md). The roadmap is available in [this repo](ROADMAP.md).

## Copyright and license

Code and documentation copyright 2016 LumApps. Code released under the [MIT license](LICENSE.md).


[angular2]: https://angular.io/
[gae]: https://cloud.google.com/appengine/
[gaepython]: https://cloud.google.com/appengine/downloads
[webpack]: https://webpack.github.io/
[local-live]: http://localhost:8880
[local-prod]: http://localhost:8881
[material]: http://www.google.com/design/spec/material-design/introduction.html
[release]: https://github.com/lumapps/lumX/tags