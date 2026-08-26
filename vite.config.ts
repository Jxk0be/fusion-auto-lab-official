import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/** Serves POST /api/admin during `npm run dev`, mirroring the Netlify function. */
function adminApiDev(): Plugin {
  return {
    name: 'fusion-admin-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/admin', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end()
          return
        }
        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })
        req.on('end', async () => {
          const reply = (status: number, body: unknown) => {
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }
          try {
            const { handleAdmin } = (await server.ssrLoadModule(
              '/server/admin.ts',
            )) as typeof import('./server/admin')
            const result = await handleAdmin(raw ? JSON.parse(raw) : {})
            reply(result.status, result.body)
          } catch (error) {
            server.config.logger.error(`[admin] ${String(error)}`)
            reply(500, { ok: false, error: 'Something went wrong saving that.' })
          }
        })
      })
    },
  }
}

/**
 * The absolute URL this build will be served from.
 *
 * Social crawlers (Discord, Facebook, iMessage) do not run JavaScript and will
 * not resolve a relative og:image, so index.html has to carry a real absolute
 * URL. Hardcoding the custom domain breaks the moment the site is reachable
 * anywhere else — which is exactly what happens before DNS is pointed.
 *
 * Netlify sets `URL` to the site's primary address at build time, so this
 * follows the deploy: the netlify.app address today, and the custom domain
 * automatically once it is attached. SITE_URL overrides it if ever needed.
 */
const resolveSiteUrl = () =>
  (process.env.SITE_URL || process.env.URL || 'https://fusionautolab.com').replace(/\/+$/, '')

/** Swaps the %SITE_URL% token in index.html for the real address. */
function siteUrlTags(siteUrl: string): Plugin {
  return {
    name: 'fusion-site-url',
    transformIndexHtml: (html) => html.split('%SITE_URL%').join(siteUrl),
  }
}

/**
 * Serves POST /api/contact during `npm run dev`.
 *
 * In production that route is a Netlify Function
 * (netlify/functions/contact.mts). Vite doesn't run those, so without this the
 * form could only be tested after deploying. Both call the same
 * `server/contact.ts`.
 */
function contactApiDev(): Plugin {
  return {
    name: 'fusion-contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end()
          return
        }

        // Photo attachments make these payloads big. The ceiling matches the
        // 6 MB body limit a Netlify synchronous function enforces in
        // production, so anything that works here works there.
        const MAX_BODY = 6 * 1024 * 1024
        let raw = ''
        let tooBig = false
        req.on('data', (chunk) => {
          if (tooBig) return
          raw += chunk
          if (raw.length > MAX_BODY) {
            tooBig = true
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'Those photos are too large.' }))
          }
        })

        req.on('end', async () => {
          if (tooBig) return
          const reply = (status: number, body: unknown) => {
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }

          try {
            // Loaded through Vite so edits to server/contact.ts take effect
            // without restarting the dev server.
            const { handleContact } = (await server.ssrLoadModule(
              '/server/contact.ts',
            )) as typeof import('./server/contact')

            const result = await handleContact(raw ? JSON.parse(raw) : {})
            reply(result.status, result.body)
          } catch (error) {
            server.config.logger.error(`[contact form] ${String(error)}`)
            reply(500, { ok: false, error: 'Could not send that message.' })
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars to the client. The SMTP credentials
  // are server-side, so load the whole .env into process.env for the dev
  // middleware above. On Netlify these come from the site's env settings.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  // Exposed to the client too, so the canonical and og:url that useSeo rewrites
  // on navigation agree with what is baked into index.html.
  const siteUrl = resolveSiteUrl()
  process.env.VITE_SITE_URL = siteUrl

  return {
    plugins: [vue(), tailwindcss(), siteUrlTags(siteUrl), contactApiDev(), adminApiDev()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
