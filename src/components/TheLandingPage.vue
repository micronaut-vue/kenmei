<template lang="pug">
  .container
    el-card(shadow="always")
      img.logo(src='@/assets/logo_transparent.png')
      .welcome-text.font-size-b.font-line-height-secondary
        p
          | Welcome to Kenmei, a new manga tracking website currently in
          | development.
        p
          | Inspired by
          |
          el-link(href="https://www.trackr.moe" :underline="false") trackr.moe
          |, the best manga tracking website,
          |
          el-link(
            href="https://blog.codeanimu.net/posts/2019/07/trackr-moe-the-future/"
            :underline="false"
          )
            | that is now slated to be closed
          |, Kenmei is here to replace it
          | and provide even more features, for all manga fans out there!
        p
          | If you would like to get notified, when registrations open, please
          | leave your email below.
      .email-form
        form(
          action='https://tinyletter.com/kenmei'
          method='post'
          target='popupwindow'
          onsubmit="window.open('https://tinyletter.com/kenmei', 'popupwindow', 'scrollbars=yes,width=800,height=600');"
        )
          el-input(
            v-model="form.email"
            placeholder="Please enter your email"
            name='email'
          )
          input(type='hidden', value='1', name='embed')
          input.el-button(type='submit', value='Subscribe')
</template>

<script>
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
  };
</script>

<style lang="scss" scoped>
  .container {
    background: -webkit-linear-gradient(
      180deg,
      rgb(64, 158, 255),
      rgb(217, 236, 255)
    );
    background: linear-gradient(
      180deg,
      rgb(64, 158, 255),
      rgb(217, 236, 255)
    );
    height: 100%;
    padding: 0 20px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    max-width: 300px;
    width: 100%;
  }

  .el-link {
    display: inline;
    vertical-align: baseline;
  }

  .el-card {
    max-width: 500px;
    text-align: center;
  }

  .el-input {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
