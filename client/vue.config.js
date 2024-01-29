const path = require('path')

const { VUE_APP_OFFLINE } = process.env
const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Vue CLI is in maintenance mode, and probably won't merge my PR to fix this in their tooling
        // https://github.com/vuejs/vue-cli/pull/7443
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
    resolve: {
      alias: {
        'hive.js': path.resolve(__dirname, '../game'),
      },
    },
  },
}

if (VUE_APP_OFFLINE) {
  module.exports.devServer = {
    host: 'vue-hive.localhost',
    port: 8283,
    historyApiFallback: true,
  }
  module.exports.publicPath = '/hive.js/'
} else {
  module.exports.publicPath = '/static/'
}
