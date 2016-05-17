/**
 * Created by freddyrondon on 4/22/16.
 */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: [
        './src/js/App.js'
    ],
    output: {
        path: __dirname + '/deploy',
        filename: './bundle.js'
    },
    module: {
        loaders: [
            {
                // Skip any files outside of your project's `src` directory
                include: [
                    path.resolve(__dirname, "src")
                ],
                test: /\.jsx?$/,
                loader: "babel?cacheDirectory"
            },
            {
                include: [
                    path.resolve(__dirname, "src/css")
                ],
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                include: [
                    path.resolve(__dirname, "src/fonts")
                ],
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                include: [
                    path.resolve(__dirname, "src/fonts")
                ],
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                include: [
                    path.resolve(__dirname, "src/images")
                ],
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};