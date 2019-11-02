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
        el-link.break-normal(
          v-if="scope.row.links.last_chapter_read_url"
          :href="scope.row.links.last_chapter_read_url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.attributes.last_chapter_read }}
        template(v-else)
          | {{ scope.row.attributes.last_chapter_read }}
    el-table-column(
      prop="links.last_chapter_available_url"
      label="Latest Chapter"
    )
      template(v-if='scope.row.attributes' slot-scope="scope")
        el-link(
          v-if="scope.row.links.last_chapter_available_url"
          :href="scope.row.links.last_chapter_available_url"
          :underline="false"
          target="_blank"
        )
          | {{ scope.row.attributes.last_chapter_available }}
        template(v-else)
          | No chapters
    el-table-column(
      prop="attributes.last_released_at"
      label="Released"
      sortable
      :sort-method="releasedAtSort"
    )
      template(v-if='scope.row.attributes' slot-scope="scope")
        template(v-if='scope.row.attributes.last_released_at')
          | {{ scope.row.attributes.last_released_at | timeAgo }}
        template(v-else)
          | Unknown
    el-table-column(width="50")
      template(slot-scope="scope")
        el-tooltip(
          effect="dark"
          content="Set last read to the latest chapter"
          placement="top-start"
        )
          el-button(
            ref="updateEntryButton"
            icon="el-icon-check"
            size="mini"
            @click="tryEntryUpdate(scope.row)"
            circle
          )
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import {
    Table, TableColumn, Link, Button, Message, Tooltip,
  } from 'element-ui';
  import dayjs from 'dayjs';
  import he from 'he';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { updateMangaEntry } from '@/services/api';

  dayjs.extend(relativeTime);

  export default {
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-link': Link,
      'el-button': Button,
      'el-tooltip': Tooltip,
    },
    filters: {
      sanitize(title) {
        return he.decode(title);
      },
      timeAgo(datetime) {
        return dayjs().to(dayjs(datetime));
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
      ...mapMutations('lists', [
        'updateEntry',
      ]),
      async tryEntryUpdate(entry) {
        const response = await updateMangaEntry(entry);
        if (response) {
          Message.info('Updated last read chapter');
          this.updateEntry(response);
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
      releasedAtSort(a, b) {
        const aReleasedAt = a.attributes.last_released_at;
        const bReleasedAt = b.attributes.last_released_at;

        // Descending order, with null always being the oldest
        return (aReleasedAt === null) - (bReleasedAt === null)
          || -(aReleasedAt > bReleasedAt)
          || +(aReleasedAt < bReleasedAt);
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
