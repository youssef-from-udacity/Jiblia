import path from "path";

const webpackConfig = {
  entry: {
    App: "./app/assets/scripts/App.js",
    Vendor: "./app/assets/scripts/Vendor.js"
  },
  output: {
    path: path.resolve(__dirname, "./app/temp/scripts"),
    filename: "[name].js"
  },
  resolve: {
    alias: {
        jquery: "jquery/src/jquery"
    }
},
  devtool : 'cheap-module-source-map & cheap-module-inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  mode: 'development'
};
export default webpackConfig;