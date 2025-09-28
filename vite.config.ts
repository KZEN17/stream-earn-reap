import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192x192.png', 'icon-512x512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'CLIP - From Twitch to Rich',
        short_name: 'CLIP',
        description: 'Turn entertainment into finance. Connect streamers, clippers, and agencies. Earn from viral clips, grow through RAIDCHAT, and scale with pump.fun launches.',
        theme_color: '#8b5cf6',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ].filter(Boolean),
  build: {
    commonjsOptions: {
      include: [/bs58/, /bn\.js/, /js-sha3/, /hash\.js/, /bech32/, /fetch-retry/, /eventemitter3/, /canonicalize/, /@coinbase\/wallet-sdk/, /shallowequal/, /node_modules/]
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about pure annotations from third-party libraries
        if (warning.code === 'PURE_ANNOTATION_WARNING' || 
            (warning.message && warning.message.includes('contains an annotation that Rollup cannot interpret'))) {
          return;
        }
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    exclude: [],
    include: [
      'bs58', 'bn.js', 'js-sha3', 'hash.js', 'bech32', 'fetch-retry', 
      'eventemitter3', 'canonicalize', '@coinbase/wallet-sdk', 'shallowequal', 
      'react-dom', 'use-sync-external-store', 'use-sync-external-store/with-selector', 
      '@headlessui/react', '@walletconnect/time', '@walletconnect/relay-auth', 
      '@walletconnect/window-getters', '@walletconnect/utils', 'events', 
      'pino', '@walletconnect/logger', '@walletconnect/environment',
      '@walletconnect/jsonrpc-utils', '@walletconnect/jsonrpc-ws-connection',
      '@walletconnect/jsonrpc-types', '@walletconnect/safe-json', 'cross-fetch',
      '@walletconnect/jsonrpc-http-connection', 'qrcode', 'ua-parser-js'
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
}));