<template lang="pug">
  el-form(
    ref='signInForm'
    :rules='rules'
    :model='user'
    label-position='top'
  )
    el-form-item(prop='email')
      el-input(
        placeholder='Email'
        type='email'
        v-model.trim='user.email'
        prefix-icon="el-icon-user"
      )
    el-form-item.mb-3(prop='password')
      el-input(
        placeholder='Password'
        type='password'
        v-model.trim='user.password'
        auto-complete='current-password'
        prefix-icon="el-icon-lock"
        @keyup.enter.native='submitForm'
      )
    el-form-item.mb-0
      el-checkbox(v-model="remembered") Remember Me (2 months)
      el-button.w-full(
        ref='signInSubmit'
        type='primary'
        @click='submitForm'
      ) Sign In
    .text-center
      el-link.mt-4(
        @click.native="$emit('componentChanged', 'TheResetPassword')"
        :underline="false"
      )
        | Forgot your password?
      el-divider.my-4
      span
        | Don't have an account?
        |
      el-link.align-baseline(
        @click.native="$emit('componentChanged', 'TheSignUp')"
        :underline="false"
      )
        | Register
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    Form, FormItem, Button, Input, Checkbox, Link, Divider,
  } from 'element-ui';

  export default {
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
      'el-checkbox': Checkbox,
      'el-link': Link,
      'el-divider': Divider,
    },
    data() {
      return {
        user: {
          email: '',
          password: '',
        },
        remembered: false,
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
          password: [
            {
              required: true,
              message: "Password can't be blank",
              trigger: 'blur',
            },
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
      ...mapActions('user', [
        'signIn',
      ]),
      submitForm() {
        this.$refs.signInForm.validate((valid) => {
          if (valid) { this.trySignIn(); }

          return false;
        });
      },
      async trySignIn() {
        await this.signIn(this.user);
        if (this.signedIn) {
          this.$emit('signOnFinished');
          this.$router.push({ name: 'manga-list' });
        }
      },
    },
  };
</script>
