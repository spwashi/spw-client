const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputDirectory = 'dist';

module.exports =
    {
        entry:
            {
                app:
                    [
                        'babel-polyfill',
                        './client/index.js'
                    ],
            },

        output:
            {
                path:     path.join(__dirname, outputDirectory),
                filename: '[name].bundle.js?v=[hash]'
            },

        optimization: { splitChunks: { chunks: 'all', }, },

        module:
            {
                rules:
                    [
                        {
                            test:    /\.(js|jsx)$/,
                            exclude: /node_modules/,
                            use:     { loader: 'babel-loader' }
                        },
                        {
                            test: /\.css$/,
                            use:  ['style-loader', 'css-loader']
                        },
                        {
                            test: /\.s[ac]ss$/i,
                            use:  ['style-loader', 'css-loader', 'sass-loader'],
                        },
                        {
                            test:   /\.(png|woff|woff2|eot|ttf|svg)$/,
                            loader: 'url-loader?limit=100000'
                        }
                    ]
            },

        resolve:
            {
                extensions: ['*', '.js', '.jsx'],
                alias:      { react: path.resolve('./node_modules/react') },
            },

        devServer:
            {
                port:               3000,
                open:               true,
                proxy:              { '/api': 'http://localhost:8080' },
                historyApiFallback: true
            },

        plugins:
            [
                new HtmlWebpackPlugin({ template: './public/index.html' })
            ]
    };
