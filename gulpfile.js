const gulp = require('gulp');
const shelter = require('gulp-shelter')(gulp);

const isCI = process.env.CI || require('is-ci') || false;

// ---------------------------------------------------------------------------------------------------------------------
// Define the project configuration here
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
const project = 'LumBoilerplate';

const configFolder = './config';
const distFolder = './dist/client';
const clientDocsFolder = './docs/client';
const configDocsFolder = './docs/config';
const sourceFolder = './src/client';
const testsFolder = './tests/client';

const appFolder = `${sourceFolder}/app`;

const unitFolder = `${testsFolder}/unit`;
const unitReportFolder = `${unitFolder}/report`;
const e2eFolder = `${testsFolder}/e2e`;
const e2eReportFolder = `${e2eFolder}/report`;

const enableDashboard = false;
const isWebpack2 = true;

const serverPort = '8881';
const enableServerProxy = false;
const serverProxy = 'http://localhost:8888';
const withProxy = (enableServerProxy) ? '--proxy ' + serverProxy : '';

const checkLintBeforeBuild = true;

const e2eBuildType = 'prod';

// ---------------------------------------------------------------------------------------------------------------------
// You can define here commands, arguments or fragment to re-use in tasks
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
// Toggle the "-s" flag to make npm verbose (nothing) or silent (-s)
const npmRun = `npm -s run`;

const withDisplayCached = (isWebpack2) ? '' : '--display-cached';
const withDisplayErrorDetail = (isWebpack2) ? '' : '--display-error-details';
const withWatch = (isWebpack2) ? '' : '--watch';
const withProgress = (isCI) ? '' : '--progress';

const linterTask = (checkLintBeforeBuild) ? 'lint:src' : '';

const webpackBuildParameters = `--profile ${withDisplayCached} --hide-modules ${withProgress}`;
const webpackDevParameters = ``;
const webpackDevServerClassicParameters = `${withProgress}`;
const webpackDevServerCommonParameters = `${withWatch} --content-base ${sourceFolder}`;
let webpackDevServerHotReloadParameters = `--inline --hot`;
const webpackCommonParameters = `${withDisplayErrorDetail}`;
const webpackConfig = `--config webpack.config.js`;
const webpackProdParameters = `--bail`;

const debug = `DEBUG=true`;
const envDev = `NODE_ENV='dev'`;
const envProd = `NODE_ENV='prod'`;
const envTest = `NODE_ENV='test'`;
const hidden = `HIDDEN=true`;

if (!enableDashboard) {
    webpackDevServerHotReloadParameters = `${webpackDevServerHotReloadParameters} ${webpackDevServerClassicParameters}`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Define your tasks here
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
shelter({
    'build:dev': {
        cmd: `${npmRun} run-parallel -- clean:dist
                                        ${linterTask}
              && ${envDev} ${npmRun} webpack ${webpackConfig} ${webpackCommonParameters}
                                             ${webpackBuildParameters} ${webpackDevParameters}`,
        dsc: `Build the development bundle after linting of ${project}`,
    },
    'build:dev:fast': {
        cmd: `${npmRun} clean:dist
              && ${envDev} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                ${webpackBuildParameters} ${webpackDevParameters}`,
        dsc: `Build the development bundle (without linting) of ${project}`,
    },
    'build:prod': {
        cmd: `${npmRun} run-parallel -- clean:dist
                                        ${linterTask}
              && ${envProd} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                 ${webpackBuildParameters} ${webpackProdParameters}`,
        dsc: `Build the production bundle after linting of ${project}`,
    },
    'build:prod:fast': {
        cmd: `${npmRun} clean:dist
              && ${envProd} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                 ${webpackBuildParameters} ${webpackProdParameters}`,
        dsc: `Build the production bundle (without linting) of ${project}`,
    },

    'check:prerequisites': {
        cmd: `${npmRun} check:prerequisites:core`,
        dsc: `Check that you meet the pre-requisites needed for using ${project}`,
    },

    'clean:all': {
        cmd: `${npmRun} run-parallel -- clean:project
                                        clean:packages
                                        clean:misc`,
        dsc: `Clean the whole ${project} project (NPM, docs, test and dist)`,
    },
    'clean:dist': {
        cmd: `${npmRun} rimraf -- ${distFolder}/*`,
        dsc: `Clean the "dist" folder of ${project}`,
    },
    'clean:docs': {
        cmd: `${npmRun} run-parallel -- clean:docs:client
                                        clean:docs:config`,
        dsc: `Clean the "client" and "config" folder of the "docs" folder of ${project}`,
    },
    'clean:docs:client': {
        cmd: `${npmRun} rimraf -- ${clientDocsFolder}/*`,
        dsc: `Clean the "docs/client" folder of ${project}`,
    },
    'clean:docs:config': {
        cmd: `${npmRun} rimraf -- ${configDocsFolder}/*`,
        dsc: `Clean the "docs/config" folder of ${project}`,
    },
    'clean:e2e:report': {
        cmd: `${npmRun} run-parallel -- "rimraf -- ${e2eReportFolder}/*"
                                        "rimraf -- ${testsFolder}/e2e*.tar.gz"`,
        dsc: `Clean the "e2e/report" folder of ${project}`,
    },
    'clean:maps': {
        cmd: `${npmRun} run-parallel -- "rimraf -- ${sourceFolder}/**/*.map"
                                        "rimraf -- ${testsFolder}/**/*.map"`,
        dsc: `Clean maps files of ${project}`,
    },
    'clean:misc': {
        cmd: `${npmRun} rimraf -- ./build.*`,
        dsc: `Clean misceallenous files of ${project}`,
    },
    'clean:packages': {
        cmd: `${npmRun} clean:packages:core`,
        dsc: `Clean the installed packages and the Yarn or NPM cache of ${project}`,
    },
    'clean:project': {
        cmd: `${npmRun} run-parallel -- clean:dist
                                        clean:tests:reports
                                        clean:docs
                                        clean:maps`,
        dsc: `Clean the ${project} project, but leave the NPM dependancies installed`,
    },
    'clean:tests:reports': {
        cmd: `${npmRun} run-parallel -- clean:unit:report clean:e2e:report`,
        dsc: `Clean the tests reports folder of ${project}`,
    },
    'clean:unit:report': {
        cmd: `${npmRun} run-parallel -- "rimraf -- ${unitReportFolder}/*"
                                        "rimraf -- ${testsFolder}/unit*.tar.gz"`,
        dsc: `Clean the "unit/report" folder of ${project}`,
    },

    'commit': {
        cmd: `${npmRun} commitizen`,
        dsc: `Commit according to guidelines with Commitizen`,
    },

    'docs': {
        cmd: `${npmRun} run-parallel -- docs:client
                                        docs:config`,
        dsc: `Generate the whole (client and config) documentation of ${project}`,
    },
    'docs:client': {
        cmd: `${npmRun} typedoc -- --options typedoc.json --out ${clientDocsFolder} --name "${project}" --hideGenerator
                                   --target ES5 --readme ./README.md --excludeExternals ${appFolder}`,
        dsc: `Generate the TypeScript documentation for ${project}`,
    },
    'docs:config': {
        cmd: `${npmRun} jsdoc -- --configure jsdoc.json --package ./package.json --readme ./README.md ${configFolder}`,
        dsc: `Generate the JavaScript documentation of the config of ${project}`,
    },

    'e2e': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast
                                        clean:e2e:report
                                        webdriver:update
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                              protractor`,
        dsc: `Run End to End test (Protractor with Chrome) after rebuilding on ${project}`,
    },
    'e2e:debug': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast
                                        clean:e2e:report
                                        webdriver:update
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                                       protractor:debug`,
        dsc: `Debug End to End test (Protractor with Chrome) after rebuilding on ${project}`,
    },
    'e2e:debug:fast': {
        cmd: `${npmRun} clean:e2e:report
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                                       protractor:debug`,
        dsc: `Debug End to End test (Protractor with Chrome) with existing build on ${project}`,
    },
    'e2e:fast': {
        cmd: `${npmRun} clean:e2e:report
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                              protractor`,
        dsc: `Run End to End test (Protractor with Chrome) with existing build on ${project}`,
    },
    'e2e:headless': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast
                                        clean:e2e:report
                                        webdriver:update
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                                        protractor:headless`,
        dsc: `Run End to End test (Protractor with Headless Chrome, XVFB needed) after rebuilding on ${project}`,
    },
    'e2e:headless:fast': {
        cmd: `${npmRun} clean:e2e:report
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast:silent
                                                        protractor:headless`,
        dsc: `Run End to End test (Protractor with Headless Chome, XVFB needed) with existing build on ${project}`,
    },

    'lint:config': {
        cmd: `${npmRun} eslint -- "./*.js" "${configFolder}/**/*.js"`,
        dsc: `Lint config of ${project}`,
    },
    'lint:src': {
        cmd: `${npmRun} run-parallel -- lint:src:ts
                                        lint:src:js
                                        lint:src:scss`,
        dsc: `Lint source code of ${project}`,
    },
    'lint:src:js': {
        cmd: `${npmRun} eslint -- "${sourceFolder}/**/*.js" "${testsFolder}/**/*.js"`,
        dsc: `Lint Javascript code of ${project}`,
    },
    'lint:src:scss': {
        cmd: `${npmRun} sass-lint -- "${sourceFolder}/**/*.s+(a|c)ss" --verbose`,
        dsc: `Lint SASS code of ${project}`,
    },
    'lint:src:ts': {
        cmd: `${npmRun} tsconfig-lint -- --passive`,
        dsc: `Lint TypeScript code of ${project}`,
    },

    'scaffold': {
        cmd: `bash -c "./scaffold.sh"`,
        dsc: `Scaffold a new stub element in ${project}`,
    },
    'scaffold:component': {
        cmd: `bash -c "./scaffold.sh -t Component --not-core"`,
        dsc: `Scaffold a new stub component in ${project}`,
    },
    'scaffold:component:core': {
        cmd: `bash -c "./scaffold.sh -t Component --core"`,
        dsc: `Scaffold a new stub core component in ${project}`,
    },
    'scaffold:help': {
        cmd: `bash -c "./scaffold.sh --help"`,
        dsc: `Show the help page for the scaffolding in ${project}`,
    },
    'scaffold:module': {
        cmd: `bash -c "./scaffold.sh -t Module --not-core"`,
        dsc: `Scaffold a new stub module in ${project}`,
    },
    'scaffold:module:core': {
        cmd: `bash -c "./scaffold.sh -t Module --core"`,
        dsc: `Scaffold a new stub core module in ${project}`,
    },

    'serve': {
        cmd: `${envDev} ${npmRun} webpack-dev-server -- ${webpackConfig} ${webpackCommonParameters}
                                                        ${webpackDevParameters}
                                                        ${webpackDevServerCommonParameters}
                                                        ${webpackDevServerClassicParameters}`,
        dsc: `Start ${project} development with watcher (compile, lint, build)`,
    },
    'serve:dev': {
        cmd: `${npmRun} build:dev:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False --cors -s ${withProxy}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) after rebuilding`,
    },
    'serve:dev:fast': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False --cors -s ${withProxy}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) with an existing build`,
    },
    'serve:dev:fast:open': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False -o --cors -s ${withProxy}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) with an existing build and open
              it in a browser`,
    },
    'serve:dev:open': {
        cmd: `${npmRun} build:dev:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False -o --cors -s ${withProxy}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) after rebuilding and open it in a
              browser`,
    },
    'serve:live': {
        cmd: `${envDev} ${npmRun} webpack-dev-server -- ${webpackConfig} ${webpackCommonParameters}
                                                        ${webpackDevParameters}
                                                        ${webpackDevServerCommonParameters}
                                                        ${webpackDevServerHotReloadParameters}`,
        dsc: `Start ${project} development with watcher (compile, lint, build) and hot reload`,
    },
    'serve:prod': {
        cmd: `${npmRun} build:prod:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False --cors -s ${withProxy}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) after rebuilding`,
    },
    'serve:prod:fast': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False --cors -s ${withProxy}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) with an existing build`,
    },
    'serve:prod:fast:open': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False -o --cors -s ${withProxy}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) with an existing build and open it
              in a browser`,
    },
    'serve:prod:open': {
        cmd: `${npmRun} build:prod:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -d False -i False -o --cors -s ${withProxy}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) after rebuilding and open it in a
              browser`,
    },

    'setup': {
        cmd: `${npmRun} setup:core
              && ${npmRun} task -- clean:project`,
        dsc: `Clean setup ${project}: cleanup already installed packages, empty cache, install packages (using Yarn if
                                available, NPM else) and prepare for running`,
    },
    'setup:fast': {
        cmd: `${npmRun} check:prerequisites
              && ${npmRun} setup:fast:yarn:npm
              && ${npmRun} task -- clean:project`,
        dsc: `Quick setup ${project}: install packages (using Yarn if available, NPM else) and prepare for running`,
    },
    'setup:update': {
        cmd: `${npmRun} setup:update:yarn:npm
              && ${npmRun} task -- clean:project`,
        dsc: `Update ${project}: upgrade packages (using Yarn if available, NPM else)`,
    },

    'tests': {
        cmd: `${npmRun} unit
              && ${npmRun} e2e`,
        dsc: `Run all the tests (Karma and Protractor) on ${project}`,
    },
    'tests:debug': {
        cmd: `${npmRun} unit:debug
              && ${npmRun} e2e:debug`,
        dsc: `Debug all the tests (Karma and Protractor with Chrome) on ${project}`,
    },
    'tests:headless': {
        cmd: `${npmRun} unit:headless
              && ${npmRun} e2e:headless`,
        dsc: `Run all the tests (Karma and Protractor with Headless Chrome, XVFB needed) on ${project}`,
    },

    'unit': {
        cmd: `${npmRun} clean:unit:report
              && ${debug} ${envDev} ${npmRun} karma -- start`,
        dsc: `Run unit tests (Karma with Chrome) on ${project}`,
    },
    'unit:debug': {
        cmd: `${npmRun} clean:unit:report
              && ${debug} ${envDev} ${npmRun} karma -- start --no-single-run`,
        dsc: `Debug unit tests (Karma with Chrome) on ${project}`,
    },
    'unit:headless': {
        cmd: `${npmRun} clean:unit:report
              && ${envTest} ${npmRun} karma:headless -- start`,
        dsc: `Run unit tests (Karma with Headless Chrome, XVFB needed) on ${project}`,
    },
    'unit:live': {
        cmd: `${envDev} ${npmRun} karma -- start --auto-watch --no-single-run`,
        dsc: `Run unit tests (Karma with Chrome) in watch mode on ${project}`,
    },
    'unit:live:debug': {
        cmd: `${debug} ${envDev} ${npmRun} karma -- start --auto-watch --no-single-run`,
        dsc: `Debug unit tests (Karma with Chrome) in watch mode on ${project}`,
    },
    'unit:live:headless': {
        cmd: `${envDev} ${npmRun} karma:headless -- start --auto-watch --no-single-run`,
        dsc: `Run unit tests (Karma with Headless Chrome, XVFB needed) in watch mode on ${project}`,
    },
});
