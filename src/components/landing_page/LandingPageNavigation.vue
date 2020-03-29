<template lang="pug">
  header
    nav.desktop-nav
      .flex.items-center.flex-1
        .flex.items-center.justify-between.w-full.md_w-auto
          router-link(to="/")
            img.h-8.w-auto.sm_h-10(src='@/assets/light-logo.svg' alt='logo')
          .-mr-2.flex.items-center.md_hidden
            button.btn-menu(@click='open = true' type='button')
              svg.h-6.w-6(stroke='currentColor' fill='none' viewbox='0 0 24 24')
                path(
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M4 6h16M4 12h16M4 18h16'
                )
        .hidden.md_block.md_ml-10
          a.desktop-link(
            v-for='link in links'
            v-text='link.title'
            v-scroll-to="link.href"
            href='#'
          )
      .hidden.md_block.text-right
        span.inline-flex.rounded-md.shadow-md(v-if="signedIn")
          span.inline-flex.rounded-md.shadow-xs
            router-link.desktop-action(to="/manga-list")
              | Go to Dashboard
        template(v-else)
          span.inline-flex.rounded-md.shadow-md
            span.inline-flex.rounded-md.shadow-xs
              button.desktop-action(@click="$emit('signOnOpened', 'TheSignIn')")
                | Log in
          span.ml-5.inline-flex.rounded-md.shadow-md
            span.inline-flex.rounded-md.shadow-xs
              button.desktop-action.text-white.bg-blue-500.hover_bg-blue-600(
                @click="$emit('signOnOpened', 'TheSignUp')"
              )
                | Register
    .mobile-nav(:class="{'block': open, 'hidden': !open}")
      transition(
        enter-active-class='duration-150 ease-out'
        enter-class='opacity-0 scale-95'
        enter-to-class='opacity-100 scale-100'
        leave-active-class='duration-100 ease-in'
        leave-class='opacity-100 scale-100'
        leave-to-class='opacity-0 scale-95'
      )
        .rounded-lg.shadow-md.transition.transform.origin-top-right(
          v-show='open'
        )
          .rounded-lg.bg-white.shadow-xs.overflow-hidden
            .px-5.pt-4.flex.items-center.justify-between
              div
                img.h-8.w-auto(src='@/assets/light-mark.svg' alt='logo')
              .-mr-2
                button.btn-close(@click='open = false' type='button')
                  svg.h-6.w-6.stroke-current(fill='none' viewbox='0 0 24 24')
                    path.stroke-2(
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    )
            .px-2.pt-2.pb-3
              a.mobile-link(
                v-for='link in links'
                v-scroll-to="link.href"
                v-text='link.title'
                href='#'
              )
            .mobile-actions
              template(v-if="signedIn")
                router-link.mobile-action(to="/manga-list")
                  | Go to Dashboard
              template(v-else)
                button.mobile-action(
                  @click="$emit('signOnOpened', 'TheSignIn')"
                )
                  | Log in
                button.mobile-action(
                  @click="$emit('signOnOpened', 'TheSignUp')"
                )
                  | Register
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        open: false,
        loading: false,
        signOnVisible: false,
        activeComponent: 'TheSignIn',
        links: [
          {
            title: 'Features',
            href: '#features',
          },
          {
            title: 'Supported Sites',
            href: '#stats',
          },
        ],
      };
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

  @mixin short-transition {
    @apply transition duration-150 ease-in-out;
  }

  .desktop-nav {
    @apply relative max-w-screen-xl mx-auto flex items-center justify-between;
    @apply px-4;

    @screen sm {
      @apply px-6;
    }
  }

  .mobile-nav {
    @apply absolute top-0 inset-x-0 p-2 z-20;

    @screen md {
      @apply hidden;
    }
  }

  .btn-menu {
    @include short-transition;

    @apply inline-flex items-center justify-center p-2 rounded-md text-gray-400;

    &:hover {
      @apply text-gray-500 bg-gray-100;
    }

    &:focus {
      @apply outline-none bg-gray-100 text-gray-500;
    }
  }

  .btn-close {
    @include short-transition;

    @apply inline-flex items-center justify-center p-2 rounded-md text-gray-400;

    &:hover {
      @apply text-gray-500 bg-gray-100;
    }

    &:focus {
      @apply outline-none bg-gray-100 text-gray-500;
    }
  }

  .desktop-link {
    @include short-transition;

    @apply ml-10 font-medium text-gray-500 transition duration-150 ease-in-out;

    &:hover {
      @apply text-gray-900;
    }

    &:focus {
      @apply outline-none text-gray-900;
    }
  }

  .desktop-action {
    @include short-transition;

    @apply inline-flex items-center px-4 py-2 border border-transparent;
    @apply text-base leading-6 font-medium rounded-md text-blue-600 bg-white;

    &:hover {
      @apply bg-gray-50;
    }

    &:focus {
      @apply outline-none shadow-outline;
    }
  }

  .mobile-link{
    @include short-transition;

    @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700;

    &:hover {
      @apply text-gray-900 bg-gray-50;
    }

    &:focus {
      @apply outline-none text-gray-900 bg-gray-50;
    }
  }

  .mobile-action {
    @include short-transition;

    @apply block w-full px-5 py-3 text-center font-medium text-blue-500;
    @apply bg-gray-50 transition duration-150 ease-in-out;

    &:hover {
      @apply bg-gray-100 text-blue-700;
    }

    &:focus {
      @apply outline-none bg-gray-100 text-blue-700;
    }
  }
</style>
