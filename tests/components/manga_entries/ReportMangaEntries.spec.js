import { shallowMount } from '@vue/test-utils';
import { Message } from 'element-ui';
import flushPromises from 'flush-promises';
import ReportMangaEntries from '@/components/manga_entries/ReportMangaEntries.vue';
import * as mangaEntriesErrors from '@/services/endpoints/MangaEntriesErrors';

describe('ReportMangaEntries.vue', () => {
  let reportMangaEntries;
  let postMangaEntriesErrorsMock;

  beforeEach(() => {
    reportMangaEntries = shallowMount(ReportMangaEntries, {
      data() {
        return {
          currentIssue: 0,
        };
      },
      propsData: {
        selectedEntriesIDs: ['1'],
      },
    });
    postMangaEntriesErrorsMock = jest.spyOn(
      mangaEntriesErrors, 'postMangaEntriesErrors'
    );
  });

  afterEach(() => {
    expect(postMangaEntriesErrorsMock).toHaveBeenCalledWith(['1'], 0);
  });

  describe('if report was successful', () => {
    it('shows successful message', async () => {
      const infoMessageMock = jest.spyOn(Message, 'success');

      postMangaEntriesErrorsMock.mockResolvedValue(true);

      reportMangaEntries.vm.report();

      await flushPromises();

      expect(reportMangaEntries.emitted('closeDialog')).toBeTruthy();
      expect(infoMessageMock).toHaveBeenCalledWith(
        'Issue reported successfully'
      );
    });
  });

  describe('if report was unsuccessful', () => {
    it('shows failure message', async () => {
      const errorMessageMock = jest.spyOn(Message, 'error');

      postMangaEntriesErrorsMock.mockResolvedValue(false);

      reportMangaEntries.vm.report();

      await flushPromises();

      expect(errorMessageMock).toHaveBeenCalledWith(
        'Failed to report. Try reloading the page before trying again'
      );
    });
  });
});
