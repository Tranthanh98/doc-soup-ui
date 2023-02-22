import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

class RestService {
  constructor() {
    this.path = '';
    this.config = {
      baseURL: REACT_APP_API_URL,
      headers: { Authorization: '', 'Content-Type': 'application/json' },
    };
  }

  setPath(path) {
    this.path = path;
    return this;
  }

  setHeaders(options) {
    this.config.headers = { ...this.config.headers, ...options };
    return this;
  }

  setResponseType(type) {
    this.config.responseType = type;
    return this;
  }

  setToken(token) {
    this.config.headers.Authorization = `Bearer ${token}`;
    return this;
  }

  get() {
    return axios.get(this.path, this.config);
  }

  post(data = {}) {
    return axios.post(this.path, data, this.config);
  }

  put(data = {}) {
    return axios.put(this.path, data, this.config);
  }

  delete() {
    return axios.delete(this.path, this.config);
  }

  patch(data = {}) {
    return axios.patch(this.path, data, this.config);
  }

  setCancelToken(token) {
    this.config = { ...this.config, cancelToken: token };
    return this;
  }
}
export default RestService;
