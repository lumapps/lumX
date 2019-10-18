/* eslint-disable global-require, import/no-commonjs, import/unambiguous, import/no-extraneous-dependencies */
module.exports = {
    plugins: [
        require('postcss-flexbox-unboxer')(),
        require('autoprefixer')({
            grid: true,
        }),
    ],
};
