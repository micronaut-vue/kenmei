<template lang="pug">
  #add-manga-entry
    label.font-size-b.primary-text Manga URL
    el-input.mt-3(
      v-model="mangaURL"
      placeholder="https://mangadex.org/title/7139/"
      prefix-icon="el-icon-link"
    )
    .mt-8.-mb-2.sm_flex.sm_flex-row-reverse
      span.sm_ml-3.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(
          ref="addMangaButton"
          @click="mangaDexSearch"
          :disabled="mangaURL.length === 0"
        )
          | Add
      span.mt-3.sm_mt-0.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(type="secondary" @click="$emit('dialogClosed')") Cancel
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
  import { Message, Input, Loading } from 'element-ui';
  import { addMangaEntry } from '@/services/api';

  export default {
    name: 'AddMangaEntry',
    components: {
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
    computed: {
      ...mapGetters('lists', [
        'findEntryFromIDs',
      ]),
    },
    methods: {
      ...mapMutations('lists', [
        'addEntry',
        'replaceEntry',
      ]),
      mangaDexSearch() {
        const loading = Loading.service({ target: '.add-manga-entry-dialog' });
        addMangaEntry(this.mangaURL, this.currentListID)
          .then((newMangaEntry) => {
            const { data } = newMangaEntry;
            const currentEntry = this.findEntryFromIDs(
              data.attributes.tracked_entries.map(e => e.id)
            );

            if (currentEntry) {
              this.replaceEntry({ currentEntry, newEntry: data });
            } else {
              this.addEntry(newMangaEntry.data);
            }

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
