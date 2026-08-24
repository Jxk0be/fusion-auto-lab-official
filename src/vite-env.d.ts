/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** LeadLine site key for this tenant. Printed by `pnpm seed:fusion`. */
  readonly VITE_LEADLINE_SITE_KEY?: string
  /** LeadLine API origin, e.g. https://api.frontedesk.com (no trailing path). */
  readonly VITE_LEADLINE_API?: string
  /** Fallback form service, used only when the two above are unset. */
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
