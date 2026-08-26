<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { addOns, defectOptions, finishes, packages } from "@/data/services";
import { mechanicJobs } from "@/data/mechanic";
import { site } from "@/data/site";
import BaseIcon from "./BaseIcon.vue";
import type { UploadedPhoto } from "@/types";
import PhotoUpload from "./PhotoUpload.vue";

/**
 * WHERE DO SUBMISSIONS GO?
 * ------------------------------------------------------------------
 * To our own /api/contact, which emails the enquiry to info@fusionautolab.com
 * over SMTP. The logic lives in server/contact.ts; it runs as a Netlify
 * Function in production and through a small Vite middleware in dev, so both
 * behave identically. The SMTP_* variables it needs are in .env.example.
 *
 * If the send fails for any reason - SMTP not configured yet, the function not
 * deployed, the visitor's network dropping - the form falls back to opening
 * their email app with every field pre-filled and addressed to the shop, so a
 * broken build still cannot lose an enquiry. Photos cannot ride along on that
 * fallback, so the email says how many were attached and asks for them by
 * reply.
 *
 * WHAT IS REQUIRED
 * Name, phone, email and the vehicle. Everything else is optional on purpose -
 * the service, the finish and the condition are all "if you know", because a
 * customer who does not know yet is exactly who the form should not be turning
 * away.
 */
const mailerUrl = "/api/contact";

/** Included in the notification email, so what we promised is on the record. */
const CONSENT_TEXT =
  "By submitting this form you agree to be contacted about your request.";

const route = useRoute();

const WRAP = "Liquid wrap";
const MECHANIC = "Mechanic work";
const BOTH = "Not sure yet";
const workTypes = [WRAP, MECHANIC, BOTH];

const serviceOptions = [
  ...packages.map((p) => `${p.name} package`),
  ...addOns.map((a) => a.name),
  "Not sure yet — I'd like a recommendation",
];

const finishOptions = [...finishes.map((f) => f.name), "Not sure yet"];

const currentYear = new Date().getFullYear();

const form = reactive({
  name: "",
  email: "",
  phone: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  workType: WRAP,
  service: "",
  finish: "",
  mechanicJob: "",
  mechanicDetail: "",
  defects: [] as string[],
  defectNotes: "",
  message: "",
  /** Honeypot — bots fill it, humans never see it. */
  company: "",
});

const photos = ref<UploadedPhoto[]>([]);

const wantsWrap = computed(
  () => form.workType === WRAP || form.workType === BOTH,
);
const wantsMechanic = computed(
  () => form.workType === MECHANIC || form.workType === BOTH,
);

const errors = reactive<Record<string, string>>({});
const status = ref<"idle" | "sending" | "sent" | "mailto" | "error">("idle");

onMounted(() => {
  // Deep link from a service card: /contact?service=Signature
  const preset = route.query.service;
  if (typeof preset === "string") {
    const match = serviceOptions.find((o) =>
      o.toLowerCase().startsWith(preset.toLowerCase()),
    );
    if (match) {
      form.service = match;
      form.workType = WRAP;
    }
  }
});

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (form.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Please enter a 10-digit phone number.";

  const year = Number(form.vehicleYear);
  if (
    !/^\d{4}$/.test(form.vehicleYear.trim()) ||
    year < 1900 ||
    year > currentYear + 1
  )
    errors.vehicleYear = "Enter a 4-digit year.";
  if (!form.vehicleMake.trim()) errors.vehicleMake = "Enter the make.";
  if (!form.vehicleModel.trim()) errors.vehicleModel = "Enter the model.";

  return Object.keys(errors).length === 0;
};

const vehicleLabel = computed(() =>
  [form.vehicleYear, form.vehicleMake, form.vehicleModel]
    .filter(Boolean)
    .join(" ")
    .trim(),
);

const plainTextBody = computed(() => {
  const lines = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Vehicle: ${vehicleLabel.value || "(not given)"}`,
    `Looking for: ${form.workType}`,
  ];
  if (wantsWrap.value) {
    lines.push(`Service: ${form.service || "(not sure yet)"}`);
    lines.push(`Finish: ${form.finish || "(not sure yet)"}`);
  }
  if (wantsMechanic.value) {
    lines.push(`Mechanic work: ${form.mechanicJob || "(not specified)"}`);
    if (form.mechanicDetail.trim())
      lines.push(`Details: ${form.mechanicDetail.trim()}`);
  }
  lines.push(
    `Condition: ${form.defects.length ? form.defects.join(", ") : "nothing flagged"}`,
  );
  if (form.defectNotes.trim())
    lines.push(`Condition notes: ${form.defectNotes.trim()}`);
  lines.push("", form.message.trim() || "(no additional details)");
  if (photos.value.length) {
    lines.push(
      "",
      `[${photos.value.length} photo(s) were attached to this request but cannot be included in this email — please ask for them by reply.]`,
    );
  }
  return lines.join("\n");
});

const openMailClient = () => {
  const subject = encodeURIComponent(
    `Quote request — ${vehicleLabel.value || "vehicle"} (${form.workType})`,
  );
  window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(plainTextBody.value)}`;
  status.value = "mailto";
};

const submit = async () => {
  const trapped = Boolean(form.company);

  // Honeypot. The trap value is forwarded rather than dropped here - the
  // server answers 200 and sends nothing, which is where spam volume is
  // actually visible. Either way the bot is shown the success screen: one
  // told it failed comes back with a different shape, one told it worked
  // moves on.
  //
  // Validation is skipped for a tripped trap. A bot has filled every field,
  // and showing it which ones it got wrong only tells it what shape to use
  // next time.
  if (!trapped && !validate()) {
    document.querySelector<HTMLElement>("[data-field-error]")?.focus();
    return;
  }

  status.value = "sending";
  try {
    const response = await fetch(mailerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        vehicleYear: form.vehicleYear,
        vehicleMake: form.vehicleMake,
        vehicleModel: form.vehicleModel,
        workType: form.workType,
        // Only send the branch they actually filled in, so the email doesn't
        // carry stale answers from a work type they switched away from.
        service: wantsWrap.value ? form.service : "",
        finish: wantsWrap.value ? form.finish : "",
        mechanicJob: wantsMechanic.value ? form.mechanicJob : "",
        mechanicDetail: wantsMechanic.value ? form.mechanicDetail : "",
        defects: wantsWrap.value ? form.defects : [],
        defectNotes: wantsWrap.value ? form.defectNotes : "",
        message: form.message,
        photos: photos.value.map((p) => ({ name: p.name, dataUrl: p.dataUrl })),
        company: form.company,
        pageUrl: window.location.href,
        consentText: CONSENT_TEXT,
      }),
    });
    const body = await response.json().catch(() => null);
    status.value = response.ok && body?.ok ? "sent" : "error";
  } catch {
    status.value = "error";
  }
};

const reset = () => {
  Object.assign(form, {
    name: "",
    email: "",
    phone: "",
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    workType: WRAP,
    service: "",
    finish: "",
    mechanicJob: "",
    mechanicDetail: "",
    defects: [],
    defectNotes: "",
    message: "",
    company: "",
  });
  photos.value = [];
  status.value = "idle";
};

const fieldClass = (field: string) => [
  "w-full rounded-lg border bg-white px-3.5 py-3 text-[0.9375rem] text-ink-900 transition placeholder:text-ink-400",
  errors[field]
    ? "border-red-400 bg-red-50/40"
    : "border-ink-200 hover:border-ink-300",
];

const legendClass =
  "text-[0.8125rem] font-bold uppercase tracking-wider text-ink-400";
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
      Thanks — we have your details and we will get back to you during business
      hours. If it is urgent, give the shop a call and we will pick it up
      faster.
    </p>
    <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <a :href="`tel:${site.phoneHref}`" class="btn btn-dark">
        <BaseIcon name="phone" :size="16" />
        {{ site.phone }}
      </a>
      <button type="button" class="btn btn-outline" @click="reset">
        Send another request
      </button>
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
    <h3 class="mt-5 text-2xl font-bold text-ink-900">
      Your email is ready to send
    </h3>
    <p class="mx-auto mt-3 max-w-md text-ink-600">
      We opened your email app with everything filled in — just hit send. If
      nothing opened, email us directly at
      <a
        :href="`mailto:${site.email}`"
        class="font-semibold text-accent-700 underline"
      >
        {{ site.email }}
      </a>
      or call {{ site.phone }}.
    </p>
    <p
      v-if="photos.length"
      class="mx-auto mt-3 max-w-md text-[0.9375rem] text-ink-500"
    >
      Your {{ photos.length }} photo{{ photos.length === 1 ? "" : "s" }} can't
      be carried into an email app automatically — attach them to that message
      and we'll have everything.
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
    <!-- ============ About you ============ -->
    <fieldset>
      <legend :class="legendClass">About you</legend>
      <div class="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            for="name"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
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
          <p v-if="errors.name" class="mt-1.5 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label
            for="phone"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
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
          <p v-if="errors.phone" class="mt-1.5 text-sm text-red-600">
            {{ errors.phone }}
          </p>
        </div>

        <div class="sm:col-span-2">
          <label
            for="email"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
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
          <p v-if="errors.email" class="mt-1.5 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>
      </div>
    </fieldset>

    <!-- ============ Vehicle ============ -->
    <fieldset class="mt-8 border-t border-ink-100 pt-7">
      <legend :class="legendClass">Your vehicle</legend>
      <div class="mt-4 grid gap-5 sm:grid-cols-4">
        <div>
          <label
            for="vehicleYear"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Year <span class="text-accent-700">*</span>
          </label>
          <input
            id="vehicleYear"
            v-model="form.vehicleYear"
            type="text"
            inputmode="numeric"
            maxlength="4"
            placeholder="2019"
            :class="fieldClass('vehicleYear')"
            :aria-invalid="!!errors.vehicleYear"
          />
          <p v-if="errors.vehicleYear" class="mt-1.5 text-sm text-red-600">
            {{ errors.vehicleYear }}
          </p>
        </div>

        <div>
          <label
            for="vehicleMake"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Make <span class="text-accent-700">*</span>
          </label>
          <input
            id="vehicleMake"
            v-model="form.vehicleMake"
            type="text"
            placeholder="Ford"
            :class="fieldClass('vehicleMake')"
            :aria-invalid="!!errors.vehicleMake"
          />
          <p v-if="errors.vehicleMake" class="mt-1.5 text-sm text-red-600">
            {{ errors.vehicleMake }}
          </p>
        </div>

        <div class="sm:col-span-2">
          <label
            for="vehicleModel"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Model <span class="text-accent-700">*</span>
          </label>
          <input
            id="vehicleModel"
            v-model="form.vehicleModel"
            type="text"
            placeholder="Mustang GT"
            :class="fieldClass('vehicleModel')"
            :aria-invalid="!!errors.vehicleModel"
          />
          <p v-if="errors.vehicleModel" class="mt-1.5 text-sm text-red-600">
            {{ errors.vehicleModel }}
          </p>
        </div>
      </div>
    </fieldset>

    <!-- ============ What you need ============ -->
    <fieldset class="mt-8 border-t border-ink-100 pt-7">
      <legend :class="legendClass">What you need</legend>

      <div class="mt-4 grid gap-2.5 sm:grid-cols-3">
        <label
          v-for="type in workTypes"
          :key="type"
          class="flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 transition"
          :class="
            form.workType === type
              ? 'border-ink-900 bg-ink-50'
              : 'border-ink-200 hover:border-ink-300'
          "
        >
          <input
            v-model="form.workType"
            type="radio"
            name="workType"
            :value="type"
            class="mt-0.5 h-4 w-4 shrink-0 accent-accent-600"
          />
          <span class="text-[0.9375rem] font-semibold text-ink-800">{{
            type
          }}</span>
        </label>
      </div>

      <!-- Wrap branch -->
      <div v-if="wantsWrap" class="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            for="service"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Service <span class="font-normal text-ink-400">— if you know</span>
          </label>
          <select
            id="service"
            v-model="form.service"
            :class="[
              ...fieldClass('service'),
              form.service ? '' : 'text-ink-400',
            ]"
          >
            <option value="">Not sure yet</option>
            <option
              v-for="option in serviceOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="finish"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Finish <span class="font-normal text-ink-400">— if you know</span>
          </label>
          <select
            id="finish"
            v-model="form.finish"
            :class="[
              ...fieldClass('finish'),
              form.finish ? '' : 'text-ink-400',
            ]"
          >
            <option value="">Not sure yet</option>
            <option
              v-for="option in finishOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <!-- Mechanic branch -->
      <div v-if="wantsMechanic" class="mt-6 grid gap-5">
        <div>
          <label
            for="mechanicJob"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            Type of mechanic work
            <span class="font-normal text-ink-400">— if you know</span>
          </label>
          <select
            id="mechanicJob"
            v-model="form.mechanicJob"
            :class="[
              ...fieldClass('mechanicJob'),
              form.mechanicJob ? '' : 'text-ink-400',
            ]"
          >
            <option value="">Not sure — described below</option>
            <option v-for="job in mechanicJobs" :key="job" :value="job">
              {{ job }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="mechanicDetail"
            class="mb-1.5 block text-sm font-semibold text-ink-800"
          >
            What's it doing?
          </label>
          <textarea
            id="mechanicDetail"
            v-model="form.mechanicDetail"
            rows="3"
            placeholder="Noises, warning lights, when it happens, anything that's already been replaced…"
            :class="fieldClass('mechanicDetail')"
          />
          <p class="mt-1.5 text-[0.8125rem] text-ink-400">
            We don't have the equipment for every job on every vehicle — the
            more you tell us, the faster we can say yes or point you somewhere
            better.
          </p>
        </div>
      </div>
    </fieldset>

    <!-- ============ Condition ============ -->
    <fieldset v-if="wantsWrap" class="mt-8 border-t border-ink-100 pt-7">
      <legend :class="legendClass">Condition of the paint</legend>
      <p class="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">
        A sprayed coating follows whatever is underneath it, so anything here
        changes the quote. Tick what applies — if you're not sure, leave it
        blank and we'll take a look.
      </p>

      <div class="mt-4 grid gap-2.5 sm:grid-cols-2">
        <label
          v-for="defect in defectOptions"
          :key="defect"
          class="flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition"
          :class="
            form.defects.includes(defect)
              ? 'border-ink-900 bg-ink-50'
              : 'border-ink-200 hover:border-ink-300'
          "
        >
          <input
            v-model="form.defects"
            type="checkbox"
            :value="defect"
            class="mt-0.5 h-4 w-4 shrink-0 accent-accent-600"
          />
          <span class="text-[0.9375rem] text-ink-700">{{ defect }}</span>
        </label>
      </div>

      <div class="mt-5">
        <label
          for="defectNotes"
          class="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          Where is it, and how bad?
        </label>
        <textarea
          id="defectNotes"
          v-model="form.defectNotes"
          rows="3"
          placeholder="Rust along the bottom of both doors, clear coat lifting on the roof…"
          :class="fieldClass('defectNotes')"
        />
      </div>

      <div class="mt-5">
        <span class="mb-1.5 block text-sm font-semibold text-ink-800"
          >Photos</span
        >
        <p class="mb-3 text-[0.8125rem] leading-relaxed text-ink-500">
          The single most useful thing you can send. A few shots of the problem
          areas usually mean we can quote without you driving over.
        </p>
        <PhotoUpload v-model="photos" />
      </div>
    </fieldset>

    <!-- ============ Anything else ============ -->
    <fieldset class="mt-8 border-t border-ink-100 pt-7">
      <legend :class="legendClass">Anything else</legend>
      <div class="mt-4">
        <label
          for="message"
          class="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          Notes
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="4"
          placeholder="Color you have in mind, timing, whether the vehicle is a daily driver…"
          :class="fieldClass('message')"
        />
      </div>

      <!-- Photos live here when the paint-condition section isn't showing -->
      <div v-if="!wantsWrap" class="mt-5">
        <span class="mb-1.5 block text-sm font-semibold text-ink-800"
          >Photos</span
        >
        <p class="mb-3 text-[0.8125rem] leading-relaxed text-ink-500">
          Optional, but a picture of the problem often saves a phone call.
        </p>
        <PhotoUpload v-model="photos" />
      </div>

      <!-- Honeypot: hidden from people, catnip for bots -->
      <div class="hidden" aria-hidden="true">
        <label for="company">Company</label>
        <input
          id="company"
          v-model="form.company"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
    </fieldset>

    <p
      v-if="status === 'error'"
      class="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      Something went wrong sending that. Please
      <button
        type="button"
        class="font-semibold underline"
        @click="openMailClient"
      >
        email it instead
      </button>
      or call {{ site.phone }}.
    </p>

    <!-- Shown above the button and sent with the request, so the record says
         what the visitor was actually asked to agree to. -->
    <p class="mt-6 text-[0.8125rem] leading-relaxed text-ink-500">
      {{ CONSENT_TEXT }}
    </p>

    <button
      type="submit"
      class="btn btn-primary mt-4 w-full sm:w-auto"
      :disabled="status === 'sending'"
    >
      <BaseIcon
        :name="status === 'sending' ? 'spinner' : 'send'"
        :size="17"
        :class="status === 'sending' && 'animate-spin'"
      />
      {{ status === "sending" ? "Sending…" : "Request My Quote" }}
    </button>

    <p class="mt-4 text-[0.8125rem] leading-relaxed text-ink-400">
      We use your details to respond to this request only — no lists, no
      sharing. Prefer to talk? Call
      <a
        :href="`tel:${site.phoneHref}`"
        class="font-semibold text-ink-600 underline"
      >
        {{ site.phone }}
      </a>
      during business hours.
    </p>
  </form>
</template>
