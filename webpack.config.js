const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
        patterns: [
            { from: 'src/models', to:'models' }
        ]
    })
  ],
  devServer: {
    //serve index.html as base
    contentBase: path.resolve(__dirname, 'dist'),
    // enable compression
    compress: true,
    // enable hot loading
    hot: true,

    port:9494,
    publicPath: '/' 

  }
};