<template lang="pug">
  #report-manga-entries
    el-select.rounded.w-full(
      v-model="currentIssue"
      placeholder="Select issue type"
    )
      el-option(
        v-for="issue in issues"
        :key="issue.type"
        :label="issue.value"
        :value="issue.type"
      )
    p.text-gray-600.text-xs.break-normal
      | Select this option, if manga information is outdated or incorrect.
      | Manga will attempt to update automatically, otherwise it will be
      | investigated in detail later.
    .mt-8.-mb-2.text-right
      el-button(@click="$emit('closeDialog')") Cancel
      el-button(ref="reportEntriesButton" type="danger" @click="report")
        | Report
</template>

<script>
  import {
    Dialog, Button, Select, Option, Message, Loading,
  } from 'element-ui';

  import {
    postMangaEntriesErrors,
  } from '@/services/endpoints/MangaEntriesErrors';

  export default {
    name: 'ReportMangaEntries',
    components: {
      'el-dialog': Dialog,
      'el-select': Select,
      'el-option': Option,
      'el-button': Button,
    },
    props: {
      selectedEntries: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        issues: [{ type: 0, value: 'Incorrect Manga Data' }],
        currentIssue: 0,
      };
    },
    methods: {
      async report() {
        const loading = Loading.service({ target: '.report-manga-entry-dialog' });

        const successful = await postMangaEntriesErrors(
          this.selectedEntries.map(e => e.id), this.currentIssue
        );

        loading.close();

        if (successful) {
          this.$emit('closeDialog');
          Message.success('Issue reported successfully');
        } else {
          Message.error(
            'Failed to report. Try reloading the page before trying again'
          );
        }
      },
    },
  };
</script>
