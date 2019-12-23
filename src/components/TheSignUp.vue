<template lang="pug">
  el-form(
    ref='signUpForm'
    :rules='rules'
    :model='user'
    label-position='top'
  )
    template(v-if="confirmationInitiated")
      p.leading-normal.text-gray-600.text-center.break-normal
        | Check your
        |
        strong {{ user.email }}
        |  inbox for instructions from us on how to verify your account
    template(v-else)
      el-form-item(prop='email')
        el-input(
          placeholder='Email'
          type='email'
          v-model.trim='user.email'
          prefix-icon="el-icon-message"
        )
      el-form-item(prop='password')
        el-input(
          placeholder='Password'
          type='password'
          v-model.trim='user.password'
          auto-complete='new-password'
          prefix-icon="el-icon-lock"
          @keyup.enter.native='submitForm'
        )
      el-form-item(prop='password_confirmation')
        el-input(
          placeholder='Password confirmation'
          type='password'
          v-model.trim='user.password_confirmation'
          auto-complete='new-password'
          prefix-icon="el-icon-lock"
          @keyup.enter.native='signUp(user)'
        )
      el-form-item
        el-button.w-full(
          ref='signUpSubmit'
          type='primary'
          @click='submitForm'
        ) Register
      .text-center
        el-divider.my-4
        span
          | Already have an account?
          |
        el-link.align-baseline(
          @click.native="$emit('componentChanged', 'TheSignIn')"
          :underline="false"
        )
          | Sign In
</template>

<script>
  import { mapGetters } from 'vuex';
  import {
    Form, FormItem, Button, Input, Loading, Message, Divider, Link,
  } from 'element-ui';

  import { plain } from '@/modules/axios';

  export default {
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
      'el-divider': Divider,
      'el-link': Link,
    },
    data() {
      const passwordConfirmationMatches = (rule, value, callback) => {
        if (!value || value !== this.user.password) {
          callback(new Error('Passwords do not match.'));
        } else {
          callback();
        }
      };

      return {
        confirmationInitiated: false,
        user: {
          email: '',
          password: '',
          password_confirmation: '',
        },
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
              trigger: 'blur,change',
            },
          ],
          password: [
            {
              required: true,
              message: "Password can't be blank",
              trigger: 'blur',
            },
            {
              min: 8,
              max: 24,
              message: 'Password must be between 8 and 24 characters.',
              trigger: 'change',
            },
          ],
          password_confirmation: [
            {
              required: true,
              message: "Password confirmation can't be blank",
              trigger: 'change',
            },
            { validator: passwordConfirmationMatches, trigger: 'blur' },
          ],
        },
      };
    },
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
    methods: {
      submitForm() {
        this.$refs.signUpForm.validate((valid) => {
          if (valid) { this.signUp(); }

          return false;
        });
      },
      signUp() {
        const loading = Loading.service({ target: '.sign-on-dialog' });

        return plain.post('/api/v1/registrations/', { user: this.user })
          .then(() => {
            this.confirmationInitiated = true;
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
