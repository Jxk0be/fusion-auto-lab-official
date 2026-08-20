import { watchEffect } from 'vue'
import { site } from '@/data/site'

interface SeoOptions {
  title: string
  description: string
  /** Path only, e.g. '/services'. Defaults to the current location. */
  path?: string
  image?: string
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Sets the page title, description, canonical URL and Open Graph tags.
 * Call once from the top of each page component.
 */
export function useSeo(options: SeoOptions | (() => SeoOptions)) {
  watchEffect(() => {
    const { title, description, path, image } = typeof options === 'function' ? options() : options
    const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`
    const url = `${site.url}${path ?? window.location.pathname}`

    document.title = fullTitle
    upsertMeta('meta[name="description"]', 'name', 'description', description)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image ?? `${site.url}/og-image.jpg`)
    upsertLink('canonical', url)
  })
}

/** Injects a JSON-LD block and removes it when the page unmounts. */
export function useJsonLd(id: string, data: Record<string, unknown>) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
