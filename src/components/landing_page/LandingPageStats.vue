<template lang="pug">
  .bg-gray-50.pt-12.sm_pt-16
    .max-w-screen-xl.mx-auto.px-4.sm_px-6.lg_px-8
      .max-w-4xl.mx-auto.text-center
        h2 Track manga series across sites
        p.mt-3.text-xl.leading-7.text-gray-500.sm_mt-4
          | Get latest releases from supported sites hourly.
          br
          | With new sites added montly, always stay up to date with your
          | favourite series
        .mx-auto.text-center.mt-5.sm_max-w-xs
          router-link.btn-action(to="/supported-sites")
            | Check all supported sites
    .mt-10.pb-12.bg-white.sm_pb-16
      .relative
        .absolute.inset-0.bg-gray-50(class='h-1/2')
        .relative.max-w-screen-xl.mx-auto.px-4.sm_px-6.lg_px-8
          .max-w-4xl.mx-auto
            .rounded-lg.bg-white.shadow-lg.sm_grid.sm_grid-cols-3
              .border-b.border-gray-100.p-6.text-center.sm_border-0.sm_border-r
                p.text-5xl.leading-none.font-extrabold.text-blue-600
                  | 6968
                p.mt-2.text-lg.leading-6.font-medium.text-gray-500
                  | Manga Series Tracked
              .border-t.border-b.border-gray-100.p-6.text-center.sm_border-0.sm_border-l.sm_border-r
                p.text-5xl.leading-none.font-extrabold.text-blue-600
                  | 30061
                p.mt-2.text-lg.leading-6.font-medium.text-gray-500
                  | Manga Entries Created
              .border-t.border-gray-100.p-6.text-center.sm_border-0.sm_border-l
                p.text-5xl.leading-none.font-extrabold.text-blue-600
                  | 10
                p.mt-2.text-lg.leading-6.font-medium.text-gray-500
                  | Supported Sites
</template>

<style lang="scss" scoped>
  @tailwind base;

  h2 {
    @apply text-3xl leading-9 font-extrabold text-gray-900;

    @screen sm {
      @apply text-4xl leading-10;
    }
  }

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
</style>
