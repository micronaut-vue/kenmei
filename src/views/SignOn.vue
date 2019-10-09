<template lang="pug">
  .container.mx-auto.w-full.h-full
    .flex.flex-col.h-full.w-full.items-center.justify-center
      base-card.max-w-xs
        .px-6.py-4#sign-on-card
          component(
            :is='activeComponent'
            @componentChanged='activeComponent = $event'
          )
</template>

<script>
  import TheSignOnTabs from '@/components/TheSignOnTabs';
  import TheResetPassword from '@/components/TheResetPassword';

  export default {
    components: {
      TheSignOnTabs,
      TheResetPassword,
    },
    data() {
      return {
        activeComponent: 'TheSignOnTabs',
      };
    },
  };
</script>
