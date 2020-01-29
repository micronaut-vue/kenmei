<template lang="pug">
  .container.mx-auto.w-full.h-full.flex.flex-col.items-center
    .flex.flex-col.w-full.max-w-6xl.pt-24.sm_pb-16
      .mx-5.mb-5.max-sm_mx-2
        el-alert(
          title="MangaDex is operational"
          type="success"
          :description="warning"
          show-icon
          :closable="false"
        )
      .mx-5.mb-5.max-sm_mx-2
        el-select.sm_shadow-md.rounded.float-right.w-48(
          v-model="currentListID"
          placeholder="Select"
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
      .mx-5.mb-5.max-sm_mx-2
        .bulk-actions.inline-block.max-sm_mb-5.max-sm_float-right
          el-button.sm_shadow-md(
            v-show="entriesSelected"
            ref="removeSeriesButton"
            type="danger"
            size="medium"
            @click="removeSeries"
            round
          )
            i.el-icon-delete.mr-1
            | Remove
          el-button.sm_shadow-md(
            v-show="entriesSelected"
            ref="editMangaEntriesButton"
            type="info"
            size="medium"
            @click="editDialogVisible = true"
            round
          )
            i.el-icon-edit.mr-1
            | Edit
        .actions.inline-block.float-right
          el-button.sm_shadow-md(
            type="success"
            size="medium"
            @click="importDialogVisible = true"
            round
          )
            i.el-icon-upload2.mr-1
            | Import
          el-button.sm_shadow-md(
            ref="openAddMangaModalButton"
            type="primary"
            size="medium"
            @click="dialogVisible = true"
            round
          )
            i.el-icon-plus.mr-1
            | Add Manga
      .flex-grow.sm_mx-5.mx-0
        the-manga-list(
          ref='mangaList'
          :tableData='filteredEntries || currentListEntries'
          @seriesSelected="handleSelection"
        )
      el-dialog(
        title="Import Manga List"
        :visible.sync="importDialogVisible"
        custom-class="custom-dialog"
        width="400px"
      )
        importers(@importCompleted="completeImport")
      el-dialog(
        title="Add Manga"
        :visible.sync="dialogVisible"
        custom-class="custom-dialog add-manga-entry-dialog"
        width="400px"
      )
        add-manga-entry(
          :currentListID='currentListID'
          @dialogClosed='dialogVisible = false'
        )
      el-dialog(
        title="Edit Manga Entry"
        custom-class="custom-dialog edit-manga-entry-dialog"
        width="400px"
        :visible.sync="editDialogVisible"
      )
        edit-manga-entries(
          :selectedSeriesIDs='selectedSeriesIDs'
          @cancelEdit='editDialogVisible = false'
          @editComplete='resetEditEntries'
        )
</template>

<script>
  import debounce from 'lodash/debounce';
  import {
    mapActions, mapState, mapMutations, mapGetters,
  } from 'vuex';
  import {
    Message, Dialog, Button, Input, Select, Option, Alert,
  } from 'element-ui';

  import Importers from '@/components/TheImporters';
  import AddMangaEntry from '@/components/manga_entries/AddMangaEntry';
  import EditMangaEntries from '@/components/manga_entries/EditMangaEntries';
  import TheMangaList from '@/components/TheMangaList';
  import { bulkDeleteMangaEntries } from '@/services/api';

  export default {
    name: 'MangaList',
    components: {
      Importers,
      AddMangaEntry,
      EditMangaEntries,
      TheMangaList,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-alert': Alert,
    },
    data() {
      return {
        selectedSeriesIDs: [],
        currentListID: null,
        searchTerm: '',
        dialogVisible: false,
        importDialogVisible: false,
        editDialogVisible: false,
        warning: `
          MangaDex is working again. If you tried to import from MDList or
          Trackr recently and failed, importing again should now work as usual.
          Do keep in mind, that its mangadex.cc, not mangadex.org for now. Until
          MangaDex starts using the old domain, links using .org will fail
        `,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
      ]),
      ...mapGetters('lists', [
        'getEntriesByListId',
      ]),
      entriesSelected() {
        return this.selectedSeriesIDs.length > 0;
      },
      currentListEntries() {
        return this.getEntriesByListId(this.currentListID);
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
    mounted() {
      this.retrieveLists();
    },
    methods: {
      ...mapActions('lists', [
        'getLists',
      ]),
      ...mapMutations('lists', [
        'removeEntries',
        'setListsLoading',
      ]),
      handleSelection(selectedSeriesIDs) {
        this.selectedSeriesIDs = selectedSeriesIDs;
      },
      async retrieveLists() {
        await this.getLists();
        this.currentListID = this.currentListID || this.lists[0].id;
      },
      async removeSeries() {
        const successful = await bulkDeleteMangaEntries(this.selectedSeriesIDs);

        if (successful) {
          Message.info(`${this.selectedSeriesIDs.length} entries deleted`);
          this.removeEntries(this.selectedSeriesIDs);
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
      resetEditEntries() {
        this.editDialogVisible = false;
        this.resetSelectedAttributes();
      },
      clearTableSelection() {
        this.$refs.mangaList.$refs.mangaListTable.clearSelection();
      },
      resetSelectedAttributes() {
        this.selectedSeriesIDs = [];
        this.clearTableSelection();
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-button.float-right + .el-button.float-right {
    @apply ml-0;
  }

  @media (max-width: 640px) {
    .custom-dialog {
      width: 100% !important;
    }
  }
</style>
