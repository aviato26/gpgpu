
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
        test: /\.(jpg|jpeg|png|pdf|glb|gltf|bin|fbx|obj)$/,
        loader: "file-loader",
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
    // uncomment host variable to open port to devices on the local network
    //host: '0.0.0.0',
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  }
}
