<template lang="pug">
  svg.h-6.w-6.stroke-current(fill='none' viewbox='0 0 24 24')
    path(
      :class="{'hidden': visible, 'inline-flex': !visible }"
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='2'
      d='M4 6h16M4 12h16M4 18h16'
    )
    path(
      :class="{'hidden': !visible, 'inline-flex': visible }"
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='2'
      d='M6 18L18 6M6 6l12 12'
    )
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;
</style>
