import axios from "axios";

axios.interceptors.response.use(null, (error) => {
  if (error && error.response) {
    if (error.response.status === 401) {
      // initial call to whoami will get intercepted here and redirect, need to throw log event
      // TODO: Do something
    }
    const { data } = error.response;
    const errorPayload =
      data.error ||
      data.errors ||
      data.error_message ||
      data.error_type ||
      data.message;
    if (errorPayload === "Please authenticate") {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(errorPayload);
  }

  return Promise.reject(error);
});
/**
 *
 * @param {*} path  endpoint
 * @returns data from api
 */
export function apiGet(path, profileToken) {
  const authToken = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: authToken
        ? `Bearer ${profileToken ? profileToken : authToken}`
        : null,
    },
  };

  return axios.get(path, config);
}

/**
 *
 * @param {*} path   endpoint
 * @param {*} data object of data
 * @returns   data from api
 */
export function apiPost(path, data) {
  const authToken = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : null,
      "Content-Type": "application/json",
    },
  };

  return axios.post(path, data, config);
}
/**
 *
 * @param {*} path   endpoint
 * @param {*} data object of data
 * @returns   data from api
 */
export function apiPatch(path, data, headers = {}) {
  const authToken = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...headers,
    },
  };

  return axios.patch(path, data, config);
}
/**
 *
 * @param {*} path   endpoint
 * @param {*} data object of data
 * @returns   data from api
 */
export function apiPut(path, data) {
  const authToken = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios.put(path, data, config);
}
/**
 *
 * @param {*} path   endpoint
 * @param {*} data params
 * @returns   data from api
 */
export function apiDelete(path, data) {
  const authToken = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios.delete(path, { ...config, ...data });
}

const instance = axios.create();

export default instance;
