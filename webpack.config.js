/* eslint-disable */

const TerserWebpackPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const VueLoaderPlugin = require("vue-loader/lib/plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
//const CompressionPlugin = require("compression-webpack-plugin");
//.BundleAnalyzerPlugin;
const webpack = require("webpack");
const path = require("path");
const mode = process.env.NODE_ENV;
console.log(mode);

module.exports = {
  mode,
  performance: {
    hints: false,
  },
  output: {
    path: path.join(__dirname, "public/assets"),
  },
  entry: ["./resources/app.scss", "./resources/App.tsx"],
  devtool: "",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //new BundleAnalyzerPlugin(),

    //new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  optimization: {
    minimize: true,
    usedExports: true,
    minimizer: [new TerserWebpackPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.webpack.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.join(__dirname, "/dist/css/"),
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
};
