<template lang="pug">
  #home
    .container.mx-auto.w-full.h-full.flex.flex-col.justify-center.items-center
      router-view
</template>

<script>
  export default {
    name: 'Home',
  };
</script>

<style lang="scss" scoped>
  #home {
    height: 100%;
  }
</style>
