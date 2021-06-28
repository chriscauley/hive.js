const path = require('path')

const { VUE_APP_OFFLINE } = process.env

module.exports = {
  lintOnSave: false,
  configureWebpack: {
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
} else {
  module.exports.publicPath = '/static/'
}
