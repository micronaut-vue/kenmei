<template lang="pug">
  transition(name="fade-out-up" mode="out-in")
    .max-w-screen-xl.mx-auto(v-if="visible")
      .p-2.rounded-lg.bg-blue-500.shadow-lg.sm_p-3
        .flex.items-center.justify-between.flex-wrap
          .w-0.flex-1.flex.items-center
            span.flex.p-2.rounded-lg.bg-blue-700
              svg.h-6.w-6.text-white.stroke-current(
                fill='none'
                viewbox='0 0 24 24'
              )
                path(
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  :d='hornIconSvg'
                )
            p.ml-3.font-medium.text-white.truncate
              span(class='md_hidden')
                | New update released!
              span.hidden(class='md_inline' v-text="text")
          .order-3.mt-2.flex-shrink-0.w-full.sm_order-2.sm_mt-0.sm_w-auto
            .rounded-md.shadow-sm
              a(
                rel="noreferrer"
                target="_blank"
                href='https://news.kenmei.co/updates/2020/update-12'
              ) Learn more
          .order-2.flex-shrink-0.sm_order-3.sm_ml-2
            button(type='button' @click="$emit('bannerClose')")
              svg.h-6.w-6.text-white.stroke-current(
                fill='none'
                viewbox='0 0 24 24'
              )
                path(
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M6 18L18 6M6 6l12 12'
                )
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        hornIconSvg: `M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18
          13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0
          7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0
          01-1.564-.317z`,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  .fade-out-up-leave-active {
    @apply transition ease-in duration-300 transition-all overflow-hidden;
  }

  .fade-out-up-leave-active { @apply opacity-0 transform -translate-y-8;}

  button {
    @apply -mr-1 flex p-2 rounded-md transition ease-in-out duration-150;

    &:hover {
      @apply bg-blue-400;
    }

    &:focus {
      @apply outline-none bg-blue-400;
    }
  }

  a {
    @apply flex items-center justify-center px-4 py-2 border border-transparent;
    @apply text-sm leading-5 font-medium rounded-md text-blue-600 bg-white;
    @apply transition ease-in-out duration-150;

    &:hover {
      @apply text-blue-500;
    }

    &:focus {
      @apply outline-none shadow-outline;
    }
  }
</style>
