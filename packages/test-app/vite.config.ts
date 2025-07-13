import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/test-app/',
  plugins: [react()],
  server: {  
    port: 3000,// 開発サーバーのポートを指定
    strictPort: true, // 起動時にportが空いていないときに終了する。
    hmr: {//ホットリロード用設定
      host: "localhost",
      port: 3000, 
      protocol: "ws",
    },
  },
})
