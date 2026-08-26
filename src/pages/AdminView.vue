<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import JsonField from '@/components/admin/JsonField.vue'
import { CONTENT_FILES } from '@/admin/schema'
import { site } from '@/data/site'

/**
 * The content editor. Everything here talks to /api/admin, which holds the
 * GitHub token — the browser never sees it, and the owner never needs a
 * GitHub account.
 *
 * Saving commits the JSON, which triggers a rebuild. That takes a minute or
 * so, which is why the success message says the change is queued rather than
 * pretending it is already live.
 */

type Loaded = Record<string, { data: Record<string, unknown>; sha: string }>

const token = ref<string | null>(null)
const password = ref('')
const loginError = ref('')
const busy = ref(false)

const files = ref<Loaded>({})
const active = ref(CONTENT_FILES[0].file)
/** Files edited since they were loaded. */
const dirty = ref(new Set<string>())
const notice = ref<{ tone: 'ok' | 'bad'; text: string } | null>(null)

/**
 * A save is not the end of the story: it commits the change, which kicks off a
 * rebuild of the whole site. That takes a minute or two, and until it lands the
 * old page is still being served — often from the browser's cache even after
 * it finishes. Without saying so plainly, the honest reaction to "Saved!" is to
 * refresh, see no change, and assume it did not work.
 */
const savedAt = ref<number | null>(null)
const secondsSinceSave = ref(0)
let saveTimer: ReturnType<typeof setInterval> | undefined

/** Roughly how long a Netlify build takes for this site. */
const REBUILD_SECONDS = 120

const rebuildDone = computed(() => secondsSinceSave.value >= REBUILD_SECONDS)

const sinceSaveLabel = computed(() => {
  const s = secondsSinceSave.value
  if (s < 10) return 'just now'
  if (s < 60) return `${s} seconds ago`
  const minutes = Math.floor(s / 60)
  return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`
})

/**
 * How to force a fresh copy of the page, described for the device in hand.
 *
 * Phones and tablets have no hard-refresh shortcut at all, so naming a key
 * combination there is worse than saying nothing — it reads as an instruction
 * he cannot follow. They get the thing that actually works instead.
 */
const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0
const coarsePointer =
  typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches

// iPadOS reports a desktop Mac user agent, so touch points are what give it away.
const isTouchDevice =
  /Android|iPhone|iPod/.test(ua) || coarsePointer || (/Macintosh/.test(ua) && touchPoints > 1)
const isMac = /Mac|iPhone|iPad|iPod/.test(ua)

const hardRefreshKeys = computed(() =>
  isTouchDevice ? null : isMac ? 'Cmd + Shift + R' : 'Ctrl + Shift + R',
)

const activeMeta = computed(() => CONTENT_FILES.find((f) => f.file === active.value)!)
const activeData = computed(() => files.value[active.value]?.data)

const post = async (payload: Record<string, unknown>) => {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, token: token.value }),
  })
  const body = await response.json().catch(() => null)
  return { ok: response.ok && body?.ok, status: response.status, body }
}

const load = async () => {
  busy.value = true
  const result = await post({ action: 'load' })
  busy.value = false
  if (!result.ok) {
    notice.value = { tone: 'bad', text: result.body?.error ?? 'Could not load the content.' }
    if (result.status === 401) signOut()
    return
  }
  files.value = result.body.files as Loaded
  dirty.value = new Set()
}

const signIn = async () => {
  loginError.value = ''
  busy.value = true
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', password: password.value }),
  })
  const body = await response.json().catch(() => null)
  busy.value = false

  if (!response.ok || !body?.ok) {
    loginError.value = body?.error ?? 'Could not sign in.'
    return
  }
  token.value = body.token
  sessionStorage.setItem('fal-admin', body.token)
  password.value = ''
  await load()
}

const signOut = () => {
  token.value = null
  sessionStorage.removeItem('fal-admin')
  files.value = {}
  dirty.value = new Set()
}

// JsonField is generic over the JSON tree, so it emits `unknown`. At the root
// the value is always the file's object.
const onEdit = (value: unknown) => {
  files.value[active.value].data = value as Record<string, unknown>
  dirty.value = new Set(dirty.value).add(active.value)
}

const save = async () => {
  const entry = files.value[active.value]
  busy.value = true
  notice.value = null
  const result = await post({
    action: 'save',
    file: active.value,
    data: entry.data,
    sha: entry.sha,
  })
  busy.value = false

  if (!result.ok) {
    notice.value = { tone: 'bad', text: result.body?.error ?? 'Could not save that.' }
    return
  }
  const next = new Set(dirty.value)
  next.delete(active.value)
  dirty.value = next
  savedAt.value = Date.now()
  secondsSinceSave.value = 0
  clearInterval(saveTimer)
  saveTimer = setInterval(() => {
    secondsSinceSave.value = Math.floor((Date.now() - (savedAt.value ?? Date.now())) / 1000)
  }, 1000)
  // The sha changes on every commit; reload so a second save is not rejected.
  await load()
}

/** A browser-level guard, since a lost edit here means retyping real work. */
const warnOnLeave = (event: BeforeUnloadEvent) => {
  if (dirty.value.size) event.preventDefault()
}

onMounted(() => {
  document.title = `Edit the site | ${site.name}`
  const meta = document.createElement('meta')
  meta.name = 'robots'
  meta.content = 'noindex, nofollow'
  meta.id = 'admin-noindex'
  document.head.appendChild(meta)

  const saved = sessionStorage.getItem('fal-admin')
  if (saved) {
    token.value = saved
    load()
  }
  window.addEventListener('beforeunload', warnOnLeave)
})

onBeforeUnmount(() => {
  clearInterval(saveTimer)
  window.removeEventListener('beforeunload', warnOnLeave)
  document.getElementById('admin-noindex')?.remove()
})
</script>

<template>
  <!-- Single root: App.vue wraps the router view in a <Transition>, which
       needs one child. Two sibling roots left the sign-in form on screen
       underneath the editor after logging in. -->
  <div>
    <!-- Sign in -->
  <section v-if="!token" class="bg-ink-50 py-20">
    <div class="container-page">
      <div class="mx-auto max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-card">
        <h1 class="text-2xl font-bold text-ink-900">Edit the site</h1>
        <p class="mt-2 text-[0.9375rem] text-ink-600">
          Enter the password to change text on your website.
        </p>
        <form class="mt-6" @submit.prevent="signIn">
          <label for="pw" class="mb-1.5 block text-sm font-semibold text-ink-800">Password</label>
          <input
            id="pw"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-ink-200 px-3.5 py-3 text-[0.9375rem]"
          />
          <p v-if="loginError" class="mt-2 text-sm text-red-600">{{ loginError }}</p>
          <button type="submit" class="btn btn-primary mt-5 w-full" :disabled="busy">
            {{ busy ? 'Checking…' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Editor -->
  <section v-else class="bg-ink-50 py-10">
    <div class="container-page">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-ink-900">Edit the site</h1>
          <p class="mt-1 text-[0.9375rem] text-ink-600">
            Change the wording, then save. Nothing goes live until you press Save — and after
            that the site takes a minute or two to rebuild.
          </p>
        </div>
        <button type="button" class="btn btn-outline !py-2.5 !text-sm" @click="signOut">
          Sign out
        </button>
      </div>

      <!-- Tabs -->
      <div class="-mx-5 mt-7 overflow-x-auto px-5">
        <ul class="flex min-w-max gap-2">
          <li v-for="meta in CONTENT_FILES" :key="meta.file">
            <button
              type="button"
              class="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
              :class="
                active === meta.file
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
              "
              @click="active = meta.file"
            >
              {{ meta.title }}
              <span
                v-if="dirty.has(meta.file)"
                class="h-1.5 w-1.5 rounded-full bg-accent-500"
                title="Unsaved changes"
              />
            </button>
          </li>
        </ul>
      </div>

      <!-- After a save: what is actually happening, and what to do about it -->
      <div
        v-if="savedAt"
        class="mt-5 rounded-xl border p-5"
        :class="rebuildDone ? 'border-accent-200 bg-accent-50' : 'border-ink-200 bg-white'"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            :class="rebuildDone ? 'bg-accent-500 text-white' : 'bg-ink-100 text-ink-500'"
          >
            <BaseIcon
              :name="rebuildDone ? 'check' : 'spinner'"
              :size="16"
              :stroke-width="2.5"
              :class="!rebuildDone && 'animate-spin'"
            />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-ink-900">
              {{ rebuildDone ? 'Your changes should be live now' : 'Saved — your site is rebuilding' }}
            </p>

            <p class="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-600">
              <template v-if="!rebuildDone">
                Your change is safely saved, but the website has to rebuild itself before visitors
                see it. That usually takes a minute or two. You can carry on editing while it works.
              </template>
              <template v-else>
                Give the site a look. If you still see the old wording, the page is cached — use the
                refresh below rather than a normal one.
              </template>
            </p>

            <p class="mt-2 text-[0.8125rem] text-ink-500">Saved {{ sinceSaveLabel }}.</p>

            <div class="mt-4 rounded-lg bg-ink-50 px-4 py-3">
              <p class="text-[0.9375rem] font-semibold text-ink-800">
                To see the change, refresh properly
              </p>
              <p v-if="hardRefreshKeys" class="mt-1 text-[0.9375rem] leading-relaxed text-ink-600">
                Hold
                <kbd class="rounded border border-ink-300 bg-white px-1.5 py-0.5 font-sans text-[0.8125rem] font-semibold">
                  {{ hardRefreshKeys }}
                </kbd>
                on the website tab. A normal refresh often shows the old saved copy from your
                browser, which is the usual reason a change looks like it did not work.
              </p>
              <p v-else class="mt-1 text-[0.9375rem] leading-relaxed text-ink-600">
                Pull down on the website to refresh it. If it still looks the same, close that tab
                completely and open the site again — a phone holds on to the old copy of a page more
                stubbornly than a computer does.
              </p>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <a href="/" target="_blank" rel="noopener" class="btn btn-outline !py-2.5 !text-sm">
                Open the website
                <BaseIcon name="external" :size="14" />
              </a>
              <button
                type="button"
                class="btn btn-outline !py-2.5 !text-sm"
                @click="savedAt = null"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <p
        v-if="notice"
        class="mt-5 rounded-lg px-4 py-3 text-sm"
        :class="notice.tone === 'ok' ? 'bg-accent-50 text-accent-800' : 'bg-red-50 text-red-700'"
      >
        {{ notice.text }}
      </p>

      <div v-if="busy && !activeData" class="mt-8 text-ink-500">Loading your content…</div>

      <template v-else-if="activeData">
        <p class="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
          {{ activeMeta.blurb }}
        </p>

        <div class="mt-6">
          <JsonField :model-value="activeData" @update:model-value="onEdit" />
        </div>

        <!-- Save bar sticks to the bottom so it's reachable from anywhere in a long form -->
        <div
          class="sticky bottom-0 z-10 -mx-5 mt-8 border-t border-ink-200 bg-white/95 px-5 py-4 backdrop-blur"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-[0.8125rem] text-ink-500">
              <template v-if="dirty.has(active)">You have unsaved changes.</template>
              <template v-else>Everything here is saved.</template>
            </p>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="busy || !dirty.has(active)"
              @click="save"
            >
              <BaseIcon
                :name="busy ? 'spinner' : 'check'"
                :size="16"
                :class="busy && 'animate-spin'"
              />
              {{ busy ? 'Saving…' : `Save ${activeMeta.title}` }}
            </button>
          </div>
        </div>
      </template>
    </div>
    </section>
  </div>
</template>
