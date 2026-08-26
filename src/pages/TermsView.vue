<script setup lang="ts">
/**
 * NOTE FOR THE OWNER — PLEASE READ THROUGH AND EDIT
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

          <p>
            The shop does two kinds of work — liquid wrapping and general mechanical repair. The
            sections marked <strong>Mechanical repair work</strong> and
            <strong>Liquid wrap work</strong> apply to those jobs specifically; everything else
            applies to both.
          </p>

          <h2>About this website</h2>
          <p>
            We keep the information on this site — services, descriptions and turnaround times —
            as accurate and current as we can. It is meant to help you understand your options,
            not to serve as a binding offer.
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

          <h2>Mechanical repair work</h2>
          <p>
            Repair labor is billed at our posted hourly rate. Time spent diagnosing a problem is
            labor like any other, and is billed the same way — finding the fault is usually the
            hard part of the job.
          </p>
          <ul>
            <li>
              <strong>Authorization.</strong> No work begins without your go-ahead. We will tell you
              what we think the job involves and roughly what it will run before we start.
            </li>
            <li>
              <strong>Changes mid-job.</strong> If we get into a repair and find it needs more time,
              more parts, or a different fix than expected, we stop and call you. You decide whether
              to go ahead before any additional work happens.
            </li>
            <li>
              <strong>Estimates are estimates.</strong> A vehicle can hide a seized bolt, a stripped
              thread or a second failure behind the first one. We will always tell you as soon as we
              know, rather than absorbing it quietly or springing it on you at pickup.
            </li>
            <li>
              <strong>Work we cannot take on.</strong> We do not have the equipment for every job on
              every vehicle, and we will say so rather than attempt something we cannot do properly.
              Call before bringing a vehicle in and we will tell you straight away.
            </li>
          </ul>

          <h2>Parts</h2>
          <ul>
            <li>
              Parts are billed on top of labor. Where a part carries a manufacturer's warranty, that
              warranty passes to you — we are not the manufacturer and cannot extend it.
            </li>
            <li>
              <strong>Parts you supply yourself.</strong> You are welcome to bring your own parts,
              but tell us before the job is scheduled. We cannot warranty a part we did not supply,
              and if a customer-supplied part fails, is incorrect, or does not fit, the labor to
              remove and replace it is billed again at the normal rate.
            </li>
            <li>Old parts are disposed of unless you ask for them back before the work starts.</li>
          </ul>

          <h2>Warranty on repair work</h2>
          <p>
            We stand behind our labor. If a repair we carried out fails because of how it was done,
            bring the vehicle back and we will put it right. Where the part itself is what failed,
            the manufacturer's warranty on that part applies, and we will help you make that claim.
          </p>
          <p>
            This does not cover parts you supplied yourself, a separate fault that happens to appear
            after an unrelated repair, damage from continuing to drive a vehicle we advised against
            driving, or normal wear.
          </p>

          <h2>Repairs you decide not to go ahead with</h2>
          <p>
            If we have already taken something apart to diagnose or reach a fault and you decide not
            to proceed, the time spent — including putting the vehicle back together — is billed at
            the normal hourly rate. We will tell you where you stand before that becomes a
            significant number.
          </p>

          <h2>Test drives</h2>
          <p>
            Some faults only show up under load. By leaving a vehicle for repair you are agreeing
            that we may drive it on public roads as needed to diagnose the problem and confirm the
            repair worked.
          </p>

          <h2>Referral commission</h2>
          <p>
            If you send us work, we pay 10% of the labor on that job — labor only, not parts — once
            the customer has paid in full. If the job does not go ahead, or the invoice is never
            settled, no commission is due. There is no cap and no sign-up: tell whoever you refer to
            mention your name.
          </p>

          <h2>Liquid wrap work</h2>
          <p>The three sections that follow apply to liquid wrap jobs specifically.</p>

          <h3>Condition of your vehicle</h3>
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

          <h3>Warranty on wrap work</h3>
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

          <h3>Photography</h3>
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
