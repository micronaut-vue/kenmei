<template lang="pug">
  #home.h-full.overflow-auto
    navigation-bar
    transition(name="slide-left" mode="out-in")
      router-view
</template>

<script>
  import NavigationBar from '@/components/TheNavigationBar';

  export default {
    name: 'Home',
    components: {
      NavigationBar,
    },
  };
</script>

<style media="screen" lang="scss">
  .slide-left-enter-active, .slide-left-leave-active {
    @apply transition ease-in duration-300 transition-all overflow-hidden;
  }

  .slide-left-enter { @apply opacity-0 transform translate-x-8; }
  .slide-left-leave-active { @apply opacity-0 transform -translate-x-8;}
</style>
