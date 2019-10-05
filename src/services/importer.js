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

export const sliceIntoBatches = (lists) => {
  const batchSize = 20;
  const URLChunks = [];

  Object.entries(lists).forEach(([name, list]) => {
    for (let i = 0; i < list.length; i += batchSize) {
      const formatURLs = list.slice(i, i + batchSize);
      URLChunks.push({ [name]: formatURLs });
    }
  });

  return URLChunks;
};
