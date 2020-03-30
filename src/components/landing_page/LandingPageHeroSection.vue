<template lang="pug">
  .relative.bg-white.overflow-hidden
    .hidden.lg_block.lg_absolute.lg_inset-0
      pattern-desktop
    .relative.pt-6.pb-16.md_pb-20.lg_pb-24.xl_pb-32
      navigation(@signOnOpened="$emit('signOnOpened', $event)")
      .mt-8.mx-auto.max-w-screen-2xl.px-4.sm_mt-12.sm_px-6.md_mt-20.xl_mt-24
        .lg_grid.lg_grid-cols-12.lg_gap-8
          .hero-text
            .secondary-text Currently in alpha
            h2
              | Cross-site
              br.md_inline
              span.text-blue-600 manga tracker
            p
              | Read and manage your manga collection in a single place.
              | Integrated with manga sites big and small, always
              | stay up to date with your favourite manga series.
            .mt-5.sm_max-w-lg.sm_mx-auto.sm_text-center.lg_text-left.lg_mx-0
              router-link.btn-action(v-if="signedIn" to="/manga-list")
                | Start tracking now
              button.btn-action(
                v-else
                type='submit'
                @click="$emit('signOnOpened', 'TheSignUp')"
              )
                | Start tracking now
          .dashboard-preview
            mobile-pattern
            .relative.mx-auto.w-full.rounded-lg.shadow-lg.lg_max-w-6xl
              img.w-full.rounded(
                src='@/assets/dashboard-preview.jpg'
                alt='Manga List preview'
              )
</template>

<script>
  import { mapGetters } from 'vuex';

  import Navigation from './LandingPageNavigation';
  import PatternDesktop from './LandingPageHeroSectionPatternDesktop';
  import MobilePattern from './LandingPageHeroSectionPatternMobile';

  export default {
    components: {
      Navigation,
      PatternDesktop,
      MobilePattern,
    },
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  .btn-action {
    @apply mt-3 w-full px-6 py-3 border border-transparent text-base leading-6;
    @apply font-medium rounded-md text-white bg-blue-500 shadow-sm transition;
    @apply duration-150 ease-in-out;

    &:hover {
      @apply bg-blue-600;
    }

    &:focus {
      @apply outline-none shadow-outline;
    }

    &:active {
      @apply bg-blue-900;
    }

    @screen sm {
      @apply mt-0 flex-shrink-0 inline-flex items-center w-auto;
    }
  }

  h2 {
    @apply mt-1 text-4xl tracking-tight leading-10 font-extrabold text-gray-900;

    @screen sm {
      @apply leading-none text-6xl;
    }

    @screen lg {
      @apply text-5xl;
    }

    @screen xl {
      @apply text-6xl;
    }
  }

  p {
    @apply  mt-3 text-base text-gray-600 leading-7 font-light;

    @screen sm {
      @apply mt-5 text-xl;
    }

    @screen lg {
      @apply text-lg;
    }

    @screen xl {
      @apply text-xl;
    }
  }

  .dashboard-preview {
    @apply mt-12 relative;

    @screen sm {
      @apply max-w-lg mx-auto;
    }

    @screen lg {
      @apply mt-0 max-w-none mx-0 col-span-6 flex items-center;
    }
  }

  .hero-text {
    @screen sm {
      @apply text-center;
    }

    @screen md {
      @apply max-w-2xl mx-auto;
    }

    @screen lg {
      @apply col-span-6 text-left;
    }
  }

  .secondary-text {
    @apply text-sm font-semibold uppercase tracking-wide text-gray-500;

    @screen sm {
      @apply text-base;
    }

    @screen lg {
      @apply text-sm;
    }

    @screen xl {
      @apply text-base;
    }
  }
</style>
