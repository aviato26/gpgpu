
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        test: /\.(jpg|png|pdf|glb)$/,
        loader: "file-loader"
      },

      {
        test: /\.css$/i,
        use: ["style-loader","css-loader"],
        include:
        [
          path.resolve(__dirname, 'src')
        ]
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
