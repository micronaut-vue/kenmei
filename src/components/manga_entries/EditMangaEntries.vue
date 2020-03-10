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
        :disabled="loadingSources"
        filterable
      )
        el-option(
          v-for="source in availableSources"
          :key="source.id"
          :label="source.name"
          :value="source.id"
        )
    .mt-8.-mb-2.sm_flex.sm_flex-row-reverse
      span.sm_ml-3.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(
          ref="updateEntryButton"
          @click="updateMangaEntries"
          :disabled="loadingSources"
        )
          | Update
      span.mt-3.sm_mt-0.flex.w-full.rounded-md.shadow-sm.sm_w-auto
        base-button(type="secondary" @click="$emit('cancelEdit')") Cancel
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import {
    Message, Loading, Select, Option,
  } from 'element-ui';
  import { updateMangaEntry, bulkUpdateMangaEntry } from '@/services/api';
  import { getMangaSources } from '@/services/endpoints/MangaSources';

  export default {
    name: 'EditMangaEntries',
    components: {
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
        availableSources: [],
        loadingSources: false,
      };
    },
    computed: {
      ...mapState('lists', [
        'lists',
      ]),
      selectedEntry() {
        return this.selectedEntries[0];
      },
      selectedEntriesIDs() {
        return this.selectedEntries.map(entry => entry.id);
      },
      isBulkUpdate() {
        return this.selectedEntries.length > 1;
      },
    },
    mounted() {
      // TODO: Remove this when we move to filters
      // TODO: Remove toString() when list serializer returns an int
      this.listID = this.selectedEntry.manga_list_id.toString();

      if (!this.isBulkUpdate) { this.loadAvailableSources(); }
    },
    methods: {
      ...mapMutations('lists', [
        'updateEntry',
        'replaceEntry',
      ]),
      toggleLoading() {
        this.loadingSources = !this.loadingSources;
      },
      async loadAvailableSources() {
        this.toggleLoading();

        const response = await getMangaSources(
          this.selectedEntry.manga_series_id
        );

        if (response) {
          this.toggleLoading();

          this.availableSources = response.data;
          this.mangaSourceID = this.selectedEntry.manga_source_id;
        } else {
          Message.error(
            "Couldn't fetch available manga sites. Try refreshing the page"
          );
        }
      },
      async updateMangaEntries() {
        const loading = Loading.service({ target: '.edit-manga-entry-dialog' });
        const params  = { manga_list_id: this.listID };

        if (!this.isBulkUpdate) { params.manga_source_id = this.mangaSourceID; }

        const response = this.isBulkUpdate
          ? await bulkUpdateMangaEntry(this.selectedEntriesIDs, params)
          : await updateMangaEntry(this.selectedEntry.id, params);

        loading.close();

        if (response) {
          Message.info(`${this.selectedEntries.length} entries updated`);

          if (Array.isArray(response)) {
            response.map(e => this.updateEntry(e));
          } else {
            this.replaceEntry({
              currentEntry: this.selectedEntry, newEntry: response,
            });
          }

          this.$emit('editComplete');
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
    },
  };
</script>
