import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ViteSvgSpriteWrapper({
            /**
             * Input directory
             * @default 'src/assets/images/svg/*.svg'
             */
            icons: 'src/assets/images/icons/weather/*.svg',
            /**
             * Output directory
             * @default 'src/public/images'
             */
            // outputDir? : string

            /**
             * sprite-svg {@link https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md#sprite-svg-options|options}
             */
            // sprite? : SVGSpriter.Config
            /**
             * Defines if a type should be generated
             * @default false
             */
            // generateType? : boolean
            /**
             * Name of the type to be used when generateType is set to true
             * @default 'SvgIcons'
             */
            // typeName? : string
            /**
             * File name of the generated type file
             * @default 'svg-icons'
             */
            // typeFileName? : string
            /**
             * Name of the output directory for generated type file
             * @default '{@link icons} directory'
             */
            // typeOutputDir? : string
        }),
    ],
    server: {
        proxy: {
            '/dev': {
                // target: 'http://localhost:3000',
                target: 'http://kylebing.cn:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dev/, '/'),
            },
        }
    }
})
