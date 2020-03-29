<template lang="pug">
  #home.min-h-full.flex.flex-col.bg-blue-300
    navigation-bar
    .flex-1.overflow-x-hidden
      main.min-h-45
        transition(name="slide-left" mode="out-in")
          router-view
    base-footer.flex-shrink-0
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
