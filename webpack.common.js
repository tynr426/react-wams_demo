const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry:  "./src/index.tsx",//入口文件
    
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {  //将公共文件夹丶常用文件夹提取成公共变量，减少 ../../  相对路径的写入 ，————这里添加后需同步在tsconfig.json下添加路径，否则ts会报找不到模块
            '@assets': path.resolve(__dirname, "./src/assets"),
            '@common': path.resolve(__dirname, "./src/common"),
            '@components': path.resolve(__dirname, "./src/components"),
            '@utils': path.resolve(__dirname, "./src/utils"),
            '@business': path.resolve(__dirname, "./src/widget/business"),
            '@pageBase': path.resolve(__dirname, "./src/widget/pageBase"),
            '@services': path.resolve(__dirname, "./src/services"),
        }
    },
    // 模块定义
    module: {
        rules: [{
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
                }]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: ['file-loader']
            },
            {
                test: /\.(bmp|gif|jpe?g|png)$/,
                loader: require.resolve('url-loader'),
                options: {
                    limit: 8192,
                    name: 'static/image/[name].[hash:8].[ext]',
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // 配置输出文件名和路径
            template: 'index.html', // 配置文件模板
            minify: { // 压缩 HTML 的配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                removeComments: true,
            },
        })
    ]
}