<template lang="pug">
  nav.z-20.bg-gray-800(ref="navigation")
    .max-w-7xl.mx-auto.px-2.sm_px-6.lg_px-8
      .relative.flex.items-center.justify-between.h-16
        .absolute.inset-y-0.left-0.flex.items-center.sm_hidden
          template(v-if="signedIn")
            button.btn-menu(@click.stop='menuVisible = !menuVisible')
              base-hamburger-icon(:visible="menuVisible")
        .desktop-links(:class="{ 'flex-initial pl-2': !signedIn }")
          .flex-shrink-0
            router-link(to='/')
              img.block.lg_hidden.h-8.w-auto(
                src='@/assets/dark-mark.svg'
                alt='mark'
              )
              img.hidden.lg_block.h-8.w-auto(
                src='@/assets/dark-logo.svg'
                alt='logo'
              )
          .hidden.sm_block.sm_ml-6(v-if="signedIn")
            .flex
              router-link.desktop-link(
                v-for='(link, index) in MenuLinks'
                :key="index"
                :to="link.href"
                :class="{ 'ml-4': index !== 0 }"
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
            button.btn-avatar(@click='profileVisible = !profileVisible')
              img.h-8.w-8.rounded-full(
                src='@/assets/default-avatar.png'
                alt='avatar'
              )
            transition(
              enter-active-class='transition ease-out duration-100'
              enter-class='transform opacity-0 scale-95'
              enter-to-class='transform opacity-100 scale-100'
              leave-active-class='transition ease-in duration-75'
              leave-class='transform opacity-100 scale-100'
              leave-to-class='transform opacity-0 scale-95'
            )
              .profile-dropdown(v-show='profileVisible')
                .py-1.rounded-md.bg-white.shadow-xs
                  .px-4.py-3
                    p.text-sm.leading-5 Signed in as
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
      .px-2.pt-2.pb-3
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

          const profileEl = this.$refs.profile;

          if (this.profileVisible && !profileEl.contains(event.target)) {
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

  .desktop-links {
    @apply flex-1 flex items-center justify-center;

    @screen sm {
      @apply items-stretch justify-start;
    }
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

  .desktop-link {
    @include link-transition;

    @apply px-3 py-2 rounded-md text-sm font-medium leading-5;
    @apply text-gray-300;

    &:hover {
      @apply text-white bg-gray-700;
    }

    &:focus {
      @apply outline-none text-white bg-gray-700;
    }
  }

  .router-link-active.desktop-link {
    @apply text-white bg-gray-900;

    &:focus {
      @apply outline-none text-white bg-gray-700;
    }
  }

  .mobile-link {
    @include link-transition;

    @apply block px-3 py-2 rounded-md text-base font-medium text-gray-300;

    &:hover {
      @apply text-white bg-gray-700;
    }

    &:focus {
      @apply outline-none text-white bg-gray-700;
    }
  }

  .router-link-active.mobile-link {
    @apply text-white bg-gray-900;

    &:focus {
      @apply outline-none text-white bg-gray-700;
    }
  }

  .profile {
    @apply absolute inset-y-0 right-0 flex items-center pr-2 z-40;

    @screen sm {
      @apply static inset-auto ml-6 pr-0;
    }
  }

  .profile-dropdown {
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    @apply origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg;
  }

  .btn-menu {
    @include link-transition;

    @apply inline-flex items-center justify-center p-2 rounded-md text-gray-400;

    &:hover {
      @apply text-white bg-gray-700;
    }

    &:focus {
      @apply outline-none text-white bg-gray-700;
    }
  }

  .btn-avatar {
    @include link-transition;

    @apply flex text-sm border-2 border-transparent rounded-full;

    &:focus {
      @apply outline-none border-white;
    }
  }
</style>
