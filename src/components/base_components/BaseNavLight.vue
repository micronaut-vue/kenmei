<template lang="pug">
  nav.z-20.bg-white.shadow
    .max-w-7xl.mx-auto.px-2.sm_px-6.lg_px-8
      .relative.flex.justify-between.h-16
        .absolute.inset-y-0.left-0.flex.items-center.sm_hidden
          template(v-if="signedIn")
            button.btn-menu(@click.stop='menuVisible = !menuVisible')
              base-hamburger-icon(:visible="menuVisible")
        .desktop-links(:class="{ 'flex-initial pl-2': !signedIn }")
          .flex-shrink-0.flex.items-center
            router-link(to='/')
              img.block.h-8.w-auto.lg_hidden(
                src='@/assets/light-mark.svg'
                alt='mark'
              )
              img.hidden.h-8.w-auto.lg_block(
                src='@/assets/light-logo.svg'
                alt='logo'
              )
          .hidden.sm_ml-6.sm_flex(v-if="signedIn")
            router-link.desktop-link(
              v-for='(link, index) in MenuLinks'
              :key="index"
              :to="link.href"
              :class="{ 'ml-8': index !== 0 }"
              v-text="link.title"
              exact
            )
        .profile(ref="profile")
          template(v-if="!signedIn")
            base-button.text-sm.leading-5.font-medium(
              ref="signInButton"
              type="secondary"
              @click="openSignOnWith('TheSignIn')"
            ) Sign In
            base-button.text-sm.leading-5.font-medium.ml-3.bg-blue-500.hover_bg-blue-400(
              ref="signUpButton"
              @click="openSignOnWith('TheSignUp')"
            ) Register
          .relative(v-else)
            div
              button.btn-avatar(@click='profileVisible = !profileVisible')
                img.h-8.w-8.rounded-full(
                  src='@/assets/default-avatar.png'
                  alt='avatar'
                )
            transition(
              enter-active-class='transition ease-out duration-200'
              enter-class='transform opacity-0 scale-95'
              enter-to-class='transform opacity-100 scale-100'
              leave-active-class='transition ease-in duration-75'
              leave-class='transform opacity-100 scale-100'
              leave-to-class='transform opacity-0 scale-95'
            )
              .profile-dropdown(v-show='profileVisible')
                .py-1.rounded-md.bg-white.shadow-xs
                  .px-4.py-3
                    p.text-sm.leading-5
                      | Signed in as
                    p.text-sm.leading-5.font-medium.text-gray-900(
                      v-text="currentUser.email"
                    )
                  .border-t.border-gray-100
                  router-link.profile-link(
                    v-for='(link, index) in profileLinks'
                    :key="index"
                    :to='link.href'
                    v-text="link.title"
                    exact
                  )
    .menu-dropdown.sm_hidden(v-if="signedIn" v-show="menuVisible")
      .pt-2.pb-4
        router-link.mobile-link(
          v-for='(link, index) in MenuLinks'
          :key="index"
          :to="link.href"
          :class="{ 'mt-1': index !== 0 }"
          v-text="link.title"
          exact
        )
    base-modal(
      v-if="!signedIn"
      :visible="signOnVisible"
      :loading="signOnLoading"
      @dialogClosed="signOnVisible = false"
      size="xs"
    )
      template(slot='body')
        component(
          :is='activeSignOnComponent'
          @componentChanged='activeSignOnComponent = $event'
          @signOnFinished='signOnVisible = false'
          @loading='signOnLoading = $event'
        )
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';

  import TheResetPassword from '@/components/TheResetPassword';
  import TheSignIn from '@/components/TheSignIn';
  import TheSignUp from '@/components/TheSignUp';

  export default {
    components: {
      TheResetPassword,
      TheSignUp,
      TheSignIn,
    },
    data() {
      return {
        menuVisible: false,
        profileVisible: false,
        signOnVisible: false,
        signOnLoading: false,
        activeSignOnComponent: 'TheSignIn',
        profileLinks: {
          signOut: { title: 'Sign Out', href: '/sign-out' },
        },
        MenuLinks: [
          { title: 'Dashboard', href: '/manga-list' },
          { title: 'Supported sites', href: '/supported-sites' },
        ],
      };
    },
    computed: {
      ...mapState('user', [
        'currentUser',
      ]),
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
    mounted() {
      if (this.signedIn) {
        document.addEventListener('click', (event) => {
          event.stopPropagation();

          const { profile } = this.$refs;

          if (this.profileVisible && !profile.contains(event.target)) {
            this.profileVisible = false;
          }


          if (this.menuVisible) { this.menuVisible = false; }
        });
      }
    },
    methods: {
      ...mapActions('user', [
        'signOut',
      ]),
      openSignOnWith(comp) {
        this.activeSignOnComponent = comp;
        this.signOnVisible = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  @mixin link-transition {
    @apply transition duration-150 ease-in-out;
  }

  .btn-menu {
    @include link-transition;

    @apply inline-flex items-center justify-center p-2 rounded-md text-gray-400;

    &:hover {
      @apply text-gray-500 bg-gray-100;
    }

    &:focus {
      @apply outline-none bg-gray-100 text-gray-500;
    }
  }

  .btn-avatar {
    @include link-transition;

    @apply flex text-sm border-2 border-transparent rounded-full;

    &:focus {
      @apply outline-none border-gray-300;
    }
  }

  .profile {
    @apply absolute inset-y-0 right-0 flex items-center pr-2;

    @screen sm {
      @apply static inset-auto ml-6 pr-0;
    }
  }

  .profile-dropdown {
    @apply origin-top-right absolute right-0 mt-2;
    @apply w-56 rounded-md shadow-lg z-20;

    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
  }

  .profile-link {
    @include link-transition;

    @apply block px-4 py-2 text-sm leading-5 text-gray-700;

    &:hover {
      @apply bg-gray-100;
    }

    &:focus {
      @apply outline-none bg-gray-100;
    }
  }

  .desktop-links {
    @apply flex-1 flex items-center justify-center;

    @screen sm {
      @apply items-stretch justify-start;
    }
  }

  .desktop-link {
    @include link-transition;

    @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent;
    @apply text-sm font-medium leading-5 text-gray-500;

    &:hover {
      @apply text-gray-700 border-gray-300;
    }

    &:focus {
      @apply outline-none text-gray-700 border-gray-300;
    }
  }

  .router-link-active.desktop-link {
    @apply border-blue-500 text-gray-900;

    &:focus {
      @apply outline-none border-blue-700;
    }
  }

  .mobile-link {
    @include link-transition;

    @apply block pl-3 pr-4 py-2 border-l-4 border-transparent text-base;
    @apply font-medium text-gray-600;

    &:hover {
      @apply text-gray-800 bg-gray-50 border-gray-300;
    }

    &:focus {
      @apply outline-none text-gray-800 bg-gray-50 border-gray-300;
    }
  }

  .router-link-active.mobile-link {
    @apply border-blue-500 text-blue-700 bg-blue-50;

    &:focus {
      @apply outline-none text-blue-800 bg-blue-100 border-blue-700;
    }
  }
</style>
