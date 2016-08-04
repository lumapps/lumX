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

const unitestFolder = `${testsFolder}/unit`;
const unitestReportFolder = `${unitestFolder}/report`;
const e2eFolder = `${testsFolder}/e2e`;
const e2eReportFolder = `${e2eFolder}/report`;

// ---------------------------------------------------------------------------------------------------------------------
// You can define here commands, arguments or fragment to re-use in tasks
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
// Toggle the "-s" flag to make npm verbose (nothing) or silent (-s)
const npmRun = `npm run -s`;

const webpackBuildParameters = `--profile --display-cached --hide-modules`;
const webpackDevServerParameters = `--watch --content-base ${sourceFolder}`;
const webpackDevServerHotReloadParameters = `--inline --hot`;
const webpackCommonParameters = `--progress --colors --display-error-details`;
const webpackDevConfig = `--config config/webpack.dev.js`;
const webpackProdConfig = `--config config/webpack.prod.js --bail`;

// ---------------------------------------------------------------------------------------------------------------------
// Define your tasks here
// Attention: Use the bash syntax for variable templating
// ---------------------------------------------------------------------------------------------------------------------
shelter({
    lint: {
        dsc: `Lint TypeScript code of ${project}`,
        cmd: `${npmRun} tsconfig-lint -- --passive`,
    },

    'build:dev': {
        dsc: `Build the development bundle of ${project}`,
        cmd: `${npmRun} task -- clean:dist && ${npmRun} webpack -- ${webpackDevConfig} ${webpackCommonParameters}
                                                                   ${webpackBuildParameters}`,
    },
    'build:prod': {
        dsc: `Build the production bundle of ${project}`,
        cmd: `${npmRun} task -- clean:dist && ${npmRun} webpack -- ${webpackProdConfig} ${webpackCommonParameters}
                                                                   ${webpackBuildParameters}`,
    },

    'clean:dist': {
        dsc: `Clean the "dist" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${distFolder}`,
    },
    'clean:unit:report': {
        dsc: `Clean the "unit/report" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${unitestReportFolder}/*`,
    },
    'clean:e2e:report': {
        dsc: `Clean the "e2e/report" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${e2eReportFolder}/*`,
    },
    'clean:docs': {
        dsc: 'Clean the "docs" folder',
        cmd: `${npmRun} rimraf -- ${docsFolder}/*`,
    },
    'clean:all': {
        dsc: `Clean the whole ${project} project (NPM, docs, test and dist)`,
        cmd: `npm cache clean && ${npmRun} rimraf -- node_modules ${docsFolder} ${unitestReportFolder} ${e2eReportFolder}
                                                     ${distFolder}`,
    },

    docs: {
        dsc: `Generate the TypeScript documentation for ${project}`,
        cmd: `${npmRun} typedoc -- --options typedoc.json --exclude '**/*.(spec|specs|e2e).ts' --out ${docsFolder}
                                   --name ${project} ${appFolder}`,
    },

    lang: {
        dsc: ``,
        cmd: ``,
    },

    e2e: {
        dsc: `Run End to End test (Protractor with PhantomJS) on ${project}`,
        cmd: `${npmRun} webdriver:update -- --standalone && ${npmRun} task -- clean:e2e:report
              && ${npmRun} protractor; ${npmRun} rimraf ./phantomjsdriver.log`,
    },
    'e2e:fast': {
        dsc: `Run End to End test (Protractor with PhantomJS, skip updates) on ${project}`,
        cmd: `${npmRun} task -- clean:e2e:report && ${npmRun} protractor; ${npmRun} rimraf ./phantomjsdriver.log`,
    },
    'e2e:debug': {
        dsc: `Run End to End test (Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} webdriver:update -- --standalone && ${npmRun} task -- clean:e2e:report
              && DEBUG=true ${npmRun} protractor; ${npmRun} rimraf ./phantomjsdriver.log`,
    },
    unitest: {
        dsc: `Run unit tests (Karma with PhantomJS) on ${project}`,
        cmd: `${npmRun} task -- clean:unit:report && ${npmRun} karma -- start && ${npmRun} task -- coverage`,
    },
    'unitest:debug': {
        dsc: `Run unit tests (Karma with Chrome) on ${project}`,
        cmd: `${npmRun} task -- clean:unit:report && DEBUG=true ${npmRun} karma -- start --no-single-run &&
              ${npmRun} task -- coverage`,
    },
    'unitest:live': {
        dsc: `Run unit tests (Karma with PhantomJS) in watch mode on ${project}`,
        cmd: `${npmRun} karma -- start --auto-watch --no-single-run`,
    },
    'unitest:live:debug': {
        dsc: `Run unit tests (Karma with Chrome) in watch mode on ${project}`,
        cmd: `DEBUG=true ${npmRun} karma -- start --auto-watch --no-single-run`,
    },
    coverage: {
        dsc: `Run the tests coverage for ${project}`,
        cmd: `${npmRun} remap-istanbul -- -i ${unitestReportFolder}/coverage.json
                                          -o ${unitestReportFolder}/coverage.json -t json
                                          -e node_modules,karma.entry.ts
              && ${npmRun} istanbul -- report`,
    },
    tests: {
        dsc: `Run all the tests (Karma and Protractor with PhantomJS) on ${project}`,
        cmd: `${npmRun} task -- unitest && ${npmRun} task -- e2e`,
    },
    'tests:debug': {
        dsc: `Run all the tests (Karma and Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} task -- unitest:debug && ${npmRun} task -- e2e:debug`,
    },

    serve: {
        dsc: `Start ${project} development with watcher (compile, lint, build)`,
        cmd: `${npmRun} webpack-dev-server -- ${webpackDevConfig} ${webpackCommonParameters} ${webpackCommonParameters}
                                              ${webpackDevServerParameters}`,
    },
    'serve:live': {
        dsc: `Start ${project} development with watcher (compile, lint, build) and hot reload`,
        cmd: `${npmRun} webpack-dev-server -- ${webpackDevConfig} ${webpackCommonParameters}
                                              ${webpackDevServerParameters} ${webpackDevServerHotReloadParameters}`,
    },
    'serve:prod': {
        dsc: `Start ${project} production release test`,
        cmd: `${npmRun} http-server -- ${distFolder} -p 8881 -i False --silent -o --proxy http://localhost:8888
                                       --cors`,
    },
});
