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
const docsFolder = './docs/client';
const sourceFolder = './src/client';
const testsFolder = './tests/client';

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
const npmRun = `npm -s run`;

const webpackBuildParameters = `--profile --display-cached --hide-modules ${(isCI) ? '' : '--progress --colors'}`;
const webpackDevParameters = ``;
const webpackDevServerClassicParameters = `${(isCI) ? '' : '--progress --colors'}`;
const webpackDevServerCommonParameters = `--watch --content-base ${sourceFolder}`;
let webpackDevServerHotReloadParameters = `--inline --hot`;
const webpackCommonParameters = `--display-error-details`;
const webpackConfig = `--config webpack.config.js`;
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
    'build:dev': {
        cmd: `${npmRun} run-parallel -- clean:dist ${(CHECK_LINT_BEFORE_BUILD) ? 'lint:src' : ''}
              && ${envDev} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
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
        cmd: `${npmRun} run-parallel -- clean:dist ${(CHECK_LINT_BEFORE_BUILD) ? 'lint:src' : ''}
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

    'clean:all': {
        cmd: `${npmRun} run-parallel -- clean:project clean:packages clean:misc`,
        dsc: `Clean the whole ${project} project (NPM, docs, test and dist)`,
    },
    'clean:dist': {
        cmd: `${npmRun} rimraf -- ${distFolder}/*`,
        dsc: `Clean the "dist" folder of ${project}`,
    },
    'clean:docs': {
        cmd: `${npmRun} rimraf -- ${docsFolder}/*`,
        dsc: `Clean the "docs" folder of ${project}`,
    },
    'clean:e2e:report': {
        cmd: `${npmRun} rimraf -- ${e2eReportFolder}/*
              && ${npmRun} rimraf -- ${testsFolder}/e2e*.tar.gz`,
        dsc: `Clean the "e2e/report" folder of ${project}`,
    },
    'clean:maps': {
        cmd: `${npmRun} rimraf -- ${sourceFolder}/**/*.map
              && ${npmRun} rimraf -- ${testsFolder}/**/*.map`,
        dsc: `Clean maps files of ${project}`,
    },
    'clean:misc': {
        cmd: `${npmRun} rimraf -- ./build.*`,
        dsc: `Clean misceallenous files of ${project}`,
    },
    'clean:packages': {
        cmd: `npm cache clean
              && ${npmRun} rimraf -- node_modules/*`,
        dsc: `Clean the installed packages and the NPM cache of ${project}`,
    },
    'clean:project': {
        cmd: `${npmRun} run-parallel -- clean:dist clean:tests:reports clean:docs clean:maps`,
        dsc: `Clean the ${project} project, but leave the NPM dependancies installed`,
    },
    'clean:tests:reports': {
        cmd: `${npmRun} run-parallel -- clean:unit:report clean:e2e:report`,
        dsc: `Clean the tests reports folder of ${project}`,
    },
    'clean:unit:report': {
        cmd: `${npmRun} rimraf -- ${unitReportFolder}/*
              && ${npmRun} rimraf -- ${testsFolder}/unit*.tar.gz`,
        dsc: `Clean the "unit/report" folder of ${project}`,
    },

    'commit': {
        cmd: `${npmRun} commitizen`,
        dsc: `Commit according to guidelines with Commitizen`,
    },

    'docs': {
        cmd: `${npmRun} typedoc -- --options typedoc.json --exclude '**/*.(spec|specs|e2e).ts' --out ${docsFolder}
                                   --name ${project} ${appFolder}`,
        dsc: `Generate the TypeScript documentation for ${project}`,
    },

    'e2e': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor`,
        dsc: `Run End to End test (Protractor with Chrome) after rebuilding on ${project}`,
    },
    'e2e:debug': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:debug`,
        dsc: `Debug End to End test (Protractor with Chrome) after rebuilding on ${project}`,
    },
    'e2e:debug:fast': {
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${debug} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:debug`,
        dsc: `Debug End to End test (Protractor with Chrome) with existing build on ${project}`,
    },
    'e2e:fast': {
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor`,
        dsc: `Run End to End test (Protractor with Chrome) with existing build on ${project}`,
    },
    'e2e:headless': {
        cmd: `${npmRun} run-parallel -- build:${e2eBuildType}:fast clean:e2e:report webdriver:update
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:headless`,
        dsc: `Run End to End test (Protractor with Headless Chrome, XVFB needed) after rebuilding on ${project}`,
    },
    'e2e:headless:fast': {
        cmd: `${npmRun} run-parallel -- clean:e2e:report
              && ${hidden} ${npmRun} run-parallel -- -r serve:${e2eBuildType}:fast protractor:headless`,
        dsc: `Run End to End test (Protractor with Headless Chome, XVFB needed) with existing build on ${project}`,
    },

    'lint:config': {
        cmd: `${npmRun} eslint -- "./*.js" "${configFolder}/**/*.js"`,
        dsc: `Lint config of ${project}`,
    },
    'lint:src': {
        cmd: `${npmRun} run-parallel -- lint:src:ts lint:src:js lint:src:scss`,
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

    'serve': {
        cmd: `${envDev} ${npmRun} webpack-dev-server -- ${webpackConfig} ${webpackCommonParameters}
                                                        ${webpackDevParameters}
                                                        ${webpackDevServerCommonParameters}
                                                        ${webpackDevServerClassicParameters}`,
        dsc: `Start ${project} development with watcher (compile, lint, build)`,
    },
    'serve:dev': {
        cmd: `${npmRun} build:dev:fast
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                          ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) after rebuilding`,
    },
    'serve:dev:fast': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                       ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
        dsc: `Start ${project} development release test server (on port ${serverPort}) with an existing build`,
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
              && ${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                          ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) after rebuilding`,
    },
    'serve:prod:fast': {
        cmd: `${npmRun} http-server -- ${distFolder} -p ${serverPort} -i False --silent --cors
                                       ${(ENABLE_SERVER_PROXY) ? '--proxy ' + serverProxy : ''}`,
        dsc: `Start ${project} production release test server (on port ${serverPort}) with an existing build`,
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
