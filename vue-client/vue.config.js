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
}
