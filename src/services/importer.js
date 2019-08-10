import { extractSeriesID } from '@/services/api';

export default (list) => {
  const mangaDexSeries = list.series.reading.manga.filter(
    series => series.site_data.site === 'mangadex.org'
  );

  const mangaDexIDs = mangaDexSeries.map(
    manga => extractSeriesID(manga.full_title_url)
  );

  return [].concat(...mangaDexIDs);
};
