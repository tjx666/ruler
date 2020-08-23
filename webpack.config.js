const { resolve } = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PROJECT_ROOT = resolve(__dirname);
const isProd = process.env.NODE_ENV === 'production';

/**@type {import('webpack').Configuration}*/
const config = {
    entry: {
        extension: resolve(PROJECT_ROOT, './src/extension.js'),
        background: resolve(PROJECT_ROOT, './src/background.js')
    },

    output: {
        path: resolve(__dirname, './extension'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue: `vue/dist/${isProd ? 'vue.runtime.esm' : 'vue.runtime.min'}.js`
        }
    },

    stats: isProd ? 'normal' : 'minimal',

    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new WebpackBar({
            name: 'Extension',
            color: '#0f9d58'
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(PROJECT_ROOT, 'public')
                },
                {
                    from: resolve(PROJECT_ROOT, `src/manifest.${isProd ? 'prod' : 'dev'}.json`),
                    to: 'manifest.json'
                }
            ]
        })
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            }
        ]
    }
};

if (isProd) {
    config.mode = 'production';
    config.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    };
} else {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
}

module.exports = config;
