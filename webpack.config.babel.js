const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

const entrypoints = {
  index: path.resolve('source/index'),
};

const optimization = {
  minimize: true,
};

const stats = {
  assets: false,
  cached: false,
  cachedAssets: false,
  children: false,
  chunks: false,
  chunkModules: false,
  chunkOrigins: false,
  colors: true,
  errors: true,
  errorDetails: true,
  source: true,
  timings: true,
  warnings: true,
};

const modules = {
  rules: [
    {
      test: /\.ts?$/,
      use: ['ts-loader'],
      exclude: [/node_modules/],
    },
    {
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
      use: ['raw-loader'],
    },
    {
      test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag',
            attributes: {
              'data-cke': true,
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: styles.getPostCssConfig({
            themeImporter: {
              themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
            },
            minify: true,
          }),
        },
      ],
    },
  ],
};

module.exports = {
  entry: entrypoints,
  mode: 'production',
  optimization: optimization,
  stats: stats,
  module: modules,
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve('source'), path.resolve('node_modules')],
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
  },
};
