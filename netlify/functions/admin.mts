/**
 * POST /api/admin — the content editor's backend.
 *
 * All logic lives in server/admin.ts; the dev middleware in vite.config.ts
 * calls the same module, so the editor behaves identically locally and live.
 */

import { handleAdmin } from '../../server/admin'

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
    const result = await handleAdmin(payload as Record<string, unknown>)
    return json(result.status, result.body)
  } catch (error) {
    console.error('Admin request failed:', error)
    return json(500, { ok: false, error: 'Something went wrong saving that.' })
  }
}

export const config = { path: '/api/admin' }
