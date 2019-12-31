const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// // 引入通用webpack配置文件
const common = require('./webpack.common.js');
const WasmModuleWebpackPlugin = require('wasm-module-webpack-plugin');

module.exports = merge(common, {
    // 使用 source-map
    devtool: 'source-map',
    // 对 webpack-dev-server 进行配置
    devServer: {
        hot: true,
        host: '0.0.0.0',
        port: 3003,
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        proxy: {
            "/upload": {
                target: "http://127.0.0.1:8085/upload",
                pathRewrite: { '^/upload': '' },
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            },
            "/api":{
                target: "http://127.0.0.1:8085/api",
                pathRewrite: { '^/api': '' },
                changeOrigin: true,     // target是域名的话，需要这个参数，
                secure: false,          // 设置支持https协议的代理
            }
        },
        
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                include: [ path.join(__dirname, './gps') ],
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: [ '@babel/plugin-syntax-dynamic-import', WasmModuleWebpackPlugin ]
                  }
                }
              }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new WasmModuleWebpackPlugin.WebpackPlugin(),
    ],
    // 设置出口文件地址与文件名
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    }
});