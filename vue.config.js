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

  // 打包程序
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
    appleMobileWebAppCapable: true, // 苹果 WebApp 支持

    // manifest 设置
    manifestOptions: {
      name: '标题日记',
      short_name: "日记",
      theme_color: "#373737",
      start_url: "./index.html",
      display: "standalone",
      background_color: "#373737",
      icons: [
        {
          src: "logo.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "appicon-apple.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },

    // 图标
    iconPaths: {
      // 这里是项目外的路径，对应 public 目录
      faviconSVG: 'logo.svg',
      favicon32: 'favicon.png',
      favicon16: 'favicon.png',
      appleTouchIcon: 'appicon-apple.png',
      maskIcon: null,
      msTileImage: null
    }
  }
}
