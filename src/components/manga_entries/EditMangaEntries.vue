<template lang="pug">
  base-modal(
    :visible="visible"
    :loading="loading"
    size="sm"
    @dialogClosed="$emit('cancelEdit')"
  )
    template(slot='body')
      .flex.flex-col.w-full
        .mt-3.text-center.sm_mt-0.sm_text-left.w-full
          label.block.text-sm.leading-5.font-medium.text-gray-700
            | List Name
          .mt-1.relative.rounded-md.shadow-sm.w-auto
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
        .mt-5.text-center.sm_text-left.w-full(v-if="!isBulkUpdate")
          label.block.text-sm.leading-5.font-medium.text-gray-700
            | Manga Source Name
          .mt-1.relative.rounded-md.shadow-sm.w-auto
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
    template(slot='actions')
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
  import { Message, Select, Option } from 'element-ui';
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
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        listID: null,
        mangaSourceID: null,
        availableSources: [],
        loadingSources: false,
        loading: false,
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
    watch: {
      selectedEntries(entries, oldEntries) {
        if (entries.length > 0 && entries !== oldEntries) {
          // TODO: Remove this when we move to filters
          // TODO: Remove toString() when list serializer returns an int
          this.listID = this.selectedEntry.manga_list_id.toString();

          if (!this.isBulkUpdate) { this.loadAvailableSources(); }
        }
      },
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
        this.loading = true;
        const params  = { manga_list_id: this.listID };

        if (!this.isBulkUpdate) { params.manga_source_id = this.mangaSourceID; }

        const response = this.isBulkUpdate
          ? await bulkUpdateMangaEntry(this.selectedEntriesIDs, params)
          : await updateMangaEntry(this.selectedEntry.id, params);

        this.loading = false;

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
