"use strict";


const gulp = require('gulp');
const shelter = require('gulp-shelter')(gulp);

// ---------------------------------------------------------------------------------------------------------------------
// Define the project configuration here
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
const project = 'LumBoilerplate';

const configFolder = `./config`;
const distFolder = `./dist/client`;
const docsFolder = "./docs/client";
const sourceFolder = "./src/client";
const testsFolder = "./tests/client";

const appFolder = `${sourceFolder}/app`;

const unitFolder = `${testsFolder}/unit`;
const unitReportFolder = `${unitFolder}/report`;
const e2eFolder = `${testsFolder}/e2e`;
const e2eReportFolder = `${e2eFolder}/report`;


const ENABLE_DASHBOARD = false;

const serverPort = '8881';
const ENABLE_SERVER_PROXY = false;
const serverProxy = 'http://localhost:8888';

const CHECK_LINT_BEFORE_BUILD = true;

const e2eBuildType = 'prod';

// ---------------------------------------------------------------------------------------------------------------------
// You can define here commands, arguments or fragment to re-use in tasks
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
// Toggle the "-s" flag to make npm verbose (nothing) or silent (-s)
const npmRun = `npm run -s`;

const webpackBuildParameters = `--profile --display-cached --hide-modules --progress --colors`;
const webpackDevParameters = ``;
const webpackDevServerClassicParameters = `--progress --colors`;
const webpackDevServerCommonParameters = `--watch --content-base ${sourceFolder}`;
let   webpackDevServerHotReloadParameters = `--inline --hot`;
const webpackCommonParameters = `--display-error-details`;
const webpackConfig = `--config webpack.config.js`;
const webpackDevConfig = `--config config/webpack.dev.js`;
const webpackProdConfig = `--config config/webpack.prod.js`;
const webpackProdParameters = `--bail`;

const debug = `DEBUG=true`;
const envDev = `NODE_ENV='dev'`;
const envProd = `NODE_ENV='prod'`;
const envTest = `NODE_ENV='test'`;
const hidden = `HIDDEN=true`;

if (!ENABLE_DASHBOARD) {
    webpackDevServerHotReloadParameters = `${webpackDevServerHotReloadParameters} ${webpackDevServerClassicParameters}`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Define your tasks here
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
shelter({
    'lint:config': {
        dsc: `Lint config of ${project}`,
        cmd: `${npmRun} eslint -- "./*.conf*.js" "./config/**/*.js"`,
    },
    'lint:src': {
        dsc: `Lint source code of ${project}`,
        cmd: `${npmRun} run-parallel -- lint:src:ts lint:src:js lint:src:scss`,
    },
    'lint:src:ts': {
        dsc: `Lint TypeScript code of ${project}`,
        cmd: `${npmRun} tsconfig-lint -- --passive`,
    },
    'lint:src:js': {
        dsc: `Lint Javascript code of ${project}`,
        cmd: `${npmRun} eslint -- "${sourceFolder}/**/*.js" "${testsFolder}/**/*.js"`,
    },
    'lint:src:scss': {
        dsc: `Lint SASS code of ${project}`,
        cmd: `${npmRun} sass-lint -- "${sourceFolder}/**/*.s+(a|c)ss" --verbose`,
    },

    'build:dev': {
        dsc: `Build the development bundle (with linting) of ${project}`,
        cmd: `${npmRun} run-parallel -- clean:dist ${(CHECK_LINT_BEFORE_BUILD) ? 'lint:src' : ''}
              && ${envDev} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                ${webpackBuildParameters} ${webpackDevParameters}`,
    },
    'build:dev:fast': {
        dsc: `Build the development bundle (without linting) of ${project}`,
        cmd: `${npmRun} clean:dist
              && ${envDev} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                ${webpackBuildParameters} ${webpackDevParameters}`,
    },
    'build:prod': {
        dsc: `Build the production bundle (with linting) of ${project}`,
        cmd: `${npmRun} run-parallel -- clean:dist ${(CHECK_LINT_BEFORE_BUILD) ? 'lint:src' : ''}
              && ${envProd} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                 ${webpackBuildParameters} ${webpackProdParameters}`,
    },
    'build:prod:fast': {
        dsc: `Build the production bundle (without linting) of ${project}`,
        cmd: `${npmRun} clean:dist
              && ${envProd} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                 ${webpackBuildParameters} ${webpackProdParameters}`,
    },

    'clean:dist': {
        dsc: `Clean the "dist" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${distFolder}/*`,
    },
    'clean:tests:reports': {
        dsc: `Clean the tests reports folder of ${project}`,
        cmd: `${npmRun} run-parallel -- clean:unit:report clean:e2e:report`,
    },
    'clean:unit:report': {
        dsc: `Clean the "unit/report" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${unitReportFolder}/*`,
    },
    'clean:e2e:report': {
        dsc: `Clean the "e2e/report" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${e2eReportFolder}/*`,
    },
    'clean:docs': {
        dsc: `Clean the "docs" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${docsFolder}/*`,
    },
    'clean:project': {
        dsc: `Clean the ${project} project, but leave the NPM dependancies installed`,
        cmd: `${npmRun} run-parallel -- clean:dist clean:tests:reports clean:docs`,
    },
    'clean:packages': {
        dsc: `Clean the installed packages and the NPM cache of ${project}`,
        cmd: `npm cache clean
              && ${npmRun} rimraf -- node_modules/*`,
    },
    'clean:all': {
        dsc: `Clean the whole ${project} project (NPM, docs, test and dist)`,
        cmd: `${npmRun} run-parallel -- clean:project clean:packages`,
    },

    'docs': {
        dsc: `Generate the TypeScript documentation for ${project}`,
        cmd: `${npmRun} typedoc -- --options typedoc.json --exclude '**/*.(spec|specs|e2e).ts' --out ${docsFolder}
                                   --name ${project} ${appFolder}`,
    },

    'e2e': {
        dsc: `Run End to End test (Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor`,
    },
    'e2e:fast': {
        dsc: `Run End to End test (Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor`,
    },
    'e2e:debug': {
        dsc: `Run End to End test (Protractor with Chrome) in debug mode on ${project}`,
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:debug`,
    },
    'e2e:debug:fast': {
        dsc: `Run End to End test (Protractor with Chrome) in debug mode on ${project}`,
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:debug`,
    },
    'e2e:headless': {
        dsc: `Run End to End test (Protractor with Headless Chrome, XVFB needed) on ${project}`,
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:headless`,
    },
    'e2e:headless:fast': {
        dsc: `Run End to End test (Protractor with Headless Chome, XVFB needed) on ${project}`,
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:headless`,
    },

    'unit': {
        dsc: `Run unit tests (Karma with Headless Chrome, XVFB needed) on ${project}`,
        cmd: `${npmRun} clean:unit:report
              && ${envTest} ${npmRun} karma:headless -- start`,
    },
    'unit:debug': {
        dsc: `Run unit tests (Karma with Chrome) on ${project}`,
        cmd: `${npmRun} clean:unit:report
              && ${debug} ${envDev} ${npmRun} karma -- start --no-single-run`,
    },
    'unit:live': {
        dsc: `Run unit tests (Karma with Headless Chrome, XVFB needed) in watch mode on ${project}`,
        cmd: `${envDev} ${npmRun} karma:headless -- start --auto-watch --no-single-run`,
    },
    'unit:live:debug': {
        dsc: `Run unit tests (Karma with Chrome) in watch mode on ${project}`,
        cmd: `${debug} ${envDev} ${npmRun} karma -- start --auto-watch --no-single-run`,
    },

    'tests': {
        dsc: `Run all the tests (Karma and Protractor with Headless Chrome, XVFB needed) on ${project}`,
        cmd: `${npmRun} unit
              && ${npmRun} e2e:headless`,
    },
    'tests:debug': {
        dsc: `Run all the tests (Karma and Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} unit:debug
              && ${npmRun} e2e:debug`,
    },

    'serve': {
        dsc: `Start ${project} development with watcher (compile, lint, build)`,
        cmd: `${envDev} ${npmRun} webpack-dev-server -- ${webpackConfig} ${webpackCommonParameters}
                                                        ${webpackDevParameters}
                                                        ${webpackDevServerCommonParameters}
                                                        ${webpackDevServerClassicParameters}`,
    },
    'serve:live': {
        dsc: `Start ${project} development with watcher (compile, lint, build) and hot reload`,
        cmd: `${envDev} ${npmRun} webpack-dev-server -- ${webpackConfig} ${webpackCommonParameters}
                                                        ${webpackDevParameters}
                                                        ${webpackDevServerCommonParameters}
                                                        ${webpackDevServerHotReloadParameters}`,
    },

    'serve:dev': {
        dsc: `Build and start ${project} development release test server (on port ${serverPort})`,
        cmd: `${npmRun} build:dev:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                          ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
    },
    'serve:dev:fast': {
        dsc: `Start ${project} development release test server (on port ${serverPort}) on an existing build`,
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                       ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
    },
    'serve:prod': {
        dsc: `Build and start ${project} production release test server (on port ${serverPort})`,
        cmd: `${npmRun} build:prod:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                          ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
    },
    'serve:prod:fast': {
        dsc: `Start ${project} production release test server (on port ${serverPort}) on an existing build`,
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                       ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
    },

    'commit': {
        dsc: `Commit according to guidelines with Commitizen`,
        cmd: `${npmRun} commitizen`,
    },
});
