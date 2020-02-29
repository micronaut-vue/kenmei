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
  import { bulkUpdateMangaEntry } from '@/services/api';

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
          this.selectedEntries.map(e => e.id), { manga_list_id: this.newListID }
        );

        loading.close();

        if (response) {
          Message.info(`${this.selectedEntries.length} entries updated`);
          response.map(e => this.updateEntry(e));
          this.$emit('editComplete');
        } else {
          Message.error("Couldn't update. Try refreshing the page");
        }
      },
    },
  };
</script>
