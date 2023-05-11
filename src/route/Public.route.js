import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./constant";
/**
 *
 * @param {*} param0   component of page
 * @returns  public route
 */
const PublicRoute = ({ component: Component, restricted, ...props }) => {
  return localStorage.getItem("authToken") && restricted ? (
    <Navigate replace to={ROUTES.DASHBOARD} />
  ) : (
    <Component {...props} />
  );
};

export default PublicRoute;
