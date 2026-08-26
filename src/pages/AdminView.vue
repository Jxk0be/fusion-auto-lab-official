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
  notice.value = {
    tone: 'ok',
    text: 'Saved. The website will show the change in about a minute.',
  }
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
            Change the wording, then save. Nothing goes live until you press Save.
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
