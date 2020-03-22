<template lang="pug">
  header
    el-menu.w-full.top-0.shadow-md(
      :default-active='currentPath'
      mode='horizontal'
      menu-trigger='click'
      router
    )
      el-menu-item(index='/').border-none
        img.w-32(src='@/assets/logo.svg' alt="logo")
      template(v-if='signedIn')
        el-submenu.avatar-menu.float-right(index='1')
          template(slot='title')
            el-avatar.align-middle
              img(src='@/assets/default-avatar.png')
          el-menu-item.sm_hidden(index='/manga-list') Manga List
          el-menu-item(disabled) Settings
          el-menu-item(@click='signOutMethod') Logout
        el-menu-item.max-sm_hidden.float-right(index='/manga-list') Manga List
      template(v-else)
        el-button.mr-5.mt-10px.float-right(@click="openSignOnWith('TheSignUp')")
          | Register
        el-menu-item.border-none.float-right(@click="openSignOnWith('TheSignIn')")
          | Sign In
    base-modal(
      :visible="signOnVisible"
      :loading="loading"
      @dialogClosed="signOnVisible = false"
      size="xs"
    )
      template(slot='body')
        component(
          :is='activeComponent'
          @componentChanged='activeComponent = $event'
          @signOnFinished='signOnVisible = false'
          @loading='loading = $event'
        )
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import {
    Menu, MenuItem, Avatar, Submenu, Button,
  } from 'element-ui';

  import TheResetPassword from '@/components/TheResetPassword';
  import TheSignIn from '@/components/TheSignIn';
  import TheSignUp from '@/components/TheSignUp';

  export default {
    components: {
      TheResetPassword,
      TheSignUp,
      TheSignIn,
      'el-menu': Menu,
      'el-menu-item': MenuItem,
      'el-submenu': Submenu,
      'el-avatar': Avatar,
      'el-button': Button,
    },
    data() {
      return {
        signOnVisible: false,
        activeComponent: 'TheSignIn',
        loading: false,
      };
    },
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
      signOnDialogTitle() {
        return this.activeComponent === 'TheSignIn'
          ? 'Sign In'
          : this.activeComponent === 'TheSignUp'
            ? 'Create Account'
            : 'Reset Password';
      },
      currentPath() {
        return this.$route.path;
      },
    },
    methods: {
      ...mapActions('user', [
        'signOut',
      ]),
      openSignOnWith(comp) {
        this.activeComponent = comp;
        this.signOnVisible = true;
      },
      signOutMethod() {
        this.signOut().then(() => this.$router.push('/'));
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .avatar-menu > .el-submenu__title {
    border-bottom: 2px solid transparent !important;
  }

  .el-avatar > img {
    @apply align-baseline
  }
</style>
