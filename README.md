# LumBoilerplate

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

This project aims to give a boilerplate to initialize a new Angular2/TypeScript/Webpack web project

## Pre-requisites

You can run `npm run -s check:prerequisites` to check if you meet all pre-requisites for using the boilerplate.
These pre-requisites are:

- NodeJS >= 6.0.0
- GNU Bash >= 4.0.0
- GNU Sed >= 4.0.0
- XVFB (Optional, needed only for headless tests)

#### For MacOS X users

Follow these steps to install the needed version of GNU Bash 4 (more information available [here](http://clubmate.fi/upgrade-to-bash-4-in-mac-os-x/)):

- Install [HomeBrew](http://brew.sh/) : `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Update HomeBrew packages list: `brew update`
- Install GNU Bash 4: `brew install bash`

Follow these steps to install the needed version of GNU Sed 4:

- Install [HomeBrew](http://brew.sh/) : `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- Update HomeBrew packages list: `brew update`
- Install GNU Sed 4: `brew install gnu-sed --with-default-names`
- Update your path with: `PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"` (you can add this to your '~/.bashrc' file if you are using Bash or to your '~/.zshrc' if you are using (OhMy)Zsh)

After restarting your terminal, try to run `npm run -s check:prerequisite` again.

If you want to be able to launch the headless tests, you will need to have [XVFB](https://en.wikipedia.org/wiki/Xvfb) installed on your system. Since X11 is no longer included with OS X, you will have to install [XQuartz](https://www.xquartz.org/) which includes XVFB.

## Quick start

- Clone the repo: `git clone https://github.com/lumapps/boilerplate.git &lt;your new project folder&gt;`
- Go to the new project folder: `cd &lt;your new project folder&gt;`
- Initialize the boilerplate: `npm run -s init`
- ...
- Profit

You can then run `npm run -s help` to see a list of all available commands.

## Updating the packages

If you want to update the packages used by the boilerplate and your project to the last version, many possibilities are available:

- For a fresh start, run `npm run -s setup`.
This will delete all installed package, clean the packages manager cache and re-install all packages to their last version.
It will also clean your project.
- For a quick update, run `npm run -s update`.
This will simply install new packages and upgrade existing one.

The boilerplate can use either [Yarn](https://yarnpkg.com/) or [NPM](https://www.npmjs.com/) as a packages manager. It will automatically use Yarn if available and fallback to NPM if needed.

## Running your project

To run your project, simply execute the command `npm run -s start`.
This should start everything needed and open a browser to [http://localhost:8880/](http://localhost:8880/).

## Coding under the boilerplate

You can scaffold new stub element in you project by using the included scaffolder. Run `npm run -s scaffold:help` to see how to use the scaffolder.
You can then use the shortcut `npm run -s scaffold[:&lt;element&gt;][:core][ -- &lt;params&gt;]` to create a stub (core) element with the scaffolder. If you don't give any type or any special parameter, the scaffolder will ask you question to help you create your element.

You can use the included linter to check lint and style of your code. Simply run `npm run -s lint:src[:ts|js|scss]` to lint TypeScript, Javascript and SASS code.

You can use the Commitizen convention to commit your code by running `npm run -s commit` instead of running `git commit`. It will help you build a valid commit message.

## Documenting you project

If you use JSDoc format in your TypeScript source file, you should be able to generate the documentation using `npm run -s docs:client`. This will generate a documentation in 'docs/client'.

## Building your project

When you want to ship your code, you can package it in bundles. To do so, run `npm run -s build:&lt;target&gt;[:fast]`.
`target` can be 'dev' which will produce an non-minified bundle or 'prod'/'dist' which will produce an optimized, minified and obfuscated bundle.
Before the build your bundle, linter will automatically be launched to ensure that your code is safe to be shipped (unless you specified the `:fast` in the task).

When you have build a bundle, you can test the bundle by starting the project in a specific way. Simply `npm run -s serve:&lt;target&gt;[:fast][:silent]`:

- `target` is the same target that you specify for the build.
- If you don't specify `:fast`, then the bundle will be rebuild beforehand and then launched.
- If you don't specify `:silent`, then a browser page will be opened.

Once the bundle is served, you can access it by going to [http://localhost:8881/](http://localhost:8881/).

## Testing your project

You can write Unit and End To End (E2E) tests that can be then run with the boilerplate.

- Write Unit tests along the code you are testing.
- Write E2E tests in 'tests/client/e2e/specs'.
We recommand you to write a page object for your E2E tests to help for maintenability. You can place your pages objects in 'tests/client/e2e/specs'.
You can find (and improve) an helper class in 'tests/client/e2e/helpers/user-browser.class.ts' that you can use in your tests.

The tests file names must end with '.spec[s].ts'.


- To launch both Unit and E2E tests: `npm run -s tests[:headless|:debug]`. This will launch all you Unit and E2E tests.
- To launch only Unit tests: `npm run -s unit[:live][:headless|:debug]`.
You can launch the Unit test in live watch mode by specifying `:live`. In this mode, any modification made to the source code or to your tests will relaunch the impacted test(s).
- To launch only E2E tests: `npm run -s e2e[:headless|:debug][:fast]`.
E2E tests will first build a bundle to test among. If you specify `:fast`, the E2E tests will use the previously generated bundle or fail if none is available.

The `:headless` parameter allow to launch the tests using an headless version of Chrome. This option needs [XVFB](https://en.wikipedia.org/wiki/Xvfb) the be installed (see pre-requisites).
The `:debug` parameter allow to debug the tests by leaving the browser opened afterward.

The tests will produce reports that are available in 'tests/client/unit/report/' (for Unit tests report and coverage) and 'tests/client/e2e/reports' (for E2E tests report and failed tests screenshots).
Moreover, a summary of coverage and tests results is displayed in the terminal.

## Cleaning your project

At any time, you can execute any of the `npm run -s clean:&lt;type&gt;` command to cleanup some part of the boilerplate and your project.
See `npm run -s help` to see a complete list of available clean commands.

## How to get help, contribute, or provide feedback

Please refer to our [contributing guidelines](CONTRIBUTING.md).
The roadmap is available in [this repository](ROADMAP.md).

## Copyright and license

Code and documentation copyright 2016 LumApps. Code released under the [MIT license](LICENSE.md).
