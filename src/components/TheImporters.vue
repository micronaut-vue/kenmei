<template lang="pug">
  el-tabs(v-model="activeTab" stretch)
    el-tab-pane(label="Trakr.moe" name="trackrMoe")
      template(v-if="trackrMoeimportInitiated")
        p.leading-normal.text-gray-600.text-center.break-normal
          | Your Trackr.moe import has started. You will receive an email
          | when the series have been imported.
      template(v-else)
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
    el-tab-pane(label="MangaDex" name="mangaDex")
      template(v-if="mangaDexImportInitiated")
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
  import { mapGetters } from 'vuex';
  import {
    Tabs, TabPane, Input, Link, Upload, Button, Message, Loading,
  } from 'element-ui';

  import { secure } from '@/modules/axios';

  import ProgressBar from '@/components/ProgressBar';
  import { processList } from '@/services/importer';
  import { postTrackrMoe } from '@/services/endpoints/importers';

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
        mangaDexImportInitiated: false,
        trackrMoeimportInitiated: false,
      };
    },
    computed: {
      ...mapGetters('lists', [
        'entryAlreadyExists',
      ]),
      validUrl() {
        return this.importURL.match(/(mangadex.(cc|org)\/list[/])\d+$/) !== null;
      },
    },
    methods: {
      importMangaDex() {
        const loading = Loading.service({ target: '.el-dialog' });
        secure.post('/api/v1/importers/mangadex', { url: this.importURL })
          .then(() => {
            this.mangaDexImportInitiated = true;
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
      async processMangaDexList(list) {
        const filteredLists = {};
        const listsToImport = processList(list);

        Object.entries(listsToImport).forEach(([name, list]) => {
          filteredLists[name] = list
            .map(url => ({
              seriesURL: url.full_title_url,
              chapterURL: url.generated_current_data.url,
              lastRead: url.title_data.current_chapter,
            }));
        });

        const loading    = Loading.service({ target: '.el-upload-dragger' });
        const successful = await postTrackrMoe(filteredLists);

        if (successful) {
          this.trackrMoeimportInitiated = true;
        } else {
          Message.error(
            'Something went wrong, try again later or contact hi@kenmei.co'
          );
        }

        loading.close();
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
