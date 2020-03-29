<template lang="pug">
  .bg-white.pb-12
    .cta-content
      h2
        | Ready to dive in?
        br
        span.text-blue-600 Start tracking manga today.
      .mt-8.flex.lg_flex-shrink-0.lg_mt-0
        .inline-flex.rounded-md.shadow.max-sm_w-full
          router-link.btn-action(v-if="signedIn" to="/manga-list")
            | Get started
          button.btn-action(
            v-else
            @click="$emit('signOnOpened', 'TheSignUp')"
          )
            | Get started
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  h2 {
    @apply text-3xl leading-9 font-extrabold tracking-tight text-gray-900;

    @screen sm {
      @apply text-4xl leading-10;
    }
  }

  .btn-action {
    @apply inline-flex items-center justify-center px-5 py-3 font-medium;
    @apply border border-transparent text-base leading-6 rounded-md;
    @apply text-white bg-blue-600 transition duration-150 ease-in-out;

    &:hover {
      @apply bg-blue-500;
    }

    &:focus {
      @apply outline-none shadow-outline;
    }

    @screen max-sm {
      @apply w-full;
    }
  }


  .cta-content {
    @apply max-w-screen-xl mx-auto py-12 px-4;

    @screen sm {
      @apply px-6;
    }

    @screen lg {
      @apply py-16 px-8 flex items-center justify-around;
    }
  }
</style>
