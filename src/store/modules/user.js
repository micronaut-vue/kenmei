import { Message } from 'element-ui';
import { secure, plain } from '@/modules/axios';

const state = {
  currentUser: null,
};

const getters = {
  signedIn: (state) => state.currentUser !== null,
};

const actions = {
  signIn({ commit }, data) {
    return plain.post('/api/v1/sessions/', { user: data })
      .then((response) => {
        commit('setCurrentUser', {
          user_id: response.data.user_id, email: response.data.email,
        });
        localStorage.access = response.data.access;
      })
      .catch((request) => {
        if (request.response.data.error === 'User unconfirmed') {
          Message.info(
            'Please check your email inbox and confirm your account first'
          );
        } else {
          Message.error(request.response.data.error);
        }
      });
  },
  signOut({ commit }) {
    return secure.delete('/api/v1/sessions/')
      .then(() => {
        commit('setCurrentUser', null);
        delete localStorage.access;
      })
      .catch((request) => {
        if (request.response.data.error === 'Signature has expired') {
          commit('setCurrentUser', null);
          delete localStorage.access;
        } else {
          Message.error(request.response.data.error);
        }
      });
  },
  updatePassword({ commit }, { resetPasswordToken, user }) {
    const payload = { user, reset_password_token: resetPasswordToken };

    return plain.put('/auth/passwords/', payload)
      .then((response) => {
        commit('setCurrentUser', { user_id: response.data.user_id });
        localStorage.access = response.data.access;
      })
      .catch((request) => {
        Message.error({
          dangerouslyUseHTMLString: true,
          message: request.response.data,
        });
      });
  },
};

const mutations = {
  setCurrentUser(state, data) {
    state.currentUser = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
