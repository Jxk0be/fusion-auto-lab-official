# Fusion Auto Lab — Website

Multi-page marketing site for Fusion Auto Lab (automotive liquid wrapping, Knoxville TN).

**Stack:** Vue 3 (Composition API, `<script setup>`) · TypeScript · Tailwind CSS v4 · Vue Router · Vite

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173

Other commands:

```bash
npm run build
```

```bash
npm run preview
```

---

## Pages

| Route      | Page                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `/`        | Home — hero, why liquid wrap, packages, comparison chart, process, FAQ |
| `/services`| Packages, comparison chart + table, a-la-carte add-ons, process         |
| `/auto-mechanic-services` | General repair: hourly rate, how it works, job list, referral program |
| `/gallery` | Portfolio grid with category filters and a lightbox                    |
| `/reviews` | Customer reviews (empty state until real ones are added)               |
| `/faq`     | Full FAQ, grouped, with Google FAQ structured data                     |
| `/contact` | Quote form, shop details, hours, map                                   |
| `/payment` | Venmo payment link + "before you send" guidance                        |
| `/privacy` | Privacy policy                                                         |
| `/terms`   | Terms of service                                                       |

---

## Editing content — everything lives in `src/data/`

You should almost never need to touch a component to change what the site says.

| File                       | What it controls                                                             |
| -------------------------- | ---------------------------------------------------------------------------- |
| `src/data/site.ts`         | Phone, email, address, hours, Instagram, payment link, nav menu               |
| `src/data/services.ts`     | **Packages, prices, features, add-ons, and the comparison chart scores**      |
| `src/data/mechanic.ts`     | **Hourly rate, the rate-comparison line, referral terms, and the job list.** The job list also feeds the quote form's select, so the page and form can't drift. |
| `src/data/faq.ts`          | Every FAQ question and answer                                                |
| `src/data/testimonials.ts` | Customer reviews (starts empty — add real ones only)                         |
| `src/data/gallery.ts`      | Portfolio entries and which photo each one points at                          |
| `src/data/process.ts`      | The 5-step "how it works" list and the four "why liquid wrap" cards           |

### Adding prices

In `src/data/services.ts`, each package has `priceFrom: null`, which renders as
**"Request a quote"**. Put a real number in to show it instead:

```ts
priceFrom: '$1,800',
priceNote: 'Sedans and coupes',
```

### Changing the comparison chart

Same file, at the bottom, under `comparison.traits`. Each trait has one score
per package **in the same order the packages are listed**:

```ts
{
  label: 'Durability',
  description: 'How well the finish holds up ...',
  scores: [6, 8, 10],   // Essential, Signature, Concours
}
```

Add a trait by copying a block. Add a package by copying a package block **and**
adding a fourth number to every `scores` array. The radar chart, the mobile bar
view and the table all read from these same numbers, so they can never disagree.

### Adding gallery photos

1. Drop the image into `public/gallery/` — e.g. `public/gallery/mustang.jpg`
2. In `src/data/gallery.ts`, set `src: '/gallery/mustang.jpg'` on that entry

Entries with `src: null` show a tidy "photo coming soon" tile, so the page still
looks intentional while the portfolio fills up. Compress photos first
(squoosh.app is free) — aim for under ~400KB each.

---

## The logo

The logo art is generated from the three JPEGs supplied by the owner
(`Logo_Full.jpg`, `Logo_Image_Only.jpg`, `Logo_Text_Only.jpg`, kept on the
Desktop). To regenerate after any art change:

```bash
python scripts/build-logos.py
```

That writes into `public/`:

| File                   | Used for                                     |
| ---------------------- | -------------------------------------------- |
| `logo-mark.png`        | The atom/wheel mark — header and footer       |
| `logo-wordmark.png`    | The "Fusion Auto Lab" type — header and footer|
| `logo.png`             | The full stacked lockup                       |
| `favicon.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons |
| `og-image.jpg`         | The preview card shown when the link is shared|

**Why the header and footer are dark.** The mark's tire and rim are dark gray
art drawn on a black background. Once the black is removed those pixels are
nearly transparent, so the mark only reads properly on a dark surface. That is
a property of the artwork, not a style choice — the header, footer, hero and
call-to-action bands are all dark so the logo sits correctly everywhere.

If a light header is ever wanted, the mark needs to be re-drawn with a light
outline or a light-background variant exported from the original design file.

**Brand color.** `--color-accent-*` in `src/style.css` is sampled from the
logo's electric blue (`#38c8f8`). The 400 step is the logo blue itself — bright
on dark, so buttons pair it with near-black text rather than white. The 600 and
700 steps are darkened versions used for links on white backgrounds, where the
raw logo blue would be too light to read.

---

## Where do form submissions go?

To **nodemailer**. The quote form POSTs to `/api/contact`, which emails the
whole enquiry to **info@fusionautolab.com** over SMTP. That is the only route —
there is no third-party form service and no lead platform in the path.

| File | Role |
| ---- | ---- |
| `server/contact.ts` | Validates the payload and sends the email. All the real logic. |
| `netlify/functions/contact.mts` | The production endpoint (a Netlify Function). |
| `vite.config.ts` | Dev-only middleware so the same route works under `npm run dev`. |

Both entry points call the same `handleContact`, so what you test locally is
what runs in production.

### Setting it up

Nothing sends until SMTP credentials exist. Locally, copy `.env.example` to
`.env` and fill in the four `SMTP_` values. On Netlify, add the same four under
*Site settings → Environment variables*.

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<the account the app password belongs to>
SMTP_PASS=<16-character App Password, spaces removed>
```

`SMTP_USER` is the one people get wrong: it must be the Google account that owns
the app password, which is not necessarily the address you want mail delivered
to. Delivery is controlled by `CONTACT_TO`, which defaults to
info@fusionautolab.com. So if info@ is a real Workspace mailbox, use it for
both; if it only forwards into a personal Gmail, put the Gmail address in
`SMTP_USER` and leave `CONTACT_TO` alone.

App Passwords come from myaccount.google.com/apppasswords and need 2-Step
Verification switched on first. They are **not** the account password.

### What the form asks for

Required: name, phone, email, and the vehicle's year, make and model (three
separate fields, so the make and model arrive clean rather than as one string).

Everything else is deliberately optional — the service, the finish and the
paint condition are all "if you know". A customer who hasn't decided yet is
exactly who the form should not be turning away.

The **What you need** step branches. Picking *Liquid wrap* shows the service and
finish selects plus the paint-condition checklist; *Mechanic work* shows the job
type and a "what's it doing" box; *Not sure yet* shows both. Only the branch
they actually filled in is sent, so switching work type mid-form never leaves
stale answers in the email.

To change the options, edit the data — not the component:

| List | Lives in |
| ---- | -------- |
| Wrap services | `packages` + `addOns` in `src/data/services.ts` |
| Finishes | `finishes` in `src/data/services.ts` (shared with the home page swatches) |
| Paint condition checklist | `defectOptions` in `src/data/services.ts` |
| Mechanic job types | `mechanicJobs` in `src/data/mechanic.ts` |

### Photos

Up to **6 photos** per request, attached to the notification email.

Every image is redrawn through a canvas at max 1600px and re-encoded as JPEG
**before it leaves the browser**. That matters: a phone camera shot is 3–8 MB and
base64 adds a third on top, so two untouched photos would exceed the 6 MB body
limit a Netlify function accepts. Resized, a typical photo lands near 300 KB, and
the upload finishes quickly on a phone signal. A defect photo only needs to show
the defect.

The limits live in `src/components/PhotoUpload.vue` (`MAX_DIMENSION`, `QUALITY`,
`MAX_TOTAL_BYTES`). The server re-checks all of it in `collectPhotos` — count,
data-URL format, decoded size — and rewrites the filename, because none of the
browser-side limits mean anything to a hand-rolled POST.

HEIC is the one gap: some browsers can't decode it, and those files are skipped
with a message asking for a JPG or PNG. iPhones normally hand over a JPG through
a file picker, so this is rare in practice.

### What the endpoint handles

- **Server-side validation.** The in-browser checks are a courtesy to the
  visitor; anything can POST to the endpoint, so it re-validates everything.
- **Honeypot.** A hidden field no human sees. A filled one gets a normal-looking
  success response and nothing is sent.
- **Header-injection protection.** Newlines are stripped from any value used in
  a mail header, so the name field cannot smuggle in a `Bcc:`.
- **HTML escaping** on everything rendered into the email body.
- **Reply-To.** Mail arrives *from* the shop address with the customer's address
  as Reply-To, so hitting reply answers them directly. Sending as the customer
  would fail SPF/DMARC and land in spam.
- **A record of consent.** The sentence shown above the submit button is sent
  along and printed at the foot of the email, together with the page it came
  from.

### If the send fails

The visitor sees the error with a one-click pre-filled email as a fallback, and
everything they typed stays on screen. An enquiry is never silently lost.

That fallback is also what you will see until the SMTP variables are set.

---

## Deploying

The build output is a plain static folder (`dist/`) — any static host will do.
Netlify and Vercel both have free tiers, deploy from a Git repo, and issue HTTPS
certificates automatically.

- **Build command:** `npm run build`
- **Publish directory:** `dist`

`/api/contact` is routed to the Netlify Function by a rule in `netlify.toml`
(and mirrored in `public/_redirects`) that sits **above** the SPA catch-all.
Netlify takes the first matching rule, so if that order is ever changed the
endpoint starts returning the homepage instead of running.

Config for SPA routing is already included for both hosts (`public/_redirects`
for Netlify, `vercel.json` for Vercel). Without it, refreshing a page like
`/services` would 404.

Then point `fusionautolab.com` at the host per their DNS instructions.

---

## SEO

Already handled:

- Per-page titles, meta descriptions, canonical URLs and Open Graph tags
- `AutoBodyShop` structured data (name, address, phone, hours) in `index.html`
- `FAQPage` structured data on the FAQ page
- `robots.txt` and `sitemap.xml` in `public/`

### Link previews (Discord, iMessage, Facebook)

Social crawlers don't run JavaScript, so the absolute URLs baked into
`index.html` are what they read. Hardcoding the custom domain breaks any time
the site is reachable somewhere else — which is the situation before DNS is
pointed, and it shows up as "Image failed to load" in a Discord embed while the
title and description still work.

So `index.html` carries a `%SITE_URL%` token that `vite.config.ts` replaces at
build time with, in order: `SITE_URL`, then Netlify's own `URL`, then
`https://fusionautolab.com`. Netlify sets `URL` to the site's primary address,
so previews follow the deploy automatically and start using the custom domain
the moment it is attached. Nothing to remember.

If a preview still looks stale, the crawler has cached it — Discord holds
embeds for a while, and appending `?v=2` to the shared link forces a refetch.

**Worth doing next:** claim the free
[Google Business Profile](https://business.google.com) for the shop. For a local
business, that single listing drives more traffic than anything on the site.

If any of the address, phone or hours details change, update `src/data/site.ts`
**and** the structured-data block in `index.html`.
