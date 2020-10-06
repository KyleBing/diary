module.exports = {
  publicPath: './',

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost/diary/portal',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
}