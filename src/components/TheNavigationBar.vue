<template lang="pug">
  el-menu.absolute.w-full.z-10.top-0.shadow-md(
    :default-active='currentPath'
    mode='horizontal'
    menu-trigger='click'
    router
  )
    el-menu-item.cursor-default
      img.w-32(src='@/assets/logo.svg')
    el-submenu.avatar-menu.float-right(index='1')
      template(slot='title')
        el-avatar.align-middle(
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        )
      el-menu-item.sm_hidden(index='/landing-page') Home
      el-menu-item.sm_hidden(index='/manga-list') Manga List
      el-menu-item(disabled) Settings
      el-menu-item(disabled) Logout
    el-menu-item.max-sm_hidden.float-right(index='/manga-list') Manga List
    el-menu-item.max-sm_hidden.float-right(index='/landing-page') Home
</template>

<script>
  import {
    Menu, MenuItem, Avatar, Submenu,
  } from 'element-ui';

  export default {
    components: {
      'el-menu': Menu,
      'el-menu-item': MenuItem,
      'el-submenu': Submenu,
      'el-avatar': Avatar,
    },
    data() {
      return {
        mobile: false,
      };
    },
    computed: {
      currentPath() {
        return this.$route.path;
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
