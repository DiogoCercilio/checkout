'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let plugins = [
    new ExtractTextPlugin({
        filename: '[name].bundle.css'
    })
];

module.exports = {
    entry: {
        './dist/javascripts/app': './src/javascripts/app.js',
        './dist/stylesheets/app': './src/stylesheets/app.scss',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [{
                test: /\.js$/,
                include: /src\/_v2/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'static/images/[name].[ext]',
                        outputPath: '/dist'
                    }
                }, ]
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins
};