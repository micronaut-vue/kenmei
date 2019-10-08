<template lang="pug">
  #home.h-full.overflow-auto
    navigation-bar
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
