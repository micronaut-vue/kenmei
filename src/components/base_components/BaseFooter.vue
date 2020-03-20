<template lang="pug">
  footer.bg-gray-800
    .max-w-screen-xl.mx-auto.py-12.px-4.sm_px-6.lg_px-8
      .xl_grid.xl_grid-cols-3.xl_gap-8
        .grid.grid-cols-2.gap-8.xl_col-span-2
          .md_grid.md_grid-cols-2.md_gap-8
            div(
              v-for='(group, name, index) in linkGroupOne'
              :class="{'mt-12 md_mt-0': index !== 0}"
            )
              h4(v-text="group.heading")
              ul.mt-4
                li(
                  v-for='(link, name, index) in group.links'
                  :class="{'mt-4': index !== 0}"
                )
                  router-link.link(:to="link.href" v-text="link.heading")
          .md_grid.md_grid-cols-2.md_gap-8
            div(
              v-for='(group, name, index) in linkGroupTwo'
              :class="{'mt-12 md_mt-0': index !== 0}"
            )
              h4(v-text="group.heading")
              ul.mt-4
                li(
                  v-for='(link, name, index) in group.links'
                  :class="{'mt-4': index !== 0}"
                )
                  router-link.link(:to="link.href" v-text="link.heading")
        .mt-8.xl_mt-0
          h4(v-text="subscribe.heading")
          p.mt-4.text-gray-300.text-base.leading-6(v-text="subscribe.paragraph")
          form.mt-4.sm_flex.sm_max-w-md(
            action='https://tinyletter.com/kenmei'
            method='post'
            target='popupwindow'
            v-on:submit="openNewsletterWindow"
          )
            input.placeholder-gray-500.focus_placeholder-gray-400(
              aria-label='Email address'
              name='email'
              type='email'
              placeholder='Enter your email'
              required
            )
            input(type='hidden', value='1', name='embed')
            .mt-3.rounded-md.shadow.sm_mt-0.sm_ml-3.sm_flex-shrink-0
              button(type="submit" v-text="subscribe.buttonText")
      .socials-with-copyright
        .flex.md_order-2
          a.text-gray-400.hover_text-gray-300(
            v-for='(social, name, index) in socials'
            target="_blank"
            :href='social.href'
            :class="{'ml-6': index !== 0}"
          )
            span.sr-only(v-text="social.heading")
            span(v-html='social.icon')
        p.mt-8.text-base.leading-6.text-gray-400.md_mt-0.md_order-1
          | &copy; {{ copyrightYear }} {{ companyName }}. All rights reserved.
</template>

<script>
  // TODO: Extract into inline svg that can be imported
  /* eslint-disable max-len */
  const svgIcons = {
    twitter: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>',
    github: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>',
    discord: '<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="m3.58 21.196h14.259l-.681-2.205 1.629 1.398 1.493 1.338 2.72 2.273v-21.525c-.068-1.338-1.22-2.475-2.648-2.475l-16.767.003c-1.427 0-2.585 1.139-2.585 2.477v16.24c0 1.411 1.156 2.476 2.58 2.476zm10.548-15.513-.033.012.012-.012zm-7.631 1.269c1.833-1.334 3.532-1.27 3.532-1.27l.137.135c-2.243.535-3.26 1.537-3.26 1.537s.272-.133.747-.336c3.021-1.188 6.32-1.102 9.374.402 0 0-1.019-.937-3.124-1.537l.186-.183c.291.001 1.831.055 3.479 1.26 0 0 1.844 3.15 1.844 7.02-.061-.074-1.144 1.666-3.931 1.726 0 0-.472-.534-.808-1 1.63-.468 2.24-1.404 2.24-1.404-.535.337-1.023.537-1.419.737-.609.268-1.219.4-1.828.535-2.884.468-4.503-.315-6.033-.936l-.523-.266s.609.936 2.174 1.404c-.411.469-.818 1.002-.818 1.002-2.786-.066-3.802-1.806-3.802-1.806 0-3.876 1.833-7.02 1.833-7.02z"/><path d="m14.308 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.576-1.335-1.29-1.335v.003c-.708 0-1.288.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/><path d="m9.69 12.771c.711 0 1.29-.6 1.29-1.34 0-.735-.575-1.335-1.286-1.335l-.004.003c-.711 0-1.29.598-1.29 1.338 0 .734.579 1.334 1.29 1.334z"/></svg>',
  };
  /* eslint-enable indent */

  export default {
    props: {
      companyName: { type: String, default: 'Studio Shogun, LTD' },
      copyrightYear: { type: String, default: '2020' },
      subscribe: {
        type: Object,
        default: () => ({
          heading: 'Subscribe to our newsletter',
          paragraph: 'The latest development updates, and general news, sent to your inbox regularly.',
          buttonText: 'Subscribe',
        }),
      },
      socials: {
        type: Object,
        default: () => ({
          discord: {
            heading: 'Discord',
            href: 'https://discord.gg/XeTFtYW',
            icon: svgIcons.discord,
          },
          twitter: {
            heading: 'Twitter',
            href: 'https://twitter.com/KenmeiApp',
            icon: svgIcons.twitter,
          },
          github: {
            heading: 'Github',
            href: 'https://github.com/doutatsu/kenmei',
            icon: svgIcons.github,
          },
        }),
      },
      linkGroupOne: {
        type: Object,
        default: () => ({
          company: {
            heading: 'Product',
            links: {
              about: { heading: 'About', href: '/about' },
              blog: { heading: 'Blog', href: '/blog' },
            },
          },
          support: {
            heading: 'Resources',
            links: {
              changelog: { heading: 'Changelog', href: '/changelog' },
              sources: { heading: 'Supported Sites', href: '/supported-sites' },
            },
          },
        }),
      },
      linkGroupTwo: {
        type: Object,
        default: () => ({
          legal: {
            heading: 'Legal',
            links: {
              privacy: { heading: 'Privacy', href: '/privacy' },
              terms: { heading: 'Terms', href: '/terms' },
            },
          },
        }),
      },
    },
    methods: {
      openNewsletterWindow() {
        window.open(
          'https://tinyletter.com/kenmei',
          'popupwindow',
          'scrollbars=yes,width=800,height=600'
        );

        return true;
      },
    },
  };
</script>

<style lang="scss" media="screen" scoped>
  @tailwind base;

  .socials-with-copyright {
    @apply mt-8 border-t border-gray-700 pt-8;

    @screen md {
      @apply flex items-center justify-between;
    }
  }

  button {
    @apply w-full flex items-center justify-center px-5 py-3 border;
    @apply border-transparent text-base leading-6 font-medium rounded-md;
    @apply text-white bg-blue-500 transition duration-150 ease-in-out;

    &:hover {
      @apply bg-blue-400;
    }

    &:focus {
      @apply outline-none bg-blue-400;
    }
  }

  h4 {
    @apply text-sm leading-5 font-semibold;
    @apply tracking-wider text-gray-400 uppercase;
  }

  input {
    @apply appearance-none w-full px-5 py-3 border border-transparent text-base;
    @apply leading-6 rounded-md text-gray-900 bg-white;
    @apply transition duration-150 ease-in-out;

    &:focus {
      @apply outline-none;
    }
  }

  .link {
    @apply text-base leading-6 text-gray-300;

    &:hover {
      @apply text-white;
    }
  }
</style>
