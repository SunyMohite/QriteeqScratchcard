import React from "react";
import api from "../services/feedaback";
export const UserInfo = React.createContext({});

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserinfo] = React.useState({});
  const getUserinfo = async () => {
    const data = await api.getProfile();
    setUserinfo(data?.data?.data);
  };

  
  React.useEffect(() => {
    if (localStorage.getItem("authToken")) {
      getUserinfo();
    }
  }, []);

  return (
    <UserInfo.Provider value={{ userInfo, getUserinfo }}>
      {children}
    </UserInfo.Provider>
  );
};

export default UserInfoProvider;
