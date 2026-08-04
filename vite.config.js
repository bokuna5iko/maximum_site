import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Центр Техники МАКСИМУМ",
        short_name: "МАКСИМУМ",
        description: "Продажа техники, экипировки и авторизованный сервис",
        theme_color: "#0d0d0d",
        background_color: "#0d0d0d",
        display: "standalone",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
});
