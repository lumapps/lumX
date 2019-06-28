/* eslint-disable global-require, import/no-commonjs, import/unambiguous */
module.exports = {
    plugins: [
        require('postcss-flexbox-unboxer')(),
        require('autoprefixer')({
            grid: true,
        }),
    ],
};
