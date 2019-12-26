import { shallowMount, mount } from '@vue/test-utils';
import { Message } from 'element-ui';
import axios from 'axios';
import flushPromises from 'flush-promises';

import TheResetPassword from '@/components/TheResetPassword.vue';

describe('TheResetPassword.vue', () => {
  let resetPassword;

  beforeEach(() => {
    resetPassword = shallowMount(TheResetPassword);
  });

  describe('@events', () => {
    it('@click - when pressing Sign In link, emits componentChanged', () => {
      resetPassword = mount(TheResetPassword);

      resetPassword.find('.el-link').trigger('click');

      expect(resetPassword.emitted('componentChanged')[0]).toEqual(['TheSignIn']);
      expect(resetPassword.vm.$data.resetInitiated).not.toBeTruthy();
    });
  });

  describe('when resetting password', () => {
    it('POSTs to passwords endpoint and shows confirmation message', async () => {
      const axiosSpy = jest.spyOn(axios, 'post');

      axiosSpy.mockResolvedValue({ status: 200 });
      resetPassword.setData({ user: { email: 'test@example.com' } });

      resetPassword.vm.resetPassword();

      await flushPromises();

      expect(axiosSpy).toHaveBeenCalledWith(
        '/auth/passwords',
        { email: 'test@example.com' }
      );
    });

    it('shows server-side errors if request failed', async () => {
      const axiosSpy        = jest.spyOn(axios, 'post');
      const errorMessageSpy = jest.spyOn(Message, 'error');
      const mockResponse    = { response: { data: 'Things happened' } };

      resetPassword.setData({ user: { email: 'test@example.com' } });

      axiosSpy.mockRejectedValue(mockResponse);

      resetPassword.vm.resetPassword();

      await flushPromises();

      expect(errorMessageSpy).toBeCalled();
    });
  });
});
