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
            const { status, data } = error.response;

            if (status === 404 || status === 406) {
              Message.info(data);
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
