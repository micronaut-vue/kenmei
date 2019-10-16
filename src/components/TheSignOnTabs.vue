<template lang="pug">
el-tabs(v-model="activeTab" stretch)
  el-tab-pane(label="Sign In" name="signIn")
    the-sign-in(@resetPassword="$emit('componentChanged', 'TheResetPassword')")
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
