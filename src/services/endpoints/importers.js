import { secure } from '@/modules/axios';

/* eslint-disable import/prefer-default-export */
export const postTrackrMoe = filteredLists => secure
  .post('/api/v1/importers/trackr_moe', { lists: filteredLists })
  .then(() => true)
  .catch(() => false);
/* eslint-enable import/prefer-default-export */
