import axios from 'axios';
import * as resource from '@/services/endpoints/importers';

describe('importers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('postTrackrMoe()', () => {
    it('makes a request to the resource and returns true', async () => {
      axios.post.mockResolvedValue({ status: 200 });

      const successful = await resource.postTrackrMoe({ lists: {} });

      expect(successful).toBeTruthy();
    });

    it('makes a request to the resource and returns false if failed', async () => {
      axios.post.mockRejectedValue({ status: 500 });

      const successful = await resource.postTrackrMoe({ lists: {} });
      expect(successful).toBeFalsy();
    });
  });
});
