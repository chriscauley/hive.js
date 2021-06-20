const path = require('path')

const devServer = {
  host: 'vue-hive.localhost',
  port: 8283,
  proxy: 'http://hive.localhost:8239/',
  historyApiFallback: true,
}

module.exports = {
  lintOnSave: false,
  publicPath: '/static/',
  devServer,
  configureWebpack: {
    resolve: {
      alias: {
        'hive.js': path.resolve(__dirname, '../game'),
      },
    },
  },
}
