<template lang="pug">
  .container.mx-auto.w-full.h-full
    .flex.flex-col.h-full.w-full.items-center.justify-center
      base-card.max-w-xs
        .px-6.py-4#sign-on-card
          el-tabs(v-model="activeTab" stretch)
            el-tab-pane(label="Sign In" name="signIn")
              the-sign-in
            el-tab-pane(label="Sign Up" name="signUp")
              the-sign-up
</template>

<script>
  import { Tabs, TabPane } from 'element-ui';

  import TheSignIn from '@/components/TheSignIn';
  import TheSignUp from '@/components/TheSignUp';

  export default {
    components: {
      TheSignIn,
      TheSignUp,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
    },
    data() {
      return {
        activeTab: 'signIn',
      };
    },
  };
</script>
