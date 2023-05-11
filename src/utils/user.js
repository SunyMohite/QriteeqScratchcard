import jwt_decode from "jwt-decode";
export const currentUserid =localStorage.getItem("authToken")? jwt_decode(localStorage.getItem("authToken")):null;
