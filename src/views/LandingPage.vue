<template lang="pug">
  #landing-page.font-sans
    hero-section(@signOnOpened="openSignOnWith($event)")
    features#features
    stats#stats
    call-to-action(@signOnOpened="openSignOnWith($event)")
    base-footer
    base-modal(
      :visible="signOnVisible"
      :loading="loading"
      @dialogClosed="signOnVisible = false"
      size="xs"
    )
      template(slot='body')
        component(
          :is='activeComponent'
          @componentChanged='activeComponent = $event'
          @signOnFinished='signOnVisible = false'
          @loading='loading = $event'
        )
</template>

<script>
  import { mapGetters } from 'vuex';

  import HeroSection from '@/components/landing_page/LandingPageHeroSection';
  import Features from '@/components/landing_page/LandingPageFeatures';
  import Stats from '@/components/landing_page/LandingPageStats';
  import CallToAction from '@/components/landing_page/LandingPageCTA';
  import TheSignIn from '@/components/TheSignIn';
  import TheSignUp from '@/components/TheSignUp';
  import TheResetPassword from '@/components/TheResetPassword';

  export default {
    components: {
      HeroSection,
      Features,
      Stats,
      CallToAction,
      TheSignIn,
      TheSignUp,
      TheResetPassword,
    },
    data() {
      return {
        open: false,
        loading: false,
        signOnVisible: false,
        activeComponent: 'TheSignUp',
      };
    },
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
    methods: {
      openSignOnWith(comp) {
        this.activeComponent = comp;
        this.signOnVisible = true;
      },
    },
  };
</script>
