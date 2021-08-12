
const HtmlWebpackPlugin = require('html-webpack-plugin');
//import img from './file.png';
const path = require('path');

module.exports =
{
  mode: 'development',
  entry: './src/index.js',

  output:
  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },

  module:
  {
    rules:
    [
      {
        test: /\.js?$/,
        include:
        [
          path.resolve(__dirname, 'src')
        ]
      },

      {
        test: /\.png?$/,
        loader: "file-loader"
      }
    ]
  },

  plugins: [new HtmlWebpackPlugin()],

  devServer:
  {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  }
}
