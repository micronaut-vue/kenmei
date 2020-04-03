<template lang="pug">
  base-modal(
    :visible="visible"
    :loading="loading"
    size="sm"
    @dialogClosed="$emit('closeDialog')"
  )
    template(slot='body')
      el-tabs.w-full(v-model="activeTab" stretch)
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
              | Your MangaDex MDList import has started.
              | You will receive an email when the series have been imported.
          template(v-else)
            el-input(
              v-model.trim="importURL"
              placeholder="https://mangadex.cc/list/3"
              prefix-icon="el-icon-link"
            )
            p.text-xs.leading-5.text-gray-500
              | Provide your MangaDex MDList URL. It needs to be all lists link,
              | not specific ones like Reading or Completed.
            span.flex.w-full.rounded-md.shadow-sm.sm_w-auto
              base-button(
                ref="importMangaDexButton"
                @click="importMangaDex"
                :disabled="!validUrl"
              )
                | Import
</template>

<script>
  import {
    Tabs, TabPane, Input, Link, Upload, Message, Loading,
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
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        activeTab: 'trackrMoe',
        importURL: '',
        mangaDexImportInitiated: false,
        trackrMoeimportInitiated: false,
        loading: false,
      };
    },
    computed: {
      validUrl() {
        return this.importURL.match(/(mangadex.(cc|org)\/list[/])\d+$/) !== null;
      },
    },
    methods: {
      importMangaDex() {
        this.loading = true;

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
            this.loading = false;
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
              lastRead: url.generated_current_data.number,
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
        const reader = new FileReader();

        reader.onload = ((theFile) => {
          const json = JSON.parse(theFile.target.result);

          if (json.series) {
            this.processMangaDexList(json);
          } else if (json.reading) {
            Message.error(
              `You are trying to import partial list. Please use export from
              Trakr.moe settings page.`
            );
          } else {
            Message.error(
              'File is incorrect. Make sure you are uploading Trackr.moe export'
            );
          }
        });

        reader.readAsText(file.file);
      },
    },
  };
</script>

<style media="screen" lang="scss">
  .el-upload, .el-upload-dragger {
    @apply w-full;
  }
</style>
