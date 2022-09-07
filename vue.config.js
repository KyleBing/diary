const FileManagerPlugin = require('filemanager-webpack-plugin')
const Moment = require('moment')

module.exports = {
  publicPath: './',
  productionSourceMap: false, // 不产出 .map 文件

  outputDir: '../diary',
  devServer: {
    proxy: {
      '': {
        // target: 'http://localhost:3000',
        // target: 'http://localhost/diary-portal/',
        target: 'http://kylebing.cn:3000',
        changeOrigin: true
      },
    }
  },

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production'){
      let packTimeString = new Moment().format('YYYY-MM-DD') // 打包时间
      let plugins = []
      plugins.push(
          new FileManagerPlugin({
            events: {
              onEnd: {
                mkdir: ['./archive'], // 新建 ./archive 目录
                archive: [
                  // 打包 压缩包中不带 dist 外壳
                  {
                    source: '../diary',
                    destination: `./archive/diary-${packTimeString}.zip`,
                    format: 'zip',
                    options: {
                      gzipOptions: {
                        level: 1,
                      },
                    }
                  },
                ]
              }
            }
          })
      )
      config.plugins = config.plugins.concat(plugins) // 将新建的 plugin 添加到原 config 中的 plugin 中
    }
  },

  /**
   * PWA 设置
   */
  pwa: {
    name: '日记', // 名字
    themeColor: "#373737", // 背景颜色
    appleMobileWebAppCapable: true, // 苹果WebApp支持

    // manifest 设置
    manifestOptions: {
      name: '标题日记',
      short_name: "日记",
      theme_color: "#373737",
      start_url: ".",
      display: "standalone",
      background_color: "#000000"
    },

    // 图标
    iconPaths: {
      faviconSVG: 'src/assets/img/logo.svg',
      favicon32: 'src/assets/img/favicon.png',
      favicon16: 'src/assets/img/favicon.png',
      appleTouchIcon: 'src/assets/img/appicon-apple.png',
      maskIcon: '',
      msTileImage: ''
    }
  }
}
