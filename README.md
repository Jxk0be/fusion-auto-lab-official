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

Into **LeadLine**, the lead system at `~/Desktop/VedJxBusiness`. When a visitor
submits the quote form:

1. It POSTs to `POST /v1/leads` on the LeadLine API and the lead is recorded
2. **info@fusionautolab.com is emailed straight away** with the whole enquiry
3. The customer gets a written acknowledgement back, usually inside a minute,
   answering what it can from the FAQ and asking one useful follow-up question
4. The lead shows up in the owner dashboard, where it can be marked contacted,
   won or lost

Nothing about this depends on the visitor having a mail app configured.

### Wiring it up

In the LeadLine repo, create the tenant and print its keys:

```bash
pnpm seed:fusion
```

That prints a site key. Put it, and the API origin, in a file named `.env` next
to `package.json` here:

```
VITE_LEADLINE_SITE_KEY=pk_live_...
VITE_LEADLINE_API=https://api.frontedesk.com
```

Then rebuild. Two things to know:

- **The site key is public** and safe in the built JavaScript — it identifies
  the shop, it does not authorise anything. Rate limits and the honeypot are
  what stop abuse.
- **The API only accepts browser requests from registered tenant domains.** The
  seed registers `fusionautolab.com` (and `www.`), so a deploy served from a
  `*.vercel.app` or `*.netlify.app` preview URL will be refused by CORS until
  the real domain is pointing at it. That is the expected failure and it looks
  like "the form errors on the preview but works in production".

### Fallbacks, in order

The form tries each of these and uses the first one that is configured, so a
missing key degrades instead of losing the enquiry:

| Configured | What happens |
| --- | --- |
| `VITE_LEADLINE_SITE_KEY` + `VITE_LEADLINE_API` | POSTs to LeadLine, success screen |
| `VITE_FORM_ENDPOINT` only | POSTs to a generic form service (Formspree, Web3Forms, Getform, Netlify) |
| Neither | Opens the visitor's email app, pre-filled and addressed to info@fusionautolab.com |

The form includes a hidden honeypot field that catches most spam bots, and the
sentence above the submit button is stored verbatim on the lead as the consent
record.

### The two fields LeadLine has no column for

A lead carries name, email, phone and message. **Vehicle** and **service** are
folded into the top of the message, labelled, so they are the first thing in
the notification email and the first thing the assistant reads. If a field is
ever added to this form, do the same with it — see `leadMessage` in
`src/components/ContactForm.vue`.

### Why there is no `f.js` script tag

LeadLine normally attaches to a site with a one-line `<script>` that enhances
any `<form data-leadline>`. It is not used here. That snippet reads values out
of `[name="..."]` attributes and installs its own submit handler; these inputs
are bound with `v-model` and carry no `name` attributes, and the component
already owns submit, validation and the success screen. It would find no fields
and fight the handler that works. Posting to the same endpoint directly is the
same integration without either problem.

---

## Deploying

The build output is a plain static folder (`dist/`) — any static host will do.
Netlify and Vercel both have free tiers, deploy from a Git repo, and issue HTTPS
certificates automatically.

- **Build command:** `npm run build`
- **Publish directory:** `dist`

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

**Worth doing next:** claim the free
[Google Business Profile](https://business.google.com) for the shop. For a local
business, that single listing drives more traffic than anything on the site.

If any of the address, phone or hours details change, update `src/data/site.ts`
**and** the structured-data block in `index.html`.
