/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const compilerPkg = require('../packages/raptor-compiler-core/package.json');

module.exports = function (/*env*/) {
    return [{
        entry: path.resolve(__dirname, '../packages/raptor-compiler-core/src/index.js'),
        output: {
            library: 'compiler',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, '../dist/compiler/umd'),
            filename: 'compiler.min.js',
        },
        node: {
            fs: 'empty',
            module: 'empty',
            net: 'empty',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.hrtime': 'performance.now'
            }),
            new StringReplacePlugin(),
        ],
        module: {
            loaders: [{
                test: /index.js$/,
                loader: StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /__VERSION__/ig,
                        replacement: () => compilerPkg.version
                    }]
                })
            }, {
                test: /\.js$/,
                exclude: /(bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['babili', 'flow'],
                    babelrc: false,
                }
            }]
        }
    }]
}
