const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const globSync = require('glob').sync;

module.exports = (env, options) => ({
  entry: ['./src/app.js'],
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '',
  },
  devServer: {
    host: 'localhost',
    port: 8000,
    hot: true,

  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          options.mode !== 'production'
            ? 'style-loader'
            : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[contenthash].[ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash].[ext]',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
    ...globSync('src/**/*.html').map((fileName) => {
      return new HtmlWebpackPlugin({
        template: fileName,
        inject: 'body',
        filename: fileName.replace('src/', ''),
      });
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/static', to: '' },
      ]
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CompressionPlugin({
        test: /\.js$|\.css(\?.*)?$/i,
      }),
      new CssMinimizerPlugin(),
    ],
  },
});
