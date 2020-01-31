import { secure } from '@/modules/axios';

export const addMangaEntry = (seriesURL, mangaListID) => secure
  .post('/api/v1/manga_entries/', {
    manga_entry: {
      series_url: seriesURL,
      manga_list_id: mangaListID,
    },
  })
  .then((response) => {
    if (response.data.error) { return {}; }

    return response.data;
  });

export const updateMangaEntry = (id, attributes) => secure
  .put(`/api/v1/manga_entries/${id}`, { manga_entry: attributes })
  .then((response) => {
    if (response.data.error) { return false; }

    return response.data.data;
  })
  .catch(_error => false);

export const bulkUpdateMangaEntry = (ids, attributes) => secure
  .put('/api/v1/manga_entries/bulk_update', { ids, manga_entry: attributes })
  .then((response) => {
    if (response.data.error) { return false; }

    return response.data.data;
  })
  .catch(_error => false);

export const bulkDeleteMangaEntries = seriesIDs => secure
  .delete('/api/v1/manga_entries/bulk_destroy', { data: { ids: seriesIDs } })
  .then(() => true)
  .catch(() => false);
