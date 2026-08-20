<script setup lang="ts">
/**
 * NOTE FOR THE OWNER
 * ------------------------------------------------------------------
 * Reasonable, plain-English terms for a small shop. Two things to check
 * before you go live: the deposit/cancellation rules (section "Quotes,
 * deposits and payment") and the warranty language — make sure both match
 * what you actually promise customers. A lawyer's read is cheap insurance
 * once you're taking real deposits.
 */
import PageHero from '@/components/PageHero.vue'
import { useSeo } from '@/composables/useSeo'
import { fullAddress, site } from '@/data/site'

useSeo({
  title: 'Terms of Service',
  description: `The terms that apply when you use the ${site.name} website or have work done at our shop.`,
  path: '/terms',
})

const lastUpdated = 'August 2026'
</script>

<template>
  <div>
    <PageHero eyebrow="Legal" title="Terms of Service" />

    <section class="bg-white py-14 sm:py-18">
      <div class="container-page">
        <article class="prose-legal mx-auto max-w-3xl">
          <p class="text-sm text-ink-400">Last updated: {{ lastUpdated }}</p>

          <p>
            These terms apply when you use this website and when {{ site.name }} performs work on
            your vehicle. Using the site means you are okay with what is written here.
          </p>

          <h2>About this website</h2>
          <p>
            We keep the information on this site — services, descriptions, turnaround times and
            comparison ratings — as accurate and current as we can. It is meant to help you
            understand your options, not to serve as a binding offer. Comparison scores are our own
            general assessment of trade-offs between packages, not laboratory measurements.
          </p>

          <h2>Quotes, deposits and payment</h2>
          <ul>
            <li>
              Quotes are estimates based on the information you give us. A final price is confirmed
              after we inspect the vehicle in person.
            </li>
            <li>
              If work reveals something we could not see up front — failing clear coat, prior body
              work, hidden damage — we will stop, tell you, and agree on the change before
              continuing.
            </li>
            <li>
              A deposit may be required to reserve a spot on the schedule. The balance is due before
              the vehicle leaves the shop unless we agree otherwise in writing.
            </li>
            <li>
              If you need to reschedule or cancel, let us know as far ahead as you can so we can
              offer the slot to someone else.
            </li>
          </ul>

          <h2>Condition of your vehicle</h2>
          <p>
            A sprayed coating follows the surface underneath it. Existing chips, dents, scratches,
            orange peel, rust or failing clear coat can telegraph through the finish, and paint that
            is already lifting may come away when a coating is later removed. We will point out
            anything we see before starting, but we cannot be responsible for pre-existing
            conditions or for factory paint that was already failing.
          </p>
          <p>
            Please remove personal belongings before dropping the vehicle off. We are not
            responsible for items left inside.
          </p>

          <h2>Care and warranty</h2>
          <p>
            We stand behind our workmanship. If something is wrong with the work we performed —
            lifting, peeling or a defect in application — bring the vehicle back and we will make it
            right.
          </p>
          <p>This does not cover:</p>
          <ul>
            <li>Damage from collisions, road debris, vandalism, hail or other impacts</li>
            <li>
              Damage from automatic brush washes, high-pressure washing at close range, aggressive
              solvents, polishing compounds or improper care
            </li>
            <li>Normal wear, fading or gradual loss of gloss over the life of the finish</li>
            <li>Issues caused by the condition of the paint underneath the coating</li>
          </ul>
          <p>
            We will go over care instructions at pickup. Following them is what keeps the finish
            looking right.
          </p>

          <h2>Photography</h2>
          <p>
            We may photograph completed work for our portfolio and social media. License plates are
            obscured or cropped. If you would rather we not photograph your vehicle, tell us and we
            will not.
          </p>

          <h2>Vehicle pickup</h2>
          <p>
            Please collect your vehicle promptly once we let you know it is ready. Vehicles left
            well beyond the agreed pickup date may be subject to storage charges.
          </p>

          <h2>Limits of liability</h2>
          <p>
            To the extent allowed by law, our liability for any claim relating to work performed is
            limited to the amount you paid for that work. We are not liable for indirect or
            consequential losses, such as lost time or loss of use.
          </p>

          <h2>Content on this site</h2>
          <p>
            The text, images and design on this website belong to {{ site.name }}. Please do not
            copy or reuse them without permission.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The version posted here when your work is
            booked is the one that applies to that job.
          </p>

          <h2>Questions</h2>
          <p>
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
