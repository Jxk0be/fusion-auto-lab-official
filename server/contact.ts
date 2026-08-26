/**
 * ---------------------------------------------------------------------------
 * CONTACT FORM → EMAIL
 * ---------------------------------------------------------------------------
 * Takes a quote-request payload and emails it to the shop via SMTP.
 *
 * This module deliberately knows nothing about Vercel, Express or Vite. The
 * production handler (`api/contact.ts`) and the local dev middleware (in
 * `vite.config.ts`) both call `handleContact`, so the form behaves identically
 * whether you're running `npm run dev` or hitting the live site.
 *
 * Required environment variables — see .env.example:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * Optional:
 *   CONTACT_TO    where quote requests land   (default info@fusionautolab.com)
 *   CONTACT_FROM  the From: address           (default SMTP_USER)
 */

import nodemailer from 'nodemailer'

export interface ContactResult {
  status: number
  body: { ok: boolean; error?: string }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Trims, and caps length so a bot can't mail us a novel. */
const clean = (value: unknown, max = 500): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

/**
 * Strips CR/LF before a value is used in a mail header. Without this, a
 * newline in the name or vehicle field could inject extra headers.
 */
const headerSafe = (value: string): string => value.replace(/[\r\n]+/g, ' ').trim()

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Trims each entry of a string array, dropping blanks and capping the count. */
const cleanList = (value: unknown, maxItems = 20, maxLen = 200): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => clean(item, maxLen))
        .filter(Boolean)
        .slice(0, maxItems)
    : []

const MAX_PHOTOS = 6
/** Decoded, not base64 — comfortably inside a serverless request body limit. */
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/

interface MailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

/**
 * Turns the form's data URLs into mail attachments.
 *
 * The browser resizes images before sending, but nothing stops a hand-rolled
 * POST, so the count, the encoding and the total size are all re-checked here.
 */
function collectPhotos(value: unknown): { attachments: MailAttachment[]; photoError?: string } {
  if (!Array.isArray(value) || value.length === 0) return { attachments: [] }
  if (value.length > MAX_PHOTOS) return { attachments: [], photoError: 'too many photos' }

  const attachments: MailAttachment[] = []
  let total = 0

  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== 'object') return { attachments: [], photoError: 'photos' }
    const { name, dataUrl } = entry as { name?: unknown; dataUrl?: unknown }
    if (typeof dataUrl !== 'string') return { attachments: [], photoError: 'photos' }

    const match = DATA_URL_RE.exec(dataUrl)
    if (!match) return { attachments: [], photoError: 'photo format' }

    const content = Buffer.from(match[2], 'base64')
    total += content.byteLength
    if (total > MAX_PHOTO_BYTES) return { attachments: [], photoError: 'photos too large' }

    // Never trust a client-supplied filename: strip any path and force the
    // extension to match the type we actually decoded.
    const safeName = clean(name, 60).replace(/[^\w.-]+/g, '_').replace(/\.[^.]*$/, '')
    attachments.push({
      filename: `${safeName || `photo-${index + 1}`}.${match[1] === 'jpeg' ? 'jpg' : match[1]}`,
      content,
      contentType: `image/${match[1]}`,
    })
  }

  return { attachments }
}

export async function handleContact(payload: Record<string, unknown>): Promise<ContactResult> {
  // Honeypot: a real visitor never sees this field. Answer 200 so the bot
  // thinks it worked and doesn't come back to try something else.
  if (clean(payload.company)) return { status: 200, body: { ok: true } }

  const name = clean(payload.name, 120)
  const email = clean(payload.email, 200)
  const phone = clean(payload.phone, 40)

  const vehicleYear = clean(payload.vehicleYear, 8)
  const vehicleMake = clean(payload.vehicleMake, 60)
  const vehicleModel = clean(payload.vehicleModel, 80)
  const vehicle = [vehicleYear, vehicleMake, vehicleModel].filter(Boolean).join(' ')

  const workType = clean(payload.workType, 80)
  const service = clean(payload.service, 160)
  const finish = clean(payload.finish, 80)
  const mechanicJob = clean(payload.mechanicJob, 120)
  const mechanicDetail = clean(payload.mechanicDetail, 3000)
  const defects = cleanList(payload.defects, 12, 120)
  const defectNotes = clean(payload.defectNotes, 3000)
  const message = clean(payload.message, 5000)

  // Extras the form sends along; absent on a bare POST, so both are optional.
  const pageUrl = clean(payload.pageUrl, 300)
  const consentText = clean(payload.consentText, 300)

  // Server-side validation — the browser checks are for the visitor's benefit,
  // not ours. Anything can POST to this endpoint.
  //
  // Only contact details and the vehicle are required. Service, finish and
  // condition are all "if you know" on the form, so demanding them here would
  // reject exactly the customers who most need a conversation.
  const invalid: string[] = []
  if (!name) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (phone.replace(/\D/g, '').length < 10) invalid.push('phone')
  if (!/^\d{4}$/.test(vehicleYear)) invalid.push('vehicleYear')
  if (!vehicleMake) invalid.push('vehicleMake')
  if (!vehicleModel) invalid.push('vehicleModel')

  const { attachments, photoError } = collectPhotos(payload.photos)
  if (photoError) invalid.push(photoError)

  if (invalid.length) {
    return {
      status: 400,
      body: { ok: false, error: `Missing or invalid: ${invalid.join(', ')}` },
    }
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Contact form: SMTP is not configured (SMTP_HOST/USER/PASS).')
    return {
      status: 500,
      body: { ok: false, error: 'Email is not set up on the server yet.' },
    }
  }

  const port = Number(SMTP_PORT) || 465
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 is implicit TLS; 587 upgrades via STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  const to = process.env.CONTACT_TO || 'info@fusionautolab.com'
  const from = process.env.CONTACT_FROM || SMTP_USER

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Vehicle', vehicle],
    ['Looking for', workType || 'not specified'],
  ]

  if (service) rows.push(['Service', service])
  if (finish) rows.push(['Finish', finish])
  if (mechanicJob) rows.push(['Mechanic work', mechanicJob])
  if (defects.length) rows.push(['Condition flagged', defects.join(', ')])
  if (attachments.length) rows.push(['Photos', `${attachments.length} attached`])

  const footnotes = [
    pageUrl ? `Submitted from: ${pageUrl}` : '',
    consentText ? `Consent shown: ${consentText}` : '',
  ].filter(Boolean)

  const blocks: Array<[string, string]> = [
    ['What it is doing', mechanicDetail],
    ['Condition notes', defectNotes],
    ['Notes', message],
  ].filter(([, body]) => Boolean(body)) as Array<[string, string]>

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    blocks.length
      ? blocks.map(([label, body]) => `${label}:\n${body}`).join(`\n\n`)
      : '(no additional details)',
    '',
    '— Sent from the fusionautolab.com quote form',
    ...footnotes,
  ].join('\n')

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#2f353b">
      <h2 style="margin:0 0 16px;font-size:18px">New quote request</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr>
                 <td style="padding:4px 16px 4px 0;color:#6f7983">${label}</td>
                 <td style="padding:4px 0;font-weight:600">${escapeHtml(value)}</td>
               </tr>`,
          )
          .join('')}
      </table>
      ${
        blocks.length
          ? blocks
              .map(
                ([label, body]) =>
                  `<p style="margin:20px 0 0"><strong style="display:block;color:#6f7983;font-size:13px;font-weight:600">${label}</strong>` +
                  `<span style="white-space:pre-wrap">${escapeHtml(body)}</span></p>`,
              )
              .join('')
          : '<p style="margin:20px 0 0;color:#6f7983"><em>(no additional details)</em></p>'
      }
      ${
        attachments.length
          ? `<p style="margin:20px 0 0;color:#6f7983;font-size:13px">${attachments.length} photo${
              attachments.length === 1 ? '' : 's'
            } attached.</p>`
          : ''
      }
      <p style="margin:24px 0 0;color:#919aa4;font-size:13px">
        Sent from the fusionautolab.com quote form. Hit reply to answer ${escapeHtml(name)} directly.
        ${footnotes.map((line) => `<br>${escapeHtml(line)}`).join('')}
      </p>
    </div>
  `

  await transporter.sendMail({
    // From must be an address the SMTP account is allowed to send as — sending
    // as the customer would fail SPF/DMARC and land in spam. Reply-To carries
    // their address instead, so hitting reply answers them directly.
    from: `"Fusion Auto Lab website" <${from}>`,
    to,
    replyTo: `"${headerSafe(name).replace(/"/g, '')}" <${email}>`,
    subject: headerSafe(`Quote request — ${vehicle} (${service || workType || 'enquiry'})`),
    text,
    html,
    attachments,
  })

  return { status: 200, body: { ok: true } }
}
