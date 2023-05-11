import { DEV_SERVER_URL, SERVER_URL, SERVER_URL_V2 } from "../utils/server";
import {  apiPost } from "../utils/axios";

const AUTH = SERVER_URL_V2 + "/admin/login";

export default {
  signin: (payload) => apiPost(AUTH, payload),
};
