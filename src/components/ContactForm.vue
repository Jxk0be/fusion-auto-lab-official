<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { addOns, packages } from '@/data/services'
import { site } from '@/data/site'
import BaseIcon from './BaseIcon.vue'

/**
 * WHERE DO SUBMISSIONS GO?
 * ------------------------------------------------------------------
 * Set VITE_FORM_ENDPOINT in a `.env` file (see .env.example) to a form
 * service URL — Formspree, Web3Forms, Getform and Netlify Forms all accept a
 * plain POST and email the results straight to info@fusionautolab.com.
 *
 * With no endpoint configured, the form falls back to opening the visitor's
 * email app with every field pre-filled, so nothing is ever lost.
 */
const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()

const route = useRoute()

const serviceOptions = [
  ...packages.map((p) => `${p.name} package`),
  ...addOns.map((a) => a.name),
  'Not sure yet — need advice',
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  vehicle: '',
  service: '',
  message: '',
  /** Honeypot — bots fill it, humans never see it. */
  company: '',
})

const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle')

onMounted(() => {
  // Deep link from a service card: /contact?service=Signature
  const preset = route.query.service
  if (typeof preset === 'string') {
    form.service = serviceOptions.find((o) => o.toLowerCase().startsWith(preset.toLowerCase())) ?? ''
  }
})

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = 'Please enter a valid email address.'
  if (form.phone.replace(/\D/g, '').length < 10)
    errors.phone = 'Please enter a 10-digit phone number.'
  if (!form.vehicle.trim()) errors.vehicle = 'Let us know the year, make and model.'
  if (!form.service) errors.service = 'Pick the service you are interested in.'
  return Object.keys(errors).length === 0
}

const plainTextBody = computed(
  () =>
    [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Vehicle: ${form.vehicle}`,
      `Service: ${form.service}`,
      '',
      form.message || '(no additional details)',
    ].join('\n'),
)

const openMailClient = () => {
  const subject = encodeURIComponent(`Quote request — ${form.vehicle || 'vehicle'} (${form.service})`)
  window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(plainTextBody.value)}`
  status.value = 'mailto'
}

const submit = async () => {
  if (form.company) return // honeypot tripped, silently ignore
  if (!validate()) {
    document.querySelector<HTMLElement>('[data-field-error]')?.focus()
    return
  }

  if (!endpoint) {
    openMailClient()
    return
  }

  status.value = 'sending'
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        vehicle: form.vehicle,
        service: form.service,
        message: form.message,
        _subject: `Quote request — ${form.vehicle} (${form.service})`,
      }),
    })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}

const reset = () => {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    service: '',
    message: '',
    company: '',
  })
  status.value = 'idle'
}

const fieldClass = (field: string) => [
  'w-full rounded-lg border bg-white px-3.5 py-3 text-[0.9375rem] text-ink-900 transition placeholder:text-ink-400',
  errors[field] ? 'border-red-400 bg-red-50/40' : 'border-ink-200 hover:border-ink-300',
]
</script>

<template>
  <!-- Success state -->
  <div
    v-if="status === 'sent'"
    class="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-card"
  >
    <span
      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-700"
    >
      <BaseIcon name="check" :size="28" :stroke-width="2.5" />
    </span>
    <h3 class="mt-5 text-2xl font-bold text-ink-900">Request received</h3>
    <p class="mx-auto mt-3 max-w-md text-ink-600">
      Thanks — we have your details and we will get back to you during business hours. If it is
      urgent, give the shop a call and we will pick it up faster.
    </p>
    <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <a :href="`tel:${site.phoneHref}`" class="btn btn-dark">
        <BaseIcon name="phone" :size="16" />
        {{ site.phone }}
      </a>
      <button type="button" class="btn btn-outline" @click="reset">Send another request</button>
    </div>
  </div>

  <!-- Mailto fallback confirmation -->
  <div
    v-else-if="status === 'mailto'"
    class="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-card"
  >
    <span
      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-700"
    >
      <BaseIcon name="send" :size="26" />
    </span>
    <h3 class="mt-5 text-2xl font-bold text-ink-900">Your email is ready to send</h3>
    <p class="mx-auto mt-3 max-w-md text-ink-600">
      We opened your email app with everything filled in — just hit send. If nothing opened, email
      us directly at
      <a :href="`mailto:${site.email}`" class="font-semibold text-accent-700 underline">
        {{ site.email }}
      </a>
      or call {{ site.phone }}.
    </p>
    <button type="button" class="btn btn-outline mt-6" @click="status = 'idle'">
      Back to the form
    </button>
  </div>

  <!-- The form -->
  <form
    v-else
    class="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-8"
    novalidate
    @submit.prevent="submit"
  >
    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="name" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Name <span class="text-accent-700">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          placeholder="Jane Smith"
          :class="fieldClass('name')"
          :aria-invalid="!!errors.name"
          :data-field-error="errors.name ? '' : undefined"
        />
        <p v-if="errors.name" class="mt-1.5 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label for="phone" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Phone <span class="text-accent-700">*</span>
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="(865) 555-0123"
          :class="fieldClass('phone')"
          :aria-invalid="!!errors.phone"
        />
        <p v-if="errors.phone" class="mt-1.5 text-sm text-red-600">{{ errors.phone }}</p>
      </div>

      <div class="sm:col-span-2">
        <label for="email" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Email <span class="text-accent-700">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="you@example.com"
          :class="fieldClass('email')"
          :aria-invalid="!!errors.email"
        />
        <p v-if="errors.email" class="mt-1.5 text-sm text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="vehicle" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Vehicle <span class="text-accent-700">*</span>
        </label>
        <input
          id="vehicle"
          v-model="form.vehicle"
          type="text"
          placeholder="2019 Mustang GT"
          :class="fieldClass('vehicle')"
          :aria-invalid="!!errors.vehicle"
        />
        <p v-if="errors.vehicle" class="mt-1.5 text-sm text-red-600">{{ errors.vehicle }}</p>
        <p v-else class="mt-1.5 text-[0.8125rem] text-ink-400">Year, make and model.</p>
      </div>

      <div>
        <label for="service" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Service interested in <span class="text-accent-700">*</span>
        </label>
        <select
          id="service"
          v-model="form.service"
          :class="[...fieldClass('service'), form.service ? '' : 'text-ink-400']"
          :aria-invalid="!!errors.service"
        >
          <option value="" disabled>Select a service…</option>
          <option v-for="option in serviceOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <p v-if="errors.service" class="mt-1.5 text-sm text-red-600">{{ errors.service }}</p>
      </div>

      <div class="sm:col-span-2">
        <label for="message" class="mb-1.5 block text-sm font-semibold text-ink-800">
          Anything else?
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="4"
          placeholder="Color or finish you have in mind, timing, condition of the paint…"
          :class="fieldClass('message')"
        />
      </div>

      <!-- Honeypot: hidden from people, catnip for bots -->
      <div class="hidden" aria-hidden="true">
        <label for="company">Company</label>
        <input id="company" v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
      </div>
    </div>

    <p v-if="status === 'error'" class="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      Something went wrong sending that. Please
      <button type="button" class="font-semibold underline" @click="openMailClient">
        email it instead
      </button>
      or call {{ site.phone }}.
    </p>

    <button
      type="submit"
      class="btn btn-primary mt-6 w-full sm:w-auto"
      :disabled="status === 'sending'"
    >
      <BaseIcon
        :name="status === 'sending' ? 'spinner' : 'send'"
        :size="17"
        :class="status === 'sending' && 'animate-spin'"
      />
      {{ status === 'sending' ? 'Sending…' : 'Request My Quote' }}
    </button>

    <p class="mt-4 text-[0.8125rem] leading-relaxed text-ink-400">
      We use your details to respond to this request only — no lists, no sharing. Prefer to talk?
      Call
      <a :href="`tel:${site.phoneHref}`" class="font-semibold text-ink-600 underline">
        {{ site.phone }}
      </a>
      during business hours.
    </p>
  </form>
</template>
