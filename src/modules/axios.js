import axios from 'axios';

const DEV_API_URL = 'http://localhost:3000';
const PRODUCTION_API_URL = 'https://kenmei-api-pr-23.herokuapp.com/';

const currentEnv = () => (
  process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : DEV_API_URL
);

const logOutFailed = response => response.config.method === 'delete'
  && response.data.error === 'Signature has expired';

const setAuthConfig = (config) => {
  const token = localStorage.getItem('access');

  if (token) { config.headers.Authorization = `Bearer ${token}`; }

  return config;
};

const baseConfig = {
  baseURL: currentEnv(),
  headers: {
    'Content-Type': 'application/json',
  },
};

const secure = axios.create(baseConfig);
const plain  = axios.create(baseConfig);

plain.interceptors.request.use(config => setAuthConfig(config));
secure.interceptors.request.use(config => setAuthConfig(config));
secure.interceptors.response.use(null, (error) => {
  const { response } = error;
  const { config, status } = response;

  if (response && config && status === 401 && !logOutFailed(response)) {
    return plain
      .post('/refresh')
      .then((response) => {
        localStorage.access = response.data.access;

        return plain.request(error.response.config);
      }).catch(() => {
        delete localStorage.access;
        delete localStorage.vuex;

        window.location.reload(true);
      });
  }
  return Promise.reject(error);
});

export { secure, plain };
