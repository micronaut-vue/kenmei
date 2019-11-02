import { secure } from '@/modules/axios';

// This can extract both the series and chapter, we want to make use of that
export const extractSeriesID = url => url.match(/(?!\/)\d+/g)[0];

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

export const updateMangaEntry = entry => secure
  .put(`/api/v1/manga_entries/${entry.id}`, {
    manga_entry: {
      last_chapter_read: entry.attributes.last_chapter_available,
      last_chapter_read_url: entry.links.last_chapter_available_url,
    },
  })
  .then((response) => {
    if (response.data.error) { return false; }

    return response.data.data;
  })
  .catch(_error => false);

export const deleteMangaEntry = seriesID => secure
  .delete(`/api/v1/manga_entries/${seriesID}`)
  .then(_response => true)
  .catch(_request => false);

export const addMangaEntries = urls => secure
  .post('/api/v1/manga_entries/bulk', { urls })
  .then((response) => {
    if (response.data.error) { return []; }

    return response.data;
  });
