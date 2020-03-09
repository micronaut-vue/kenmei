/* eslint-disable import/prefer-default-export */
export const processList = (list) => {
  const lists = {};

  Object.entries(list.series).forEach(([_key, series]) => {
    lists[series.name] = series.manga;
  });

  return lists;
};
/* eslint-enable import/prefer-default-export */
