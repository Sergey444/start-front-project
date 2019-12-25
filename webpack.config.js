const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
   return  {
    devtool: argv.mode === 'development' ? "source-map" : false,
    entry: {
        main: "./src/index"
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "./js/bundle.js"
    },
    module: {
        rules: [
        {
            test: /\.pug$/,
            use: [ "html-loader", "pug-html-loader"]
        },
        {
            test: /\.scss$/,
            use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: argv.mode === 'development',
                    reloadAll: true,
                }
            },
            'css-loader', 
            {
                loader: 'postcss-loader',
                options: { sourceMap: true, config: { path: './postcss.config.js' } }
            }, 
            'sass-loader'
            ],
        }
        ]
    },

    plugins: [

        new CopyPlugin([
            { from: 'public', to: './' }
        ]),

        new MiniCssExtractPlugin({
            filename: "./css/style.css"
        }),

        new HtmlWebpackPlugin({
            template: "./src/pug/pages/index.pug",
            filename: "./index.html",
            inject: argv.mode === 'development',
        }),

        new HtmlBeautifyPlugin({
                config: {
                    html: {
                        end_with_newline: true,
                        indent_size: 4,
                        indent_with_tabs: false,
                        indent_inner_html: true,
                        preserve_newlines: true,
                        // unformatted: ['p', 'i', 'b', 'span']
                    }
                },
                replace: [ 'type="text/javascript"' ]
            }), 
        ],

        devServer: {
            contentBase: path.join(__dirname, 'public'),
            compress: true,
            hot: true,
            clientLogLevel: 'silent',
            port: 8080
        }
    }
};