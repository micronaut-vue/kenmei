<template lang="pug">
  base-modal(
    :visible="visible"
    :loading="loading"
    size="sm"
    @dialogClosed="closeModal()"
  )
    template(slot='body')
      .mt-3.text-center.sm_mt-0.sm_text-left.w-full
        label.block.text-sm.font-medium.leading-5.text-gray-700(for='url')
          | Manga URL
        .mt-1.relative.rounded-md.shadow-sm
          .absolute.inset-y-0.left-0.pl-3.flex.items-center.pointer-events-none
             i.el-icon-link.text-gray-400.sm_text-sm.sm_leading-5
          input#email.form-input.block.w-full.pl-10.sm_text-sm.sm_leading-5(
            ref="manga_url"
            aria-label='Manga URL'
            name='manga_url'
            v-model.trim="mangaURL"
            placeholder='https://mangadex.org/title/7139/'
          )
        p.mt-2.text-xs.text-gray-500
          | When using a chapter URL, last read chapter will be pre-populated
    template(slot='actions')
      span.flex.w-full.rounded-md.shadow-sm.sm_ml-3.sm_w-auto
        base-button(
          ref="addMangaButton"
          @click="mangaDexSearch"
          :disabled="mangaURL.length === 0"
        )
          | Add
      span.mt-3.flex.w-full.rounded-md.shadow-sm.sm_mt-0.sm_w-auto
        base-button(type="secondary" @click="closeModal()") Cancel
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
  import { Message } from 'element-ui';
  import { addMangaEntry } from '@/services/api';

  export default {
    name: 'AddMangaEntry',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      currentListID: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        mangaURL: '',
        loading: false,
      };
    },
    computed: {
      ...mapGetters('lists', [
        'findEntryFromIDs',
      ]),
    },
    watch: {
      visible(val) {
        if (val) {
          this.$nextTick(() => { this.$refs.manga_url.focus(); });
        }
      },
    },
    methods: {
      ...mapMutations('lists', [
        'addEntry',
        'replaceEntry',
      ]),
      mangaDexSearch() {
        this.loading = true;

        addMangaEntry(this.mangaURL, this.currentListID)
          .then((newMangaEntry) => {
            const { data } = newMangaEntry;
            const currentEntry = this.findEntryFromIDs(
              data.attributes.tracked_entries.map((e) => e.id)
            );

            if (currentEntry) {
              this.replaceEntry({ currentEntry, newEntry: data });
            } else {
              this.addEntry(newMangaEntry.data);
            }

            this.closeModal();
          })
          .catch((error) => {
            const { status, data } = error.response;

            if (status === 404 || status === 406) {
              Message.info(data);
              this.loading = false;
            } else {
              Message.error('Something went wrong');
              this.closeModal();
            }
          });
      },
      closeModal() {
        this.$emit('dialogClosed');
        this.loading = false;
        this.mangaURL = '';
      },
    },
  };
</script>

<style lang="scss" media="screen" scoped>
  @tailwind base;

  input {
    @apply appearance-none rounded-md block w-full py-2 pl-8;
    @apply border border-gray-300 text-gray-900;

    &:focus {
      @apply outline-none shadow-outline-blue border-blue-300 z-10;
    }

    @screen sm {
      @apply text-sm leading-5;
    }
  }
</style>
