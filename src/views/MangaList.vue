<template lang="pug">
  .container.mx-auto.w-full.h-full.flex.flex-col.items-center
    .flex.flex-col.w-full.max-w-6xl.pt-24.sm_pb-16
      .mx-5.mb-5.max-sm_mx-2
        el-select.sm_shadow-md.rounded.float-right(
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
        el-button.sm_shadow-md(
          v-show="selectedSeriesIDs.length > 0"
          ref="removeSeriesButton"
          type="danger"
          size="medium"
          @click="removeSeries"
          round
        )
          i.el-icon-delete.mr-1
          | Remove
        el-button.sm_shadow-md.float-right(
          ref="openAddMangaModalButton"
          type="primary"
          size="medium"
          @click="dialogVisible = true"
          round
        )
          i.el-icon-plus.mr-1
          | Add Manga
        el-button.sm_shadow-md.float-right.mr-3(
          type="success"
          size="medium"
          @click="importDialogVisible = true"
          round
        )
          i.el-icon-upload2.mr-1
          | Import
      .flex-grow.sm_mx-5.mx-0
        the-manga-list(
          :tableData='currentListEntries'
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
        custom-class="custom-dialog"
        width="400px"
      )
        label.font-size-b.primary-text MangaDex series URL
        el-input.mt-3(
          v-model="mangaURL"
          placeholder="https://mangadex.org/title/7139/one-punch-man"
        )
        span(slot="footer" class="dialog-footer")
          el-button(@click="dialogVisible = false") Cancel
          el-button(
            ref="addMangaButton"
            type="primary"
            @click="mangaDexSearch"
            :disabled="mangaURL.length === 0"
          )
            | Add
</template>

<script>
  import {
    mapActions, mapState, mapMutations, mapGetters,
  } from 'vuex';
  import {
    Message, Loading, Dialog, Button, Input, Link, Select, Option,
  } from 'element-ui';

  import Importers from '@/components/TheImporters';
  import TheMangaList from '@/components/TheMangaList';
  import { addMangaEntry, deleteMangaEntry } from '@/services/api';

  export default {
    name: 'MangaList',
    components: {
      Importers,
      TheMangaList,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-link': Link,
      'el-select': Select,
      'el-option': Option,
    },
    data() {
      return {
        selectedSeriesIDs: [],
        currentListID: null,
        mangaURL: '',
        dialogVisible: false,
        importDialogVisible: false,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
      ]),
      ...mapGetters('lists', [
        'getEntriesByListId',
        'entryAlreadyExists',
      ]),
      currentListEntries() {
        return this.getEntriesByListId(this.currentListID);
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
        'addEntry',
        'removeEntries',
      ]),
      handleSelection(selectedSeriesIDs) {
        this.selectedSeriesIDs = selectedSeriesIDs;
      },
      async retrieveLists() {
        await this.getLists();
        this.currentListID = this.currentListID || this.lists[0].id;
      },
      async removeSeries() {
        await this.selectedSeriesIDs.map(id => deleteMangaEntry(id));

        this.removeEntries(this.selectedSeriesIDs);
      },
      completeImport() {
        // Request all lists again to get new lists if created
        // TODO: Figure out based on relationships if there was a new list added
        this.retrieveLists();
      },
      mangaDexSearch() {
        if (this.entryAlreadyExists(this.mangaURL)) {
          Message.info('Manga already added');
          this.dialogVisible = false;
          return;
        }

        const loading = Loading.service({ target: '.el-dialog' });
        addMangaEntry(this.mangaURL, this.currentListID)
          .then((newMangaEntry) => {
            this.addEntry(newMangaEntry.data);
            this.closeModal(loading);
          })
          .catch((error) => {
            if (error.response.status === 400) {
              Message.error('URL is incorrect');
              loading.close();
            } else if (error.response.status === 404) {
              Message.info('Manga was not found');
              loading.close();
            } else {
              Message.error('Something went wrong');
              this.closeModal(loading);
            }
          });
      },
      closeModal(loading) {
        this.dialogVisible = false;
        loading.close();
        this.mangaURL = '';
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
