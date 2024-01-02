import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from "vite-svg-loader"
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        svgLoader()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        host: '0.0.0.0',// 自定义主机名
        port: 8080,// 自定义端口
        https: false,
        proxy: {
            '/dev': {
                target: 'http://localhost:3000',
                // target: 'http://kylebing.cn:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dev/, '/'),
            },
        }
    }
})
