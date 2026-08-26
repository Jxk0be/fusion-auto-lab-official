/**
 * ---------------------------------------------------------------------------
 * ADMIN API — lets the shop owner edit site content without touching code
 * ---------------------------------------------------------------------------
 * One POST endpoint, three actions:
 *
 *   login  -> checks the shared password, returns a short-lived signed token
 *   load   -> reads the current content JSON straight from GitHub
 *   save   -> commits edited JSON back to GitHub, which triggers a rebuild
 *
 * The GitHub token lives only on the server. The browser never sees it, and
 * the owner never needs a GitHub account — he just has a password.
 *
 * Environment variables (see .env.example):
 *   ADMIN_PASSWORD   what the owner types at /admin
 *   ADMIN_SECRET     optional, signs the session token (falls back to a value
 *                    derived from ADMIN_PASSWORD)
 *   GITHUB_TOKEN     fine-grained PAT with Contents: read and write
 *   GITHUB_REPO      owner/repo, e.g. Jxk0be/fusion-auto-lab-official
 *   GITHUB_BRANCH    optional, defaults to main
 */

import { createHmac, timingSafeEqual } from 'node:crypto'

export interface AdminResult {
  status: number
  body: Record<string, unknown>
}

/**
 * The only files this endpoint will ever read or write.
 *
 * This is the security boundary that matters most: without it, a `file`
 * parameter of "../../netlify/functions/admin.mts" would let anyone holding
 * the password rewrite the site's own source. Membership is checked by exact
 * match, never by prefix or by resolving a path.
 */
const EDITABLE_FILES = [
  'src/content/site.json',
  'src/content/services.json',
  'src/content/mechanic.json',
  'src/content/faq.json',
  'src/content/gallery.json',
  'src/content/process.json',
  'src/content/testimonials.json',
] as const

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000 // a working day

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url')

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

/** Constant-time compare that tolerates different lengths. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the failure isn't measurably faster.
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

function adminSecret(): string {
  const { ADMIN_SECRET, ADMIN_PASSWORD } = process.env
  return ADMIN_SECRET || `derived:${ADMIN_PASSWORD ?? ''}`
}

function issueToken(): string {
  const payload = b64url(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS }))
  return `${payload}.${sign(payload, adminSecret())}`
}

function verifyToken(token: unknown): boolean {
  if (typeof token !== 'string' || !token.includes('.')) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  if (!safeEqual(signature, sign(payload, adminSecret()))) return false
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

/* -------------------------------------------------------------------------- */
/* GitHub                                                                      */
/* -------------------------------------------------------------------------- */

const gh = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'fusion-auto-lab-admin',
      ...(init.headers ?? {}),
    },
  })
  return response
}

const repo = () => process.env.GITHUB_REPO ?? ''
const branch = () => process.env.GITHUB_BRANCH || 'main'

async function readFile(file: string) {
  const response = await gh(
    `/repos/${repo()}/contents/${encodeURIComponent(file)}?ref=${encodeURIComponent(branch())}`,
  )
  if (!response.ok) throw new Error(`GitHub read ${file}: ${response.status}`)
  const json = (await response.json()) as { content: string; sha: string }
  return {
    data: JSON.parse(Buffer.from(json.content, 'base64').toString('utf8')),
    sha: json.sha,
  }
}

async function writeFile(file: string, data: unknown, sha: string, message: string) {
  // Trailing newline keeps the commit diff clean against files written by hand.
  const content = `${JSON.stringify(data, null, 2)}\n`
  const response = await gh(`/repos/${repo()}/contents/${encodeURIComponent(file)}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha,
      branch: branch(),
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub write ${file}: ${response.status} ${detail.slice(0, 200)}`)
  }
  return (await response.json()) as { commit: { sha: string; html_url: string } }
}

/* -------------------------------------------------------------------------- */
/* Handler                                                                     */
/* -------------------------------------------------------------------------- */

const configured = () =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)

export async function handleAdmin(payload: Record<string, unknown>): Promise<AdminResult> {
  if (!configured()) {
    console.error('Admin: missing ADMIN_PASSWORD, GITHUB_TOKEN or GITHUB_REPO.')
    return { status: 503, body: { ok: false, error: 'The editor is not set up on this site yet.' } }
  }

  const action = typeof payload.action === 'string' ? payload.action : ''

  if (action === 'login') {
    const password = typeof payload.password === 'string' ? payload.password : ''
    if (!safeEqual(password, process.env.ADMIN_PASSWORD!)) {
      // Deliberately vague, and slowed down a little so the endpoint is a poor
      // guessing oracle.
      await new Promise((resolve) => setTimeout(resolve, 600))
      return { status: 401, body: { ok: false, error: 'That password is not right.' } }
    }
    return { status: 200, body: { ok: true, token: issueToken() } }
  }

  // Everything below needs a valid session.
  if (!verifyToken(payload.token)) {
    return { status: 401, body: { ok: false, error: 'Your session expired — please sign in again.' } }
  }

  if (action === 'load') {
    const files: Record<string, { data: unknown; sha: string }> = {}
    for (const file of EDITABLE_FILES) {
      files[file] = await readFile(file)
    }
    return { status: 200, body: { ok: true, files, branch: branch() } }
  }

  if (action === 'save') {
    const file = typeof payload.file === 'string' ? payload.file : ''
    if (!(EDITABLE_FILES as readonly string[]).includes(file)) {
      return { status: 400, body: { ok: false, error: 'That file cannot be edited.' } }
    }
    if (typeof payload.sha !== 'string' || !payload.sha) {
      return { status: 400, body: { ok: false, error: 'Missing file version.' } }
    }
    if (payload.data === undefined || payload.data === null) {
      return { status: 400, body: { ok: false, error: 'Nothing to save.' } }
    }

    const label = file.replace('src/content/', '').replace('.json', '')
    try {
      const result = await writeFile(
        file,
        payload.data,
        payload.sha,
        `Update ${label} content from the site editor`,
      )
      return { status: 200, body: { ok: true, commit: result.commit.sha.slice(0, 7) } }
    } catch (error) {
      const message = String(error)
      // 409 means the file moved on since it was loaded — usually a second
      // tab, or a code change landing mid-edit.
      if (message.includes('409') || message.includes('422')) {
        return {
          status: 409,
          body: {
            ok: false,
            error: 'Someone else changed this since you loaded it. Reload the editor and redo this change.',
          },
        }
      }
      throw error
    }
  }

  return { status: 400, body: { ok: false, error: 'Unknown action.' } }
}

export const editableFiles = EDITABLE_FILES
