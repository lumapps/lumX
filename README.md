# lumX

[![Join the chat at https://gitter.im/lumapps/lumX](https://badges.gitter.im/lumapps/lumX.svg)](https://gitter.im/lumapps/lumX?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The first responsive front-end framework based on [AngularJS][angularjs] & [Google Material Design specifications][material]. *lumX* will help you design your applications faster and more easily. We followed Google Material Design recommendations to bring the best experience to your users.

## Quick start

Three quick start options are available:

- [Download the latest release][release].
- Clone the repo: `git clone https://github.com/lumapps/lumx.git`.
- Install with NPM: `npm install official-lumx` (or Yarn: `yarn add official-lumx`).

## Documentation

lumX's documentation, included in this repo in the demo directory, is built with [Gulp][gulp] and hosted on [Google App Engine][gae] at http://ui.lumapps.com. The docs may also be run locally.

### Running documentation locally

1. If necessary, install the [Python SDK of Google App Engine][gaepython].
2. In your environment, declare the variable `APPENGINE` with the path to your Google App Engine binaries.
For example, using bash in a Unix system with the default path will need to edit the `.bashrc` in your home to add:
    ```bash
    export APPENGINE=/home/USER/google-cloud-sdk/bin/
    ```

Then install all dependencies:

* Run `npm install` (or `yarn install`).

Then run the build system and the server:

1. Run `gulp`.
2. In an other terminal, run `./launch.sh` (or `./dlaunch.sh` if you want to use Docker, recommended on MacOS X).
3. Visit [http://localhost:8888][local] in your browser, and voilà.

#### or

1. Run `gulp serve`.
2. Visit [http://localhost:8080][local] in your browser, and voilà.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md). The roadmap is available in [this repo](ROADMAP.md).

## Copyright and license

Code and documentation copyright 2018 LumApps. Code released under the [MIT license](LICENSE.md).


[angularjs]: https://angularjs.org/
[gae]: https://cloud.google.com/appengine/
[gaepython]: https://cloud.google.com/appengine/downloads
[gulp]: http://gulpjs.com/
[local]: http://localhost:8888
[material]: http://www.google.com/design/spec/material-design/introduction.html
[release]: https://github.com/lumapps/lumX/tags
