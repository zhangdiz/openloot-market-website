import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 监听所有的网络地址
    port: 12002, // 你可以自定义端口
    open: false, // 启动时自动打开浏览器
    hmr: false,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // 将 @ 映射到 src 目录
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 可以在这里自定义 Less 配置，比如全局变量、mixins 等
        modifyVars: {},
        javascriptEnabled: true, // 启用 JavaScript 使得 LESS 可以调用 JS 函数
      },
    },
  },
});
