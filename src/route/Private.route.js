


import React from "react";
import { Navigate } from "react-router-dom";
// import {isLogin} from "../utils";
import { ROUTES } from "./constant";
/**
 * 
 * @param {*} param0  component of page
 * @returns private route
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
  localStorage.getItem("authToken") ? <Component {...rest} /> : <Navigate replace to={ROUTES.SIGNIN} />
  );
};

export default PrivateRoute;