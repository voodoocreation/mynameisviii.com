const fs = require("fs");
const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ServiceWorkerPlugin = require("serviceworker-webpack-plugin");
const withTypescript = require("@zeit/next-typescript");
const PluginLodashModuleReplacement = require("lodash-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const getFiles = (dir, files = []) => {
  const list = fs.readdirSync(dir);

  return list.reduce((acc, curr) => {
    const name = `${dir}/${curr}`;

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      acc.push(name.replace(__dirname, "").replace(/\\/g, "/"));
    }

    return acc;
  }, files);
};

const configCSSLoaders = env => {
  let cssLoader = { loader: "css-loader" };
  const postcssLoader = { loader: "postcss-loader" };
  const sassLoader = {
    loader: "sass-loader",
    options: {
      includePaths: ["src/scss", "node_modules"]
        .map(d => path.join(__dirname, d))
        .map(g => glob.sync(g))
        .reduce((acc, cur) => acc.concat(cur), [])
    }
  };

  const mediaQueryLoader = {
    loader: "group-css-media-queries-loader",
    options: {
      sourceMap: false
    }
  };

  if (env === "production") {
    cssLoader = {
      loader: "css-loader",
      options: {
        minimize: true
      }
    };
  }

  return [cssLoader, mediaQueryLoader, postcssLoader, sassLoader];
};

module.exports = withTypescript({
  distDir: "dist",
  poweredByHeader: false,
  webpack: (config, { buildId, dev }) => {
    config.module.rules.push(
      {
        test: /\.css$/,
        use: ["babel-loader", "raw-loader", "postcss-loader"]
      },
      {
        test: /\.(svg)$/,
        use: "svg-loader"
      },
      {
        test: /\.(jpg|jpeg|png)$/,
        use: "file-loader"
      }
    );

    config.plugins.push(
      new PluginLodashModuleReplacement(),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new ServiceWorkerPlugin({
        entry: path.join(__dirname, "src/services/appService.ts"),
        filename: "appService.js",
        transformOptions: swOptions => ({
          ...swOptions,
          assets: swOptions.assets
            .map(asset => `/_next${asset.replace(/\\/g, "/")}`)
            .filter(asset => asset.startsWith("/_next/static/")),
          staticFiles: [
            "/assets/main.css",
            ...getFiles(path.join(__dirname, "static"))
          ],
          buildId
        })
      })
    );

    if (!dev) {
      config.module.rules.push({
        test: /\.s(a|c)ss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: configCSSLoaders(process.env.NODE_ENV)
        })
      });

      config.plugins.push(
        new ExtractTextPlugin({
          filename: "/assets/main.css",
          allChunks: true
        }),

        new OptimizeCSSAssetsPlugin({})
      );
    } else {
      config.module.rules.push({
        test: /\.s(a|c)ss$/,
        use: [
          "babel-loader",
          "raw-loader",
          {
            loader: "group-css-media-queries-loader",
            options: { sourceMap: false }
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              includePaths: ["src/scss", "node_modules"]
                .map(d => path.join(__dirname, d))
                .map(g => glob.sync(g))
                .reduce((acc, cur) => acc.concat(cur), [])
            }
          }
        ]
      });
    }

    return config;
  }
});
