<template lang="pug">
  .container.mx-auto.w-full.h-full.flex.flex-col.items-center
    .flex.flex-col.w-full.max-w-4xl.pt-32.pb-16
      .mx-5.mb-5(class="md:mx-0")
        el-select.shadow-md.rounded.float-right(
          v-model="currentListID"
          placeholder="Select"
        )
          el-option(
            v-for="list in lists"
            :key="list.id"
            :label="list.attributes.name"
            :value="list.id"
          )
      .mx-5.mb-5(class="md:mx-0")
        el-button.shadow-md(
          v-show="selectedSeriesIDs.length > 0"
          ref="removeSeriesButton"
          type="danger"
          size="medium"
          @click="removeSeries"
          round
        )
          i.el-icon-delete.mr-1
          | Remove
        el-button.shadow-md.float-right(
          ref="openAddMangaModalButton"
          type="primary"
          size="medium"
          @click="dialogVisible = true"
          round
        )
          i.el-icon-plus.mr-1
          | Add Manga
        el-button.shadow-md.float-right.mr-3(
          type="success"
          size="medium"
          @click="importDialogVisible = true"
          round
        )
          i.el-icon-upload2.mr-1
          | Import
      .flex-grow.mx-5(class="md:mx-0")
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
        el-upload(
          ref="upload"
          action=""
          :http-request="processUpload"
          :multiple="false"
          :show-file-list="false"
          accept="application/json"
          drag
          )
          i.el-icon-upload
          .el-upload__text
            | Drop file here or click to upload
          .el-upload__tip(slot="tip")
            | You can download your Trackr.moe list
            |
            el-link.align-baseline.text-xs(
              href="https://trackr.moe/user/options"
              :underline="false"
              target="_blank"
            )
              | here
            progress-bar.mt-2(:percentage='importProgress')
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
  import pLimit from 'p-limit';
  import {
    mapActions, mapState, mapMutations, mapGetters,
  } from 'vuex';
  import {
    Message, Loading, Dialog, Button, Input, Upload, Link, Select, Option,
  } from 'element-ui';

  import TheMangaList from '@/components/TheMangaList';
  import ProgressBar from '@/components/ProgressBar';
  import {
    addMangaEntry, addMangaEntries, deleteMangaEntry, extractSeriesID,
  } from '@/services/api';
  import { processList, sliceIntoBatches } from '@/services/importer';

  export default {
    name: 'MangaList',
    components: {
      TheMangaList,
      ProgressBar,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-upload': Upload,
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
        importProgress: 0,
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
      mangaDexSearch() {
        if (this.alreadyExists(this.mangaURL)) {
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
      alreadyExists(mangaURL) {
        // TODO: We want to save and send back MangaDex ID from back-end
        const mangaID = extractSeriesID(mangaURL);
        return this.entryAlreadyExists(mangaID);
      },
      processMangaDexList(list) {
        let seriesImported  = 0;
        const filteredLists = {};
        const promiseLimit  = pLimit(1);
        const listsToImport = processList(list);

        Object.entries(listsToImport).forEach(([name, list]) => {
          filteredLists[name] = list
            .map(url => ({
              seriesURL: url.full_title_url,
              lastRead: url.title_data.current_chapter,
            }))
            .filter(url => !this.alreadyExists(url.seriesURL));
        });

        if (Object.values(filteredLists).every(list => list.length === 0)) {
          Message.info('Nothing new to import');
          return;
        }

        const entriesToImport = Object.values(filteredLists).flat();
        const URLChunks       = sliceIntoBatches(filteredLists);

        const requestList = URLChunks.map(payload => promiseLimit(
          () => addMangaEntries(payload).then(
            (importedList) => {
              seriesImported += importedList.data.length;
              this.importProgress = Math.floor(
                seriesImported / entriesToImport.length * 100
              );

              return importedList.data;
            }
          )
        ));

        this.importMangaInBatches(requestList);
      },
      async importMangaInBatches(requestList) {
        const loading = Loading.service({ target: '.el-upload-dragger' });
        await Promise.all(requestList)
          .then((importedList) => {
            const importedManga = importedList.flat();

            Message.info(`Imported ${importedManga.length} series`);
            this.importDialogVisible = false;
          })
          .catch((_error) => {
            Message.error('Something went wrong');
          })
          .finally(() => {
            loading.close();
          });

        // Request all lists again to get new lists if created
        // TODO: Figure out based on relationships if there was a new list added
        this.retrieveLists();
      },
      processUpload(file) {
        // Reset import progress
        this.importProgress = 0;

        const reader = new FileReader();

        reader.onload = ((theFile) => {
          const json = JSON.parse(theFile.target.result);
          this.processMangaDexList(json);
        });

        reader.readAsText(file.file);
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
