<template lang="pug">
  #add-manga-entry
    label.font-size-b.primary-text Manga URL
    el-input.mt-3(
      v-model="mangaURL"
      placeholder="https://mangadex.org/title/7139/"
      prefix-icon="el-icon-link"
    )
    .mt-8.-mb-2.text-right
      el-button(@click="$emit('dialogClosed')") Cancel
      el-button(
        ref="addMangaButton"
        type="primary"
        @click="mangaDexSearch"
        :disabled="mangaURL.length === 0"
      )
        | Add
</template>

<script>
  import { mapMutations } from 'vuex';
  import {
    Message, Button, Input, Loading,
  } from 'element-ui';
  import { addMangaEntry } from '@/services/api';

  export default {
    name: 'AddMangaEntry',
    components: {
      'el-button': Button,
      'el-input': Input,
    },
    props: {
      currentListID: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        mangaURL: '',
      };
    },
    methods: {
      ...mapMutations('lists', [
        'addEntry',
      ]),
      mangaDexSearch() {
        const loading = Loading.service({ target: '.add-manga-entry-dialog' });
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
            } else if (error.response.status === 406) {
              Message.info('Manga already added');
              loading.close();
            } else {
              Message.error('Something went wrong');
              this.closeModal(loading);
            }
          });
      },
      closeModal(loading) {
        this.$emit('dialogClosed');
        loading.close();
        this.mangaURL = '';
      },
    },
  };
</script>
