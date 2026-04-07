import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import fs from 'fs'

function copyPreloadPlugin() {
  return {
    name: 'copy-preload',
    buildStart() {
      if (!fs.existsSync('dist-electron')) {
        fs.mkdirSync('dist-electron', { recursive: true });
      }
      fs.copyFileSync('electron/preload.cjs', 'dist-electron/preload.cjs');
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.js',
      }
    ]),
    renderer(),
    copyPreloadPlugin()
  ],
})
