// @ts-ignore
import { buildPlugin, devPlugin,getReplacer } from './plugins/index'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import optimizer from "vite-plugin-optimizer";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()),vue(),devPlugin()],
  build:{
    rollupOptions: {
      plugins: [buildPlugin()],
    },
  }
})
