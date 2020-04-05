<template lang="pug">
  el-form(
    ref='resetPasswordForm'
    :rules='rules'
    :model='user'
    label-position='top'
  )
    template(v-if="resetInitiated")
      p.leading-normal.text-gray-600.text-center.break-normal
        | Check your
        |
        strong {{ user.email }}
        |  inbox for instructions from us on how to reset your password
    template(v-else)
      el-form-item.mb-6(prop='email')
        p.leading-normal.text-gray-600.mt-0
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
        base-button(ref='resetPasswordSubmit' @click='submitForm')
          | Reset Password
      .text-center
        el-divider.my-4
        span.text-sm
          | Already have an account?
          |
        el-link.align-baseline(
          @click.native="$emit('componentChanged', 'TheSignIn')"
          :underline="false"
        )
          | Sign In
</template>

<script>
  import {
    Form, FormItem, Input, Link, Message, Divider,
  } from 'element-ui';

  import { plain } from '@/modules/axios';

  export default {
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-link': Link,
      'el-divider': Divider,
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
      submitForm() {
        this.$refs.resetPasswordForm.validate((valid) => {
          if (valid) { this.resetPassword(); }

          return false;
        });
      },
      async resetPassword() {
        this.$emit('loading', true);

        const response = await plain
          .post('/auth/passwords', { email: this.user.email })
          .catch((e) => e.response);

        if (response.status === 200) {
          this.resetInitiated = true;
        } else {
          Message.error({
            dangerouslyUseHTMLString: true,
            message: response.data,
          });
        }

        this.$emit('loading', false);
      },
    },
  };
</script>
