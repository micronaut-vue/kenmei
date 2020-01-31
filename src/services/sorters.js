/* eslint-disable camelcase */
export const unread = (entry) => {
  const { last_chapter_read_url, last_chapter_available_url } = entry.links;


  return last_chapter_available_url
    && last_chapter_read_url !== last_chapter_available_url;
};

const titleSort = (entryA, entryB) => {
  const entryATitle = entryA.attributes.title.toLowerCase();
  const entryBTitle = entryB.attributes.title.toLowerCase();

  return entryATitle.localeCompare(entryBTitle);
};
/* eslint-enable camelcase */

const newReleasesSort = (entryA, entryB) => Number(unread(entryB))
  - Number(unread(entryA));

const releasedAtSort = (a, b) => {
  const aReleasedAt = a.attributes.last_released_at;
  const bReleasedAt = b.attributes.last_released_at;

  // Descending order, with null always being the oldest
  return (aReleasedAt === null) - (bReleasedAt === null)
    || -(aReleasedAt > bReleasedAt)
    || +(aReleasedAt < bReleasedAt);
};

export function sortBy(array, sortType, order) {
  let sortedData = [];

  switch (sortType) {
  case 'attributes.last_released_at':
    sortedData = array.sort(releasedAtSort);
    break;
  case 'newReleases':
    sortedData = array.sort(releasedAtSort).sort(newReleasesSort);
    break;
  case 'attributes.title':
    sortedData = array.sort(titleSort);
    break;
  default:
    sortedData = array.sort(newReleasesSort);
  }

  if (order === 'descending') { return sortedData.reverse(); }

  return sortedData;
}
