
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const package = require('../package.json');

module.exports = merge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
      rules: [
          {
              test: /\.css$/,
              use: [ 'style-loader','css-loader','postcss-loader']
          },
          {
              test: /\.less$/,
              use: [ 'style-loader','css-loader' ,'postcss-loader', 'less-loader']
          },
          {
              test: /\.scss$/,
              use: [ 'style-loader','css-loader' ,'postcss-loader', 'sass-loader']
          }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: 'chinaoly v' + package.version,
            filename: '../index.html',
            inject: false
        })
    ],
    devServer: {
        port: 8089,
        host:'0.0.0.0',
        historyApiFallback: true,
        hot: true,
        inline: true,
        open: true,
        stats: { colors: true },
        proxy: {
            //匹配代理的url
            '/api/v1': {
                target: 'http://192.168.0.71:7081',// 'http://192.168.0.71:7081',
                //路径重写
                pathRewrite: { '^/api/v1': '/' },
                changeOrigin: true
            },
            '/api/v2': {
                target: 'http://192.168.1.152:7089',//'http://192.168.1.152:7089',
                //路径重写
                pathRewrite: { '^/api/v2': '/' },
                changeOrigin: true
            },
            '/api/v3': {
                target: 'http://192.168.0.71:7080',//'http://192.168.0.71:7080',
                pathRewrite: { '^/api/v3': '/' },
                changeOrigin: true
            },
        }
    }
});
