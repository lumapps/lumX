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
        cmd: `${npmRun} lint:src:ts && ${npmRun} lint:src:js && ${npmRun} lint:src:scss`,
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
        dsc: `Build the development bundle of ${project}`,
        cmd: `${npmRun} task -- clean:dist
              && ${envDev} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                ${webpackBuildParameters} ${webpackDevParameters}`,
    },
    'build:prod': {
        dsc: `Build the production bundle of ${project}`,
        cmd: `${npmRun} task -- clean:dist
              && ${envProd} ${npmRun} webpack -- ${webpackConfig} ${webpackCommonParameters}
                                                 ${webpackBuildParameters} ${webpackProdParameters}`,
    },

    'clean:dist': {
        dsc: `Clean the "dist" folder of ${project}`,
        cmd: `${npmRun} rimraf -- ${distFolder}`,
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
        dsc: 'Clean the "docs" folder',
        cmd: `${npmRun} rimraf -- ${docsFolder}/*`,
    },
    'clean:all': {
        dsc: `Clean the whole ${project} project (NPM, docs, test and dist)`,
        cmd: `npm cache clean
              && ${npmRun} rimraf -- node_modules ${docsFolder} ${unitReportFolder} ${e2eReportFolder} ${distFolder}`,
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

    'e2e': {
        dsc: `Run End to End test (Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} webdriver:update -- --standalone
              && ${npmRun} task -- clean:e2e:report
              && ${npmRun} protractor`,
    },
    'e2e:fast': {
        dsc: `Run End to End test (Protractor with Chrome, skip updates) on ${project}`,
        cmd: `${npmRun} task -- clean:e2e:report
              && ${npmRun} protractor`,
    },
    'e2e:debug': {
        dsc: `Run End to End test (Protractor with Chrome) in debug mode on ${project}`,
        cmd: `${npmRun} webdriver:update -- --standalone
              && ${debug} ${npmRun} protractor -- --elementExplorer`,
    },
    'e2e:phantom': {
        dsc: `Run End to End test (Protractor with PhantomJS) on ${project}`,
        cmd: `${npmRun} webdriver:update -- --standalone
              && ${npmRun} task -- clean:e2e:report
              && ${hidden} ${npmRun} protractor;
              ${npmRun} rimraf -- ./phantomjsdriver.log`,
    },
    'e2e:phantom:fast': {
        dsc: `Run End to End test (Protractor with PhantomJS, skip updates) on ${project}`,
        cmd: `${npmRun} task -- clean:e2e:report
              && ${hidden} ${npmRun} protractor;
              ${npmRun} rimraf -- ./phantomjsdriver.log`,
    },
    unit: {
        dsc: `Run unit tests (Karma with PhantomJS) on ${project}`,
        cmd: `${npmRun} task -- clean:unit:report
              && ${envTest} ${npmRun} karma -- start`,
    },
    'unit:debug': {
        dsc: `Run unit tests (Karma with Chrome) on ${project}`,
        cmd: `${npmRun} task -- clean:unit:report
              && ${debug} ${envDev} ${npmRun} karma -- start --no-single-run`,
    },
    'unit:live': {
        dsc: `Run unit tests (Karma with PhantomJS) in watch mode on ${project}`,
        cmd: `${envDev} ${npmRun} karma -- start --auto-watch --no-single-run`,
    },
    'unit:live:debug': {
        dsc: `Run unit tests (Karma with Chrome) in watch mode on ${project}`,
        cmd: `${debug} ${envDev} ${npmRun} karma -- start --auto-watch --no-single-run`,
    },

    tests: {
        dsc: `Run all the tests (Karma and Protractor with PhantomJS) on ${project}`,
        cmd: `${npmRun} task -- unit
              && ${npmRun} task -- e2e`,
    },
    'tests:debug': {
        dsc: `Run all the tests (Karma and Protractor with Chrome) on ${project}`,
        cmd: `${npmRun} task -- unit:debug
              && ${npmRun} task -- e2e:debug`,
    },

    serve: {
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
    'serve:prod': {
        dsc: `Start ${project} production release test`,
        cmd: `${npmRun} http-server -- ${distFolder} -p 8881 -i False --silent -o --cors
                                       --proxy http://localhost:8888`,
    },
});
