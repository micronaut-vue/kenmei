<template lang="pug">
  .container.mx-auto.w-full.h-full.flex.flex-col.items-center
    .flex.flex-col.w-full.max-w-6xl.py-24
      .mx-5.mb-5.max-sm_mx-2
        a.no-underline(
          href="https://news.kenmei.co/updates/2020/update-12"
          target="_blank"
        )
          el-alert.cursor-pointer(
            title="Update #12"
            type="info"
            :description="alertMessage"
            :closable="false"
            show-icon
          )
      .mx-5.mb-5.max-sm_mx-2
        el-select.sm_shadow-md.rounded.float-right.w-48(
          v-model="currentListID"
          placeholder="Select"
          :disabled="listsLoading"
        )
          el-option(
            v-for="list in lists"
            :key="list.id"
            :label="list.attributes.name"
            :value="list.id"
          )
      .mx-5.mb-5.max-sm_mx-2
        .el-input.el-input--prefix.sm_shadow-md.rounded.float-right.w-64
          input.el-input__inner(
            placeholder="Input manga title"
            v-model='debouncedSearchTerm'
          )
          span.el-input__prefix
            i.el-input__icon.el-icon-search
      .mx-5.mb-5.max-sm_mx-2.max-sm_flex.max-sm_flex-col
        .bulk-actions.inline-block.max-sm_mb-5.max-sm_float-right
          el-button.sm_shadow(
            v-show="entriesSelected"
            content="Delete"
            ref="removeSeriesButton"
            icon="el-icon-delete"
            type="danger"
            size="medium"
            @click="deleteEntries"
            circle
            v-tippy
          )
          el-button.sm_shadow(
            v-show="entriesSelected"
            content="Edit"
            ref="editMangaEntriesButton"
            icon="el-icon-edit-outline"
            type="info"
            size="medium"
            @click="editDialogVisible = true"
            circle
            v-tippy
          )
          el-button.sm_shadow(
            v-show="entriesSelected"
            content="Report manga issues"
            ref="reportMangaEntriesButton"
            icon="el-icon-document-delete"
            type="warning"
            size="medium"
            @click="reportDialogVisible = true"
            circle
            v-tippy
          )
        .actions.inline-block.float-right.sm_flex.sm_flex-row-reverse
          span.sm_ml-3.flex.w-full.rounded-md.shadow-sm.sm_w-auto
            base-button(
              ref="addMangaEntryModalButton"
              @click="dialogVisible = true"
            )
              i.el-icon-plus.mr-1
              | Add Manga
          span.flex.mt-3.sm_mt-0.w-full.rounded-md.shadow-sm.sm_w-auto
            base-button(type="success" @click="importDialogVisible = true")
              i.el-icon-upload2.mr-1
              | Import
      .flex-grow.sm_mx-5.mx-0
        the-manga-list(
          ref='mangaList'
          :tableData='filteredEntries || currentListEntries'
          @seriesSelected="handleSelection"
          @editEntry='showEditEntryDialog'
        )
      importers(
        :visible='importDialogVisible'
        @closeDialog="importDialogVisible = false"
        @importCompleted="completeImport"
      )
      add-manga-entry(
        ref='addMangaEntryModal'
        :visible="dialogVisible"
        :currentListID='currentListID'
        @dialogClosed='dialogVisible = false'
      )
      edit-manga-entries(
        ref='editMangaEntryModal'
        :visible='editDialogVisible'
        :selectedEntries='selectedEntries'
        @cancelEdit='editDialogVisible = false'
        @editComplete="resetEntries('editDialogVisible')"
      )
      delete-manga-entries(
        :visible='deleteDialogVisible'
        @dialogClosed='deleteDialogVisible = false'
        @confirmDeletion='deleteDialogVisible = false; removeSeries()'
      )
      report-manga-entries(
        :selectedEntries='selectedEntries'
        :visible='reportDialogVisible'
        @closeDialog="resetEntries('reportDialogVisible')"
      )
</template>

<script>
  import debounce from 'lodash/debounce';
  import {
    mapActions, mapState, mapMutations, mapGetters,
  } from 'vuex';
  import {
    Message, Button, Input, Select, Option, Alert,
  } from 'element-ui';

  import Importers from '@/components/TheImporters';
  import AddMangaEntry from '@/components/manga_entries/AddMangaEntry';
  import DeleteMangaEntries from '@/components/manga_entries/DeleteMangaEntries';
  import EditMangaEntries from '@/components/manga_entries/EditMangaEntries';
  import ReportMangaEntries from '@/components/manga_entries/ReportMangaEntries';
  import TheMangaList from '@/components/TheMangaList';
  import { bulkDeleteMangaEntries } from '@/services/api';

  export default {
    name: 'MangaList',
    components: {
      Importers,
      AddMangaEntry,
      EditMangaEntries,
      DeleteMangaEntries,
      ReportMangaEntries,
      TheMangaList,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-alert': Alert,
    },
    data() {
      return {
        selectedEntries: [],
        entriesSelected: false,
        currentListID: '',
        searchTerm: '',
        dialogVisible: false,
        importDialogVisible: false,
        editDialogVisible: false,
        deleteDialogVisible: false,
        reportDialogVisible: false,
        alertMessage: `
          Support for 8 new sites, cross-site support,
          speed improvements and much more in the biggest update to date!
        `,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
        'listsLoading',
      ]),
      ...mapGetters('lists', [
        'getEntriesByListId',
      ]),
      currentListEntries() {
        return this.getEntriesByListId(this.currentListID);
      },
      selectedEntriesIDs() {
        return this.selectedEntries.map(entry => entry.id);
      },
      trackedEntriesIDs() {
        const trackedIDs = this.selectedEntries.map(
          entry => entry.attributes.tracked_entries.map(
            trackedEntry => trackedEntry.id
          )
        );

        return [].concat(...trackedIDs);
      },
      debouncedSearchTerm: {
        get() {
          return this.searchTerm;
        },
        set: debounce(function(newVal) { //eslint-disable-line
          if (newVal !== this.searchTerm) { this.searchTerm = newVal; }
        }, 250),
      },
      filteredEntries() {
        if (this.searchTerm === '') { return this.currentListEntries; }

        return this.currentListEntries.filter(
          entry => entry.attributes.title.toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      },
    },
    async created() {
      this.setListsLoading(true);

      await this.retrieveLists();
      await this.retrieveEntries();

      this.setListsLoading(false);
    },
    methods: {
      ...mapActions('lists', [
        'getLists',
        'getEntries',
      ]),
      ...mapMutations('lists', [
        'removeEntries',
        'setListsLoading',
      ]),
      handleSelection(selectedEntries) {
        this.entriesSelected = selectedEntries.length > 0;
        this.selectedEntries = selectedEntries;
      },
      deleteEntries() {
        if (this.trackedEntriesIDs.length > this.selectedEntriesIDs.length) {
          this.deleteDialogVisible = true;
        } else {
          this.removeSeries();
        }
      },
      async retrieveLists() {
        await this.getLists();
        this.currentListID = this.currentListID || this.lists[0].id;
      },
      async retrieveEntries() {
        await this.getEntries();
      },
      async removeSeries() {
        const successful = await bulkDeleteMangaEntries(this.trackedEntriesIDs);

        if (successful) {
          Message.info(`${this.trackedEntriesIDs.length} entries deleted`);
          this.removeEntries(this.trackedEntriesIDs);
        } else {
          Message.error(
            'Deletion failed. Try reloading the page before trying again'
          );
        }
      },
      completeImport() {
        // Request all lists again to get new lists if created
        // TODO: Figure out based on relationships if there was a new list added
        this.retrieveLists();
      },
      resetEntries(dialogName) {
        this[dialogName] = false;
        this.resetSelectedAttributes();
      },
      clearTableSelection() {
        this.$refs.mangaList.$refs.mangaListTable.clearSelection();
      },
      resetSelectedAttributes() {
        this.selectedEntries = [];
        this.clearTableSelection();
      },
      showEditEntryDialog(entry) {
        this.selectedEntries = [entry];
        this.editDialogVisible = true;
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-button.float-right + .el-button.float-right {
    @apply ml-0;
  }
</style>
