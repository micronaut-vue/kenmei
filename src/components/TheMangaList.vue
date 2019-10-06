<template lang="pug">
  el-table.sm_shadow-lg.sm_rounded(
    :data="tableData"
    :default-sort = "{ prop: 'attributes.title', order: 'descending' }"
    v-loading='listsLoading'
    @selection-change="handleSelectionChange"
  )
    el-table-column(type="selection")
    el-table-column(prop="attributes.title" label="Name" sortable)
      template(slot-scope="scope")
        el-link.break-normal(
          :href="scope.row.links.series_url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.attributes.title | sanitize }}
    el-table-column(
      prop="attributes.last_chapter_read"
      label="Last Chapter Read"
    )
      template(v-if='scope.row.attributes' slot-scope="scope")
        | {{ scope.row.attributes.last_chapter_read }}
    el-table-column(
      prop="links.last_chapter_available_url"
      label="Latest Chapter"
    )
      template(v-if='scope.row.attributes' slot-scope="scope")
        el-link(
          :href="scope.row.links.last_chapter_available_url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.attributes.last_chapter_available }}
    el-table-column(
      prop="attributes.last_released_at"
      label="Released"
      sortable
    )
      template(v-if='scope.row.attributes' slot-scope="scope")
        | {{ releasedAt(scope.row.attributes.last_released_at) }}
</template>

<script>
  import { mapState } from 'vuex';
  import { Table, TableColumn, Link } from 'element-ui';
  import dayjs from 'dayjs';
  import he from 'he';
  import relativeTime from 'dayjs/plugin/relativeTime';

  dayjs.extend(relativeTime);

  export default {
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-link': Link,
    },
    filters: {
      sanitize(title) {
        return he.decode(title);
      },
    },
    props: {
      tableData: {
        type: Array,
        required: true,
      },
    },
    computed: {
      ...mapState('lists', [
        'listsLoading',
      ]),
    },
    methods: {
      releasedAt(datetime) {
        return dayjs().to(dayjs(datetime));
      },
      handleSelectionChange(val) {
        const ids = val.map(entry => entry.id);
        this.$emit('seriesSelected', ids);
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-table th > .cell {
    @apply break-normal;
  }

  .el-table td > .cell {
    @apply break-normal;
  }
</style>
