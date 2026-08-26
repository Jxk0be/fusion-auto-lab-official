/**
 * POST /api/contact — the live quote-form endpoint.
 *
 * Deployed as a Netlify Function. All the real work lives in
 * `server/contact.ts`; the dev middleware in vite.config.ts calls that same
 * module, so `npm run dev` and production behave identically.
 *
 * The `config.path` below claims /api/contact directly (Netlify Functions 2.0).
 * netlify.toml also carries an explicit redirect to this function, which keeps
 * the route working regardless of how the site is built.
 */

import { handleContact } from '../../server/contact'

export default async (req: Request): Promise<Response> => {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }

  try {
    const payload = await req.json().catch(() => ({}))
    const result = await handleContact(payload as Record<string, unknown>)
    return json(result.status, result.body)
  } catch (error) {
    // Logged for us, generic for the visitor — the form falls through to its
    // other delivery routes when it sees a failure.
    console.error('Contact form failed:', error)
    return json(500, { ok: false, error: 'Could not send that message.' })
  }
}

export const config = { path: '/api/contact' }
