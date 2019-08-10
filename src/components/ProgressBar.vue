<template lang="pug">
  el-progress(:percentage="percentage" :color="colors")
</template>

<script>
  import { Progress } from 'element-ui';

  export default {
    components: {
      'el-progress': Progress,
    },
    props: {
      percentage: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        colors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#1989fa', percentage: 60 },
          { color: '#6f7ad3', percentage: 80 },
          { color: '#5cb87a', percentage: 100 },
        ],
      };
    },
  };
</script>
