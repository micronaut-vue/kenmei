<template lang="pug">
  .flex.flex-col.w-full.max-w-4xl
    .row.mx-5.mb-5(class="md:mx-0")
      el-button.float-right(
        ref="openAddMangaModalButton"
        type="primary"
        @click="dialogVisible = true"
        round
      )
        | Add Manga
    .row.mx-5(class="md:mx-0")
      the-manga-list(:tableData='tableData')
    el-dialog(
      title="Add Manga"
      :visible.sync="dialogVisible"
      custom-class="custom-dialog"
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
    Message, Loading, Dialog, Button, Input,
  } from 'element-ui';

  import TheMangaList from '@/components/TheMangaList';
  import { getManga, extractSeriesID } from '@/services/api';

  export default {
    name: 'MangaList',
    components: {
      TheMangaList,
      'el-button': Button,
      'el-dialog': Dialog,
      'el-input': Input,
    },
    data() {
      return {
        tableData: [],
        mangaURL: '',
        dialogVisible: false,
      };
    },
    methods: {
      mangaDexSearch() {
        const mangaID = extractSeriesID(this.mangaURL);

        if (this.tableData.some(manga => manga.series.url.includes(mangaID))) {
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
    },
  };
</script>

<style media="screen" lang="scss">
  @media (max-width: 640px) {
    .custom-dialog {
      width: 100% !important;
    }
  }
</style>
