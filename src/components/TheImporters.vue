<template lang="pug">
  el-tabs(v-model="activeTab" stretch)
    el-tab-pane(label="Trakr.moe" name="trackrMoe")
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
    el-tab-pane(label="MangaDex" name="mangaDex")
      template(v-if="importInitiated")
        p.leading-normal.text-gray-600.text-center.break-normal
          | Your MangaDex MDList import has started. You will receive an email
          | when the series have been imported.
      template(v-else)
        el-input(
          v-model="importURL"
          placeholder="https://mangadex.cc/list/3"
          prefix-icon="el-icon-link"
        )
        p.text-gray-600.text-xs.italic
          | Provide your MangaDex MDList URL. It needs to be all lists link, not
          | specific ones like Reading or Completed.
        el-button.float-right(
          ref="importMangaDexButton"
          type="primary"
          @click="importMangaDex"
          :disabled="!validUrl"
        )
          | Import
</template>

<script>
  import pLimit from 'p-limit';
  import { mapGetters } from 'vuex';
  import {
    Tabs, TabPane, Input, Link, Upload, Button, Message, Loading,
  } from 'element-ui';

  import { secure } from '@/modules/axios';

  import ProgressBar from '@/components/ProgressBar';
  import { processList, sliceIntoBatches } from '@/services/importer';
  import { addMangaEntries } from '@/services/api';

  export default {
    components: {
      ProgressBar,
      'el-input': Input,
      'el-link': Link,
      'el-upload': Upload,
      'el-tabs': Tabs,
      'el-tab-pane': TabPane,
      'el-button': Button,
    },
    data() {
      return {
        activeTab: 'trackrMoe',
        importURL: '',
        importProgress: 0,
        importInitiated: false,
      };
    },
    computed: {
      ...mapGetters('lists', [
        'entryAlreadyExists',
      ]),
      validUrl() {
        return this.importURL.match(/(mangadex.org\/list[/])\d+$/) !== null;
      },
    },
    methods: {
      importMangaDex() {
        const loading = Loading.service({ target: '.el-dialog' });
        secure.post('/api/v1/importers/mangadex', { url: this.importURL })
          .then(() => {
            this.importInitiated = true;
          })
          .catch((_error) => {
            Message.error(
              'Something went wrong, try again later or contact hi@kenmei.co'
            );
          })
          .then(() => {
            loading.close();
          });
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
              chapterURL: url.generated_current_data.url,
              lastRead: url.title_data.current_chapter,
            }))
            .filter(url => !this.entryAlreadyExists(url.seriesURL));
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
          })
          .catch((_error) => {
            Message.error('Something went wrong');
          })
          .then(() => {
            loading.close();
            this.$emit('importCompleted');
          });
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
