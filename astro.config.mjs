import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import simpleScope from "vite-plugin-simple-scope";
import sentry from "@sentry/astro";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.aphb.kz/",
  output: "hybrid",
  vite: {
    plugins: [simpleScope()]
  },
  i18n: {
    defaultLocale: "ru",
    locales: ["en", "ru", "kz"],
    fallback: {
      en: "ru",
      kz: "ru"
    }
  },
  integrations: [simpleStackForm(), tailwind(), react(), sentry({
    dsn: "https://edecbdb6342aef6e9e00142c9cf27d43@o4506783322669056.ingest.sentry.io/4506783324700672",
    sourceMapsUploadOptions: {
      project: "javascript-astro",
      authToken: process.env.SENTRY_AUTH_TOKEN
    }
  }), sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    },
    functionPerRoute: false,
    edgeMiddleware: false
  })
});