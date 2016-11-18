# Changelog

## 1.2.6:

#### Build management improvements:
 - scaffold: fix an error when scaffolding unit test file


## 1.2.5:

#### Build management improvements:
 - init: fix a log


## 1.2.4:

#### Miscellaneous:
 - linter: fix linter in http-interceptor service tests


## 1.2.3:

#### Miscellaneous:
 - gulp: fix "clean" tasks


## 1.2.2:

#### Documentation:
 - changelog: add a "misc" section in changelog


## 1.2.1:

#### Build management improvements:
 - npm-scripts: fix init and scaffolding call via NPM scripts


## 1.2.0:

#### Tests:
 - global: fix existing tests, refactor and improve coverage
 - config: improve karma configuration
 - config: exclude modules and routing modules from tests
 - config: leave TS comments in tests
 - config: allow to have assets in tests

#### Bug fixes:
 - bootstrap: enable prod mode before configuring platform

#### Features:
 - token: add a JSON file to simulate the token retrieval

#### Build management improvements:
 - webpack: don't display lint error as error but as warning
 - gulpfile: don't cleanup project after update


## 1.1.0:

#### Tests:
 - app: fix and improve units test of the app component

#### Documentation:
 - changelog: fix the version format in changelog

#### Bug fixes:
 - token: fix token setting/getting and improve the process

#### Features:
 - token: display the token under the to-do list
 - token: mock the token retrieval in the http service

#### Build management improvements:
 - release: auto-generate changelog when creating release
 - changelog: improve changelog generation
 - init/scaffold: improve initialization and scaffolding
 - gulp: remove an uneeded quote when launching karma
 - release: don't unignore dist when releasing lumboilerplate


## 1.0.0:

#### First release:
 - First release of the Lumapps boilerplate
