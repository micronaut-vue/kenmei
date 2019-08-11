<template lang="pug">
  el-table(
    :data="tableData"
    :default-sort = "{ prop: 'series.title', order: 'descending' }"
  )
    el-table-column(prop="series.title" label="Name" sortable)
      template(slot-scope="scope")
        el-link.series-title(
          :href="scope.row.series.url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.series.title }}
    el-table-column(prop="latestChapter.url" label="Latest Chapter")
      template(v-if='scope.row.latestChapter.info' slot-scope="scope")
        el-link(
          :href="scope.row.latestChapter.url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.latestChapter.info.chapter }}
    el-table-column(
      prop="latestChapter.info.timestamp"
      label="Released"
      sortable
    )
      template(v-if='scope.row.latestChapter.info' slot-scope="scope")
        | {{ releasedAt(scope.row.latestChapter.info.timestamp) }}
</template>

<script>
  import { Table, TableColumn, Link } from 'element-ui';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  dayjs.extend(relativeTime);

  export default {
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-link': Link,
    },
    props: {
      tableData: {
        type: Array,
        required: true,
      },
    },
    methods: {
      releasedAt(timestamp) {
        return dayjs().to(dayjs.unix(timestamp));
      },
    },
  };
</script>

<style lang="scss" scoped>
  .series-title {
    word-break: normal;
  }
</style>
