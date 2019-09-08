<template lang="pug">
  el-form(
    ref='signUpForm'
    :rules='rules'
    :model='user'
    label-position='top'
  )
    el-form-item(prop='email')
      el-input(placeholder='Email' type='email' v-model.trim='user.email')
    el-form-item(prop='password')
      el-input(
        placeholder='Password'
        type='password'
        v-model.trim='user.password'
        auto-complete='new-password'
        @keyup.enter.native='submitForm'
      )
    el-form-item(prop='password_confirmation')
      el-input(
        placeholder='Password confirmation'
        type='password'
        v-model.trim='user.password_confirmation'
        auto-complete='new-password'
        @keyup.enter.native='signUp(user)'
      )
    el-form-item
      el-button.w-full(
        ref='signUpSubmit'
        type='primary'
        @click='submitForm'
      ) Sign Up
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    Form, FormItem, Button, Input,
  } from 'element-ui';

  export default {
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
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
      ...mapActions('user', [
        'signUp',
      ]),
      submitForm() {
        this.$refs.signUpForm.validate((valid) => {
          if (valid) { this.signUp(this.user); }

          return false;
        });
      },
    },
  };
</script>
