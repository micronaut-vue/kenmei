<template lang="pug">
  .container.mx-auto.w-full.h-full.flex.flex-col.items-center
    .flex.flex-col.w-full.max-w-4xl.py-16
      .mx-5.mb-5(class="md:mx-0")
        el-button.float-right(
          ref="openAddMangaModalButton"
          type="primary"
          size="medium"
          @click="dialogVisible = true"
          round
        )
          i.el-icon-plus.mr-1
          | Add Manga
        el-button.float-right.mr-3(
          type="success"
          size="medium"
          @click="importDialogVisible = true"
          round
        )
          i.el-icon-upload2.mr-1
          | Import
      .flex-grow.mx-5(class="md:mx-0")
        the-manga-list(:tableData='tableData')
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
            | You can download your Trackr.moe list here
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
    Message, Loading, Dialog, Button, Input, Upload,
  } from 'element-ui';

  import TheMangaList from '@/components/TheMangaList';
  import { getManga, extractSeriesID, getMangaBulk } from '@/services/api';
  import Importer from '@/services/importer';

  export default {
    name: 'MangaList',
    components: {
      TheMangaList,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
      'el-upload': Upload,
    },
    data() {
      return {
        tableData: [],
        mangaURL: '',
        dialogVisible: false,
        importDialogVisible: false,
      };
    },
    methods: {
      mangaDexSearch() {
        const mangaID = extractSeriesID(this.mangaURL);

        if (this.alreadyExists(mangaID)) {
          Message.info('Manga already added');
          this.dialogVisible = false;
          return;
        }

        const loading = Loading.service({ target: '.el-dialog' });
        getManga(mangaID)
          .then((newManga) => {
            if (Object.keys(newManga).length === 0) {
              Message.info('Manga was not found');
              loading.close();
            } else {
              this.tableData.push(newManga);
              this.closeModal(loading);
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              Message.error('URL is incorrect');
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
      alreadyExists(mangaID) {
        return this.tableData.some(manga => manga.series.url.includes(mangaID));
      },
      sliceIntoBatches(ids) {
        const batchSize = 20;
        const IDChunks = [];

        for (let i = 0; i < ids.length; i += batchSize) {
          IDChunks.push(ids.slice(i, i + batchSize).join(' '));
        }

        return IDChunks;
      },
      filterNewMangaDexEntries(list) {
        return Importer(list).filter(value => !this.alreadyExists(value));
      },
      processMangaDexList(list) {
        const promiseLimit = pLimit(1);
        const seriesIDs = this.filterNewMangaDexEntries(list);

        if (seriesIDs.length === 0) {
          Message.info('Nothing new to import');
          return;
        }

        const IDChunks = this.sliceIntoBatches(seriesIDs);
        const requestList = IDChunks.map(ids => promiseLimit(
          () => getMangaBulk(ids).then(
            (importedList) => {
              return importedList;
            }
          )
        ));

        this.importMangaInBatches(requestList);
      },
      async importMangaInBatches(requestList) {
        const loading = Loading.service({ target: '.el-dialog' });

        await Promise.all(requestList)
          .then((importedList) => {
            const importedManga = importedList.flat();
            importedManga.forEach(newManga => this.tableData.push(newManga));

            Message.info(`Imported ${importedManga.length} series`);
            this.importDialogVisible = false;
          })
          .catch((_error) => {
            Message.error('Something went wrong');
          })
          .finally(() => { loading.close(); });
      },
      processUpload(file) {
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
