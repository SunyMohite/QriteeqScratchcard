/* eslint-disable import/no-anonymous-default-export */
import {  SERVER_URL_V2 } from "../utils/server";
import { apiDelete, apiGet, apiPatch, apiPost } from "../utils/axios";

const GET_FEEDBACK = SERVER_URL_V2 + "/admin/feedback?assigned=true";

const GET_FEEDBACK_FILTER = SERVER_URL_V2 + "/admin/feedback";
const GET_COUNT = SERVER_URL_V2 + "/admin/feedbackCount";
const UPDATE_FEEDBACK = SERVER_URL_V2 + "/admin/updateFeedbackStatus";
const GET_RECENT_ACTIVITY =
  SERVER_URL_V2 + "/admin/getRecentActivity?page=1&limit=5";
const GET_FLAGGED_COMMENTS = SERVER_URL_V2 + "/admin/getFlaggedComments";
const UPDATE_COMMENT = SERVER_URL_V2+ "/admin/updateCommentStatus";
// ?status=pending&limit=10&page=1
export default {
  getFeedback: (payload) =>
    apiGet(
      `${GET_FEEDBACK}&status=${payload?.status}&limit=${payload?.limit}&page=${payload?.page}`
    ),
  getFeedbackcount: () => apiGet(GET_COUNT),
  updatefeedback: (payload) => apiPatch(UPDATE_FEEDBACK, payload),
  updateComment:(payload)=> apiPatch(UPDATE_COMMENT, payload),
  getRecentactivity: () => apiGet(GET_RECENT_ACTIVITY),
  getFlaggedComments: (payload) =>
    apiGet(
      `${GET_FLAGGED_COMMENTS}?status=${payload?.status}&limit=${payload?.limit}&page=${payload?.page}`
    ),
    
  getProfile: () => apiGet(SERVER_URL_V2 + "/user"),
  getAllUsers: (payload) =>
    apiGet(
      `${SERVER_URL_V2}/admin/getAllUsers?limit=${payload?.limit}&page=${payload?.page}`
    ),
  getUserData: (payload) =>
    apiGet(`${SERVER_URL_V2}/admin/getUser?id=${payload?.id}`),

  getCussWords:()=>apiGet(`${SERVER_URL_V2}/word?limit=100`),
  addCussWord:(payload)=>apiPost(`${SERVER_URL_V2}/word`,payload),
  updateCussWord:(id,payload)=>apiPatch(`${SERVER_URL_V2}/word?id=${id}`,payload),
  removeCussWord:(id)=>apiDelete(`${SERVER_URL_V2}/word?id=${id}`),

  searchUsers:(payload)=>apiGet(`${SERVER_URL_V2}/admin/getAllUsers?search=${payload.search}`),
  searchFeedbacks:(payload)=>apiGet(`${SERVER_URL_V2}/admin/feedback?status=${payload.status}&limit=${payload.limit}&page=${payload.page}&search=${payload.search}`),
  searchFlaggedComments:(payload)=>apiGet(`${SERVER_URL_V2}/admin/getFlaggedComments?limit=${payload.limit}&page=${payload.page}&status=${payload.status}&search=${payload.search}`),
  searchDisputedFeedbacks:(payload)=>apiGet(`${SERVER_URL_V2}/admin/dispute?limit=${payload.limit}&page=${payload.page}&assigned=${payload.assigned}&search=${payload.search}`),
  getCussFeedbacks:()=>apiGet(`${SERVER_URL_V2}/admin/feedback?status=cussWord`),
  getUserReceivedFeedback: (payload) =>
    apiGet(`${SERVER_URL_V2}/admin/feedback?user=${payload?.user}&limit=${payload?.limit}&page=${payload?.page}`),
  getUserPostedFeedback: (payload) =>
    apiGet(`${SERVER_URL_V2}/admin/feedback?sender=${payload?.sender}&limit=${payload?.limit}&page=${payload?.page}`),
  getFeedbackfilter: (payload) =>
    apiGet(
      `${GET_FEEDBACK_FILTER}?assigned=${payload.assigned}&status=${payload?.status}&limit=${payload?.limit}&page=${payload?.page}`
    ),
  getAdminFeedbacks: (payload) =>
    apiGet(
      `${SERVER_URL_V2}/admin/feedback?status=${payload?.status}&limit=${payload?.limit}&page=${payload?.page}`
    ),
  getAllModerators: () =>
    apiGet(`${SERVER_URL_V2}/admin/getAllUsers?limit=10&page=1&role=moderator`),
  // getCussWords: () => apiGet(`${SERVER_URL_V2}/word`),
  assignModerator: (payload) =>
    apiPost(`${SERVER_URL_V2}/admin/assignModerator`, payload),
  updateExistingUsers: (id, payload) =>
    apiPatch(`${SERVER_URL_V2}/admin/edituser/?userId=${id}`, payload),
    autoApprove:(id,payload)=>apiPatch(`${SERVER_URL_V2}/admin/autoApproval/?userId=${id}`,payload),

   getStatistics:()=>apiGet(`${SERVER_URL_V2}/admin/getStatistics`),
   getCampaigns:(payload)=>apiGet(`${SERVER_URL_V2}/admin/getCampaign?active=${payload?.status}&limit=${payload?.limit}&page=${payload?.page}`),
   getDisputedFeedbacks:(payload)=>apiGet(`${SERVER_URL_V2}/admin/dispute?limit=${payload?.limit}&page=${payload?.page}&assigned=${payload?.assigned}`),
   getReferrals:()=>apiGet(`${SERVER_URL_V2}/admin/getReferral`),
   getCampaignCount:(payload)=>apiGet(`${SERVER_URL_V2}/admin/getCampaign?userId=${payload?.id}`)
};
