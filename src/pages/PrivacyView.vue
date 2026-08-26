<script setup lang="ts">
/**
 * NOTE FOR THE OWNER
 * ------------------------------------------------------------------
 * This is a plain-English starting point that matches how the site actually
 * works today (a contact form that emails you, no accounts, no ad tracking).
 * If you later add analytics, ads, or online payments taken on the site
 * itself, update the relevant sections — and have a lawyer look it over if
 * you start collecting anything sensitive.
 */
import PageHero from '@/components/PageHero.vue'
import { useSeo } from '@/composables/useSeo'
import { fullAddress, site } from '@/data/site'

useSeo({
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses and protects the information you send through this website.`,
  path: '/privacy',
})

const lastUpdated = 'August 2026'
</script>

<template>
  <div>
    <PageHero eyebrow="Legal" title="Privacy Policy" />

    <section class="bg-white py-14 sm:py-18">
      <div class="container-page">
        <article class="prose-legal mx-auto max-w-3xl">
          <p class="text-sm text-ink-400">Last updated: {{ lastUpdated }}</p>

          <p>
            {{ site.name }} respects your privacy. This page explains what information this website
            collects, why we collect it, and what we do with it. In short: we only ask for what we
            need to quote your job and get back to you, and we do not sell or share it.
          </p>

          <h2>Information we collect</h2>
          <p>
            The only information this site collects is what you type into the quote form and send to
            us. That includes:
          </p>
          <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your phone number</li>
            <li>Your vehicle (year, make and model)</li>
            <li>The service and finish you are interested in, if you know</li>
            <li>What you tell us about the condition of the vehicle</li>
            <li>Any photos of the vehicle you choose to attach</li>
            <li>Any other details you add</li>
          </ul>
          <p>
            We do not ask for payment card numbers, financial account details, government ID
            numbers, or any other sensitive personal information through this website.
          </p>
          <p>
            Photos are optional and entirely your choice. They are attached to the email that
            reaches the shop and are used only to understand the work you are asking about. Please
            do not include anything in shot you would not want us to have — a licence plate, for
            instance, is never something we need.
          </p>

          <h2>How we use it</h2>
          <p>
            We use your information for one purpose: to respond to your request and, if you book,
            to carry out the work and stay in touch about it. Specifically, we may use it to:
          </p>
          <ul>
            <li>Prepare and send you a quote</li>
            <li>Contact you by phone, text or email about your request or your vehicle</li>
            <li>Schedule work and follow up after a job is complete</li>
          </ul>
          <p>
            We do not add you to a marketing list without asking, and we do not sell, rent or trade
            your information to anyone.
          </p>

          <h2>Who else sees it</h2>
          <p>
            Form submissions are delivered to our business email inbox. Depending on how the form is
            configured, they may pass through a form-delivery service that handles nothing but
            passing the message along. We may also share information where we are legally required
            to, or where it is necessary to protect our rights.
          </p>

          <h2>Cookies and tracking</h2>
          <p>
            This site does not use advertising cookies and does not build a profile of you across
            other websites. Your browser may store basic technical data needed to display the page,
            and our web host may keep standard server logs (such as IP addresses and page requests)
            for security and reliability.
          </p>
          <p>
            Some pages embed third-party content — for example a map of our shop location. Those
            providers have their own privacy practices, which apply when their content loads.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep quote requests and job records for as long as we need them to run the business
            and meet our record-keeping obligations. If you would like us to delete your
            information, just ask.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us at any time to tell you what information we hold about you, correct it,
            or delete it. You can also ask us to stop contacting you. Email
            <a :href="`mailto:${site.email}`" class="font-semibold text-accent-700 underline">
              {{ site.email }}
            </a>
            or call {{ site.phone }} and we will take care of it.
          </p>

          <h2>Children</h2>
          <p>
            This website is intended for adults arranging automotive work. We do not knowingly
            collect information from children.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If we change how we handle information, we will update this page and the date at the
            top. Continuing to use the site after a change means the updated policy applies.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about this policy? Reach out any time.<br />
            {{ site.name }}<br />
            {{ fullAddress }}<br />
            {{ site.phone }} ·
            <a :href="`mailto:${site.email}`" class="font-semibold text-accent-700 underline">
              {{ site.email }}
            </a>
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
