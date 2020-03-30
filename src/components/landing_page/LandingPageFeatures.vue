<template lang="pug">
  .py-12.bg-white
    .max-w-screen-xl.mx-auto.px-4.sm_px-6.lg_px-8
      .lg_text-center
        p.text-base.leading-6.text-blue-600.font-semibold.tracking-wide.uppercase
          | Your Manga Control Centre
        h3 The best way to read and track manga
      .mt-10
        ul.md_grid.md_grid-cols-2.md_col-gap-8.md_row-gap-10
          li(
            v-for='(feature, index) in features'
            :class="{'mt-10 md_mt-0': index !== 0}"
          )
            .flex
              .flex-shrink-0
                .icon
                  svg.h-6.w-6.stroke-current(fill='none' viewbox='0 0 24 24')
                    path(
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      :d='feature.icon'
                    )
              .ml-4
                h5(v-text="feature.title")
                p.mt-2.text-base.leading-6.text-gray-500(
                  v-text="feature.description"
                )
</template>

<script>
  export default {
    data() {
      return {
        features: [
          {
            title: 'Cross-site tracking',
            description: `
              Forget bookmarking manga and manually checking if a new chapter
              got released. We automatically track manga across many sites, from
              big to small.
            `,
            icon: `
              M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8
              3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0
              012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9
              0 0118 0z
            `,
          },
          {
            title: 'Real-time manga updates',
            description: `
              When latest chapter of your favourite manga gets released,
              we automagically update your dashboard, so that you can jump
              straight into reading.
            `,
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
          },
          {
            title: 'Reliable',
            description: `
              You can trust us to keep your manga list safe. We don't store
              manga chapters, meaning we won't get that DMCA takedown that
              killed your favourite manga provider.
            `,
            icon: `
              M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2
              0 002 2zm10-10V7a4 4 0 00-8 0v4h8z
            `,
          },
          {
            title: 'Smart suggestions',
            description: `
              We do a lot more than just track manga. Smart suggestions can tell
              you if a different site has more chapters than the one you track,
              making sure you are always using the best manga provider.
            `,
            icon: `
              M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4
              12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072
              0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4
              0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z
            `,
          },
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  h3 {
    @apply mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900;

    @screen sm {
      @apply text-4xl leading-10;
    }
  }

  h5 {
    @apply text-lg leading-6 font-medium text-gray-900;
  }

  .icon {
    @apply flex items-center justify-center h-12 w-12 rounded-md;
    @apply bg-blue-500 text-white;
  }
</style>
