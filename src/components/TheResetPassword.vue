<template lang="pug">
  el-form(
    ref='resetPasswordForm'
    :rules='rules'
    :model='user'
    label-position='top'
  )
    el-link.mb-3.text-base(
      icon="el-icon-arrow-left"
      @click.native="goBack"
      :underline="false"
    )
    template(v-if="resetInitiated")
      p.leading-normal.text-gray-600.text-center
        | Check your
        |
        strong {{ user.email }}
        |  inbox for instructions from us on how to verify your account
    template(v-else)
      el-form-item(prop='email')
        p.leading-normal.text-gray-600
          | Enter your email address below
          | and we'll send you a link to reset your password.
        el-input(
          placeholder='Email'
          type='email'
          v-model.trim='user.email'
          @keyup.enter.native='submitForm'
          prefix-icon="el-icon-message"
        )
      el-form-item.mb-0
        el-button.w-full(
          ref='resetPasswordSubmit'
          type='primary'
          @click='submitForm'
        ) Reset Password
</template>

<script>
  import {
    Form, FormItem, Button, Input, Link, Message, Loading,
  } from 'element-ui';

  import { plain } from '@/modules/axios';

  export default {
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
      'el-link': Link,
    },
    data() {
      return {
        user: {
          email: '',
        },
        resetInitiated: false,
        rules: {
          email: [
            {
              required: true,
              message: "Email can't be blank",
              trigger: 'blur',
            },
            {
              type: 'email',
              message: 'Please input correct email address',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    methods: {
      goBack() {
        this.resetInitiated = false;
        this.$emit('componentChanged', 'TheSignOnTabs');
      },
      submitForm() {
        this.$refs.resetPasswordForm.validate((valid) => {
          if (valid) { this.resetPassword(); }

          return false;
        });
      },
      resetPassword() {
        const loading = Loading.service({ target: '#sign-on-card' });

        return plain.post('/auth/passwords', { email: this.user.email })
          .then(() => {
            this.resetInitiated = true;
          })
          .catch((request) => {
            Message.error({
              dangerouslyUseHTMLString: true,
              message: request.response.data,
            });
          })
          .then(() => { loading.close(); });
      },
    },
  };
</script>
