const path = require('path');
const merge = require('webpack-merge');
// 引入通用webpack配置文件
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// 对js代码进行混淆压缩的插件
const uglifyJSPlugin = new UglifyJSPlugin();

module.exports = merge(common, {
    mode: "production",
    // devtool: 'cheap-module-source-map',
    plugins: [
        uglifyJSPlugin,
    ],
    // 设置出口文件地址与文件名
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.min.js'
    },
});