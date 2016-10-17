// Look in ./config folder for webpack.dev.js
const configPath = './config';

switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        module.exports = require(configPath + '/webpack.prod')({ env: 'production' });
        break;

    case 'test':
    case 'testing':
        module.exports = require(configPath + '/webpack.test')({ env: 'test' });
        break;

    case 'dev':
    case 'development':
    default:
        module.exports = require(configPath + '/webpack.dev')({ env: 'development' });
}
