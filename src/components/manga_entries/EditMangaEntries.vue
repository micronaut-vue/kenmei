<template lang="pug">
  #edit-manga-entries
    el-select.rounded.w-full(
      v-model="newListID"
      placeholder="Select new list"
    )
      el-option(
        v-for="list in lists"
        :key="list.id"
        :label="list.attributes.name"
        :value="list.id"
      )
    .mt-8.-mb-2
      el-button(
        ref="reportEntryErrorButton"
        type="danger"
        @click="reportEntryError"
      )
        | Wrong Info?
      .float-right
        el-button(@click="closeEditModal('cancelEdit')") Cancel
        el-button(
          ref="updateEntryButton"
          type="primary"
          @click="updateMangaEntries"
        )
          | Update
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import {
    Message, Loading, Button, Select, Option,
  } from 'element-ui';
  import {
    postMangaEntriesErrors,
  } from '@/services/endpoints/MangaEntriesErrors';
  import { bulkUpdateMangaEntry } from '@/services/api';

  export default {
    name: 'EditMangaEntries',
    components: {
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
    },
    props: {
      selectedSeriesIDs: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        newListID: null,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
      ]),
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
      ]),
      async updateMangaEntries() {
        const loading = Loading.service({ target: '.edit-manga-entry-dialog' });
        const response = await bulkUpdateMangaEntry(
          this.selectedSeriesIDs, { manga_list_id: this.newListID }
        );

        loading.close();

        if (response) {
          Message.info(`${this.selectedSeriesIDs.length} entries updated`);
          response.map(e => this.updateEntry(e));
          this.closeEditModal('editComplete');
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
      async reportEntryError() {
        const successful = await postMangaEntriesErrors(this.selectedSeriesIDs);

        if (successful) {
          this.closeEditModal('editComplete');
          Message.success(
            'Issue reported. Entries will be updated'
              + ' automatically shortly or investigated in detail later'
          );
        } else {
          Message.error(
            'Failed to report. Try reloading the page before trying again'
          );
        }
      },
      closeEditModal(emitEvent) {
        this.$emit(emitEvent);
        this.newListID = null;
      },
    },
  };
</script>
