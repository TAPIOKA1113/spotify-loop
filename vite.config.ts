import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['assets/favicon.ico'],
    manifest: {
      name: 'Spotify LOOP',
      short_name: 'Spotify LOOP',
      description: 'Spotify LOOP',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'assets/192_sample_img.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'assets/512_sample_img.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })
  ]
});
