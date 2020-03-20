<template lang="pug">
  .flex.flex-col.justify-center.items-center
    base-card.max-w-lg.text-center.mx-5.md_mx-0.my-40
      .p-5
        img.max-w-xs.w-full.inline.logo(src='@/assets/logo.svg' alt="logo")
        .welcome-text.font-size-b.font-line-height-secondary
          p
            | Welcome to Kenmei, a new manga tracking website currently in
            | alpha.
          p
            | Inspired by
            |
            el-link.inline.align-baseline(
              href="https://www.trackr.moe" type="primary" :underline="false"
            )
              | trackr.moe
            |, the best manga tracking website,
            |
            el-link.inline.align-baseline(
              href="https://blog.codeanimu.net/posts/2019/07/trackr-moe-the-future/"
              type="primary"
              :underline="false"
            )
              | that is now slated to be closed
            |, Kenmei is here to replace it
            | and provide even more features, for all manga fans out there!
          p
            | To get development updates, please leave your email below.
        .email-form
          form(
            action='https://tinyletter.com/kenmei'
            method='post'
            target='popupwindow'
            onsubmit="window.open('https://tinyletter.com/kenmei', 'popupwindow', 'scrollbars=yes,width=800,height=600');"
          )
            el-input.my-5(
              v-model="form.email"
              placeholder="Please enter your email"
              name='email'
            )
            input(type='hidden', value='1', name='embed')
            input.el-button(type='submit', value='Subscribe')
</template>

<script>
  import VueScrollTo from 'vue-scrollto';

  import {
    Card, Button, Input, Link,
  } from 'element-ui';

  export default {
    components: {
      'el-card': Card,
      'el-button': Button,
      'el-input': Input,
      'el-link': Link,
    },
    data() {
      return {
        form: {
          email: '',
        },
      };
    },
    beforeMount() {
      VueScrollTo.scrollTo('header');
    },
  };
</script>
