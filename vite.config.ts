import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from "vite-svg-loader"
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import zipPack from "vite-plugin-zip-pack" // make dist.zip file
import {dateFormatter} from "./src/utility";

const timeStringNow = dateFormatter(new Date(), 'yyyy-MM-dd hh-mm-ss')



// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',// 自定义主机名
        port: 8080,// 自定义端口
        https: false,
        proxy: {
            '/dev': {
                // target: 'http://localhost:3000',
                target: 'http://kylebing.cn:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dev/, '/'),
            },
        }
    },
    base: './',
    plugins: [
        vue(),
        svgLoader(),
        VitePWA({
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true // 是否在开发模式下也启用 pwa 配置
            },

            // MANIFEST PWA https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
            includeAssets: ['logo.svg', 'apple-touch-icon.png', 'mask-icon.svg', 'favicon.png'],
            manifest: {
                name: '标题日记',
                short_name: "日记",
                theme_color: "#373737",
                start_url: "./",
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
        }),
        zipPack({
            inDir: 'dist',
            outDir: 'archive',
            outFileName: `diary-${timeStringNow}.zip`,
            pathPrefix: ''
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },

})
