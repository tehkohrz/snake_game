// // webpack.config.js
// const path = require('path');

// module.exports = {
//   mode: 'production',
//   entry: './src/index.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   // loaders
//   module: {
//     rules: [{
//       // this is regex, it tells webpack to look for files that end with .css
//       test: /\.css$/,
//       // the sequence here matters! style-loader needs to come before css-loader
//       // because webpack reads these things from right to left
//       use: [
//         'style-loader', // step 2: injects Javascript into the DOM
//         'css-loader', // step 1: turns css into valid Javascript
//         'sass-loader',
//       ],
//     },
//     {
//       test: /\.js$/, // this is regex, it tells webpack to look for all files which end in .js
//       exclude: /node_modules/,
//       use: {
//         // this will automatically reference a .babelrc file
//         loader: 'babel-loader',
//       },
//     },
//     ],
//   },
// };

const HtmlWebpackPlugin = require('html-webpack-plugin'); // This is for the changing webpacked version, generate a new index.html file to link with the new index.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    filename: 'main-[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
