const HTMLWeebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['css-loader', 'sass-loader']
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HTMLWeebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};