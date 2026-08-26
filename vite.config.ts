import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

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

  return {
    plugins: [vue(), tailwindcss(), contactApiDev()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
