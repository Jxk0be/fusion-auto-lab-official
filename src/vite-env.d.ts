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
interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
