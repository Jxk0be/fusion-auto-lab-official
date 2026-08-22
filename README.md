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

Right now the quote form opens the visitor's email app with every field
pre-filled and addressed to info@fusionautolab.com. That works everywhere and
loses nothing, but it does mean the visitor has to hit "send" themselves.

To have submissions land in the inbox automatically:

1. Sign up for a free form service — [Formspree](https://formspree.io),
   [Web3Forms](https://web3forms.com) or [Getform](https://getform.io) all work
2. Point it at info@fusionautolab.com and copy the endpoint URL it gives you
3. Create a file named `.env` next to `package.json`:

```
VITE_FORM_ENDPOINT=https://formspree.io/f/your-id-here
```

4. Rebuild. The form now POSTs directly and shows a success screen.

The form already includes a hidden honeypot field that catches most spam bots.

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
