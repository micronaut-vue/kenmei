import { secure } from '@/modules/axios';

/* eslint-disable import/prefer-default-export */
export const postMangaEntriesErrors = (entriesIDs, issueID) => secure
  .post('/api/v1/manga_entries_errors/', { ids: entriesIDs, issue_id: issueID })
  .then(() => true)
  .catch(() => false);
/* eslint-enable import/prefer-default-export */
