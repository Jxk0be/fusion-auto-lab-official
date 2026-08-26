/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * The contact form's SMTP settings are read server-side in server/contact.ts,
 * not here — Vite only exposes VITE_-prefixed variables to the browser, and
 * mail credentials must never reach it.
 */
interface ImportMetaEnv {
  /**
   * Absolute origin this build is served from, injected by vite.config.ts.
   * Follows Netlify's `URL` at build time; falls back to the custom domain.
   */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
