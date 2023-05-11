import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constant";
import PublicRoute from "./Public.route";
import PrivateRoute from "./Private.route";
import { Dashboard, Home,Feedback,Settings, Login,CussWords,Users } from "../pages";
import { AppHeader } from "../components";
import Cusswords from "../pages/CussWords";
import Campaign from "../pages/Campaign";
import Chat from "../pages/Chat";
import Checkpoll from "../pages/Chat/checkpoll";
import Rewards from "../pages/Rewards";
const Routers = () => {
  const publicRoutes = [
    {
      key: 1,
      path: ROUTES.INDEX,
      component: Login,
      restricted: true,
      exact:true
    },
  ];
  const privateRoutes = [
    {
      key: 1,
      path: ROUTES.DASHBOARD,
      component: Dashboard,
      restricted: false,
      exact:true
    },
    {
      key: 2,
      path: ROUTES.FEEDBACK,
      component: Feedback,
      restricted: false,
      exact:false
    },
    {
      key: 3,
      path: ROUTES.CUSSWORD,
      component: Cusswords,
      restricted: false,
      exact:false
    },
    {
      key: 4,
      path: ROUTES.USERS,
      component: Users,
      restricted: false,
      exact:false
    },
    {
      key: 5,
      path: ROUTES.Campaign,
      component: Campaign,
      restricted: false,
      exact:false
    },
    {
      key: 6,
      path: ROUTES.Chat,
      component: Chat,
      restricted: false,
      exact:true
    },
    {
      key: 7,
      path: ROUTES.Rewards,
      component: Rewards,
      restricted: false,
      exact:true
    },
    {
      key: 8,
      path: ROUTES.Checkpoll,
      component: Checkpoll,
      restricted: false,
      exact:true
    },
  ];
  return (
  
      <Router>
          <AppHeader>
        <Routes>
          {publicRoutes.map((i) => (
            <Route
              path={i?.path}
              key={i?.key?.toString()}
              element={
                <PublicRoute
                  restricted={i?.restricted}
                  key={i?.key}
                  component={i?.component}
                  exact={i?.exact}
                />
              }
            />
          ))}
          {privateRoutes.map((i) => (
            <Route
              path={i?.path}
              key={i?.key?.toString()}
              element={
                <PrivateRoute
                  restricted={i?.restricted}
                  key={i?.key}
                  component={i?.component}
                  exact={false}
                />
              }
            />
          ))}
        </Routes>
        </AppHeader>
      </Router>

  );
};

export default Routers;
