<template lang="pug">
  #mangaTable
    el-table.sm_shadow-lg.sm_rounded(
      ref="mangaListTable"
      :data="currentPageEntries"
      v-loading='listsLoading'
      @selection-change="handleSelectionChange"
      @sort-change="applySorting"
    )
      el-table-column(type="selection" width="35")
      el-table-column(
        prop="newReleases"
        width="30"
        align="center"
        sortable="custom"
      )
        template(slot-scope="scope")
          .new-chapter-dot(v-if="unread(scope.row)")
      el-table-column(
        prop="attributes.title"
        label="Title"
        sortable="custom"
      )
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
        sortable="custom"
      )
        template(v-if='scope.row.attributes' slot-scope="scope")
          template(v-if='scope.row.attributes.last_released_at')
            | {{ scope.row.attributes.last_released_at | timeAgo }}
          template(v-else)
            | Unknown
      el-table-column(width="50" class-name="actions")
        template(slot-scope="scope")
          el-tooltip(
            effect="dark"
            content="Set last read to the latest chapter"
            placement="top-start"
          )
            el-button(
              v-if="lastChapterNotSet(scope.row)"
              ref="updateEntryButton"
              icon="el-icon-check"
              size="mini"
              @click="setLastRead(scope.row)"
              circle
            )
    .flex.flex-row.justify-center
      el-pagination.sm_shadow-lg.my-5.p-0(
        layout="prev, pager, next"
        :page-size="50"
        :current-page.sync="currentPage"
        :total="tableData.length"
        :hide-on-single-page="true"
      )
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import {
    Table, TableColumn, Link, Button, Message, Tooltip, Pagination,
  } from 'element-ui';
  import dayjs from 'dayjs';
  import he from 'he';
  import relativeTime from 'dayjs/plugin/relativeTime';

  import { updateMangaEntry } from '@/services/api';
  import sortBy from '@/services/sorters';

  dayjs.extend(relativeTime);

  export default {
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-link': Link,
      'el-button': Button,
      'el-tooltip': Tooltip,
      'el-pagination': Pagination,
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
    data() {
      return {
        currentPage: 1,
        sortedData: [],
      };
    },
    computed: {
      ...mapState('lists', [
        'listsLoading',
      ]),
      currentPageEntries() {
        const page = this.currentPage - 1;
        return this.sortedData.slice(page * 50, (page + 1) * 50);
      },
    },
    watch: {
      tableData(newVal, oldVal) {
        if (newVal === oldVal) { return; }

        this.sortedData = newVal;
        this.$refs.mangaListTable.sort('newReleases', 'ascending');
      },
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
      ]),
      /* eslint-disable camelcase */
      lastChapterNotSet(entry) {
        const {
          last_chapter_read_url, last_chapter_available_url,
        } = entry.links;

        return last_chapter_available_url
          && (last_chapter_read_url !== last_chapter_available_url);
      },
      unread(entry) {
        const {
          last_chapter_read_url, last_chapter_available_url,
        } = entry.links;

        return last_chapter_read_url
          && (last_chapter_read_url !== last_chapter_available_url);
      },
      /* eslint-enable camelcase */
      async setLastRead(entry) {
        const attributes = {
          last_chapter_read: entry.attributes.last_chapter_available,
          last_chapter_read_url: entry.links.last_chapter_available_url,
        };
        const response = await updateMangaEntry(entry.id, attributes);
        if (response) {
          Message.info('Updated last read chapter');
          this.updateEntry(response);
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
      applySorting({ _column, prop, order }) {
        this.sortedData = sortBy(this.tableData, prop, order);
        this.currentPage = 1;
      },
      handleSelectionChange(val) {
        const ids = val.map(entry => entry.id);
        this.$emit('seriesSelected', ids);
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-pagination {
    width: fit-content;
  }
  .btn-prev {
    @apply rounded-l;
  }
  .btn-next {
    @apply rounded-r;
  }
  .actions > .cell {
    height: 28px; // matches the button height
  }
  .new-chapter-dot {
    background-color: #409EFF;
    @apply h-2 w-2 p-0 rounded-full;
  }
  .el-table th > .cell {
    @apply break-normal;
  }

  .el-table td > .cell {
    @apply break-normal;
  }
</style>
