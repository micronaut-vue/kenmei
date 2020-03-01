<template lang="pug">
  #edit-manga-entries
    el-select.rounded.w-full(
      v-model="listID"
      placeholder="Select new list"
    )
      el-option(
        v-for="list in lists"
        :key="list.id"
        :label="list.attributes.name"
        :value="list.id"
      )
    .mt-8.-mb-2.text-right
      el-button(@click="$emit('cancelEdit')") Cancel
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
  import { updateMangaEntry, bulkUpdateMangaEntry } from '@/services/api';

  export default {
    name: 'EditMangaEntries',
    components: {
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
    },
    props: {
      selectedEntries: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        listID: null,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
      ]),
      selectedEntriesIDs() {
        return this.selectedEntries.map(entry => entry.id);
      },
      isBulkUpdate() {
        return this.selectedEntries.length > 1;
      },
    },
    mounted() {
      // TODO: Replace with selectedEntries[0].manga_list_id
      // TODO: Remove this when we move to filters
      this.listID = this.selectedEntries[0].relationships.manga_list.data.id;
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
      ]),
      async updateMangaEntries() {
        const loading = Loading.service({ target: '.edit-manga-entry-dialog' });
        const params = { manga_list_id: this.listID };

        const response = this.isBulkUpdate
          ? await bulkUpdateMangaEntry(this.selectedEntriesIDs, params)
          : await updateMangaEntry(this.selectedEntriesIDs[0], params);

        loading.close();

        if (response) {
          Message.info(`${this.selectedEntries.length} entries updated`);

          if (Array.isArray(response)) {
            response.map(e => this.updateEntry(e));
          } else {
            this.updateEntry(response);
          }

          this.$emit('editComplete');
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
    },
  };
</script>
