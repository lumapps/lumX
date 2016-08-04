// Look in ./config folder for webpack.dev.js
const path = './config';

switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        module.exports = require(path + '/webpack.prod');
        break;

    case 'test':
    case 'testing':
        module.exports = require(path + '/webpack.test');
        break;

    case 'dev':
    case 'development':
    default:
        module.exports = require(path + '/webpack.dev');
}
