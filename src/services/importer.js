/* eslint-disable import/prefer-default-export */
export const processList = (list) => {
  const lists = {};
  const filterMD = manga => manga.filter(
    series => series.site_data.site === 'mangadex.org'
  );

  Object.entries(list.series).forEach(([_key, series]) => {
    lists[series.name] = filterMD(series.manga);
  });

  return lists;
};
/* eslint-enable import/prefer-default-export */
