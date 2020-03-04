<template lang="pug">
  #edit-manga-entries
    label.font-size-b.primary-text List Name
    el-select.rounded.w-full.mt-3(
      v-model="listID"
      placeholder="Select new list"
    )
      el-option(
        v-for="list in lists"
        :key="list.id"
        :label="list.attributes.name"
        :value="list.id"
      )
    .mt-3(v-if="!isBulkUpdate")
      label.font-size-b.primary-text Manga Source Name
      el-select.rounded.w-full.mt-3(
        v-model="mangaSourceID"
        placeholder="Select new source"
        filterable
      )
        el-option(
          v-for="source in availableSources"
          :key="source.id"
          :label="source.name"
          :value="source.id"
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
        mangaSourceID: null,
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
      availableSources() {
        const sources = this.selectedEntries
          .map(entry => entry.attributes.available_sources);

        // This flattens the arrays
        return [].concat(...sources);
      },
    },
    mounted() {
      // TODO: Remove this when we move to filters
      // TODO: Remove toString() when list serializer returns an int
      this.listID = this.selectedEntries[0].manga_list_id.toString();

      if (!this.isBulkUpdate) {
        this.mangaSourceID = this.selectedEntries[0].manga_source_id;
      }
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
        'replaceEntry',
      ]),
      async updateMangaEntries() {
        const loading = Loading.service({ target: '.edit-manga-entry-dialog' });
        const params  = { manga_list_id: this.listID };

        if (!this.isBulkUpdate) { params.manga_source_id = this.mangaSourceID; }

        const response = this.isBulkUpdate
          ? await bulkUpdateMangaEntry(this.selectedEntriesIDs, params)
          : await updateMangaEntry(this.selectedEntriesIDs[0], params);

        loading.close();

        if (response) {
          Message.info(`${this.selectedEntries.length} entries updated`);

          if (Array.isArray(response)) {
            response.map(e => this.updateEntry(e));
          } else {
            const currentEntry = this.selectedEntries[0];

            this.replaceEntry({ currentEntry, newEntry: response });
          }

          this.$emit('editComplete');
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
    },
  };
</script>
