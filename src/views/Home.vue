<template lang="pug">
  #home
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
