<template lang="pug">
  #home.h-full
    landing-page(v-if="landing")
    .min-h-full.flex.flex-col.bg-blue-300(v-else)
      header
        base-nav-light
      .flex-1.overflow-x-hidden
        main.min-h-45
          transition(name="slide-left" mode="out-in")
            router-view
      base-footer(dark).flex-shrink-0
</template>

<script>
  import LandingPage from '@/views/LandingPage';

  export default {
    name: 'Home',
    metaInfo: {
      title: 'Kenmei | Cross-site manga tracker',
    },
    components: {
      LandingPage,
    },
    data() {
      return {
        landing: false,
      };
    },
    watch: {
      // TODO: Remove when I am able to use transitions from landing page
      // Currently this is required to render landing page without router
      $route(to, _from) {
        this.landing = to.path === '/';
      },
    },
    created() {
      this.landing = window.location.hash === '#/';
    },
  };
</script>
