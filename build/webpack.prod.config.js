const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const package = require('../package.json');

module.exports = merge(webpackBaseConfig, {
    mode: 'production',
    // devtool: 'cheap-module-source-map',
    output: {
        publicPath: 'dist/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    optimization: {
      splitChunks: {
          cacheGroups: {
            vendorUI: {
              chunks: 'all',
              name: 'chunk-ui', // 单独将 iview element-ui 拆包
              priority: 20, // 权重需大于其它缓存组
              test:  /[\\/]node_modules[\\/](iview|element-ui)[\\/]/
            },
            vendor: {
              chunks: 'initial',
              name: 'vendor',
              priority: 10,
              test: /[\\/]node_modules[\\/]/,
              enforce: true
            }
          }
      }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  { loader: 'css-loader' }
                ]
            },
            {
                test: /\.less$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  { loader: 'css-loader' },
                  { loader: 'less-loader' }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                  MiniCssExtractPlugin.loader,
                  { loader: 'css-loader' },
                  { loader: 'sass-loader' }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new MiniCssExtractPlugin({
          filename: "[name].[hash].css",
          chunkFilename: "[id].css"
        }),
        new ParallelUglifyPlugin({
          cacheDir: '.cache/',
          uglifyJS:{
            output: {
              comments: false
            },
            compress: {
              warnings: false
            }
          }
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../static'),
            to: '../static',
            ignore: ['.*']
          }
        ]),
        new HtmlWebpackPlugin({
            title: '多警种协同作战研判工作台',
            filename: '../index.html',
            // favicon:'../favicon.ico',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: true,
            minify: false
        })
    ]
});
