import React, { useState, useContext, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Popover,
  Drawer,
  Row,
  Col,
  Statistic,
  Typography,
} from "antd";
import {
  AndroidFilled,
  MenuUnfoldOutlined,
  MobileOutlined,
  RocketFilled,
  UserOutlined,
} from "@ant-design/icons";
import {
  LogoIcon,
  DashboardIcon,
  FeedbackIcon,
  CussWordIcon,
  UsersIcon,
  SettingIcon,
  ChatIcon,
  
} from "../../icons";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../route/constant";
import useViewport from "../../hooks/useViewport";
import { UserInfo } from "../../context/userInfo";
import api from "../../services/feedaback";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PollIcon from '@mui/icons-material/Poll';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const AppHeader = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [appDownloads, setAppDownloads] = useState("");
  const [todayReview, setTodayReview] = useState("");
  const [totalUsers, setTotalUsers] = useState("");
  const [totalReviews, setTotalReviews] = useState("");
  const [weeklyActive, setWeeklyActive] = useState("");

  const navigate = useNavigate();

  const { isMobile, isLaptop } = useViewport();
  const { userInfo } = useContext(UserInfo);

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };

  const getStatsData = async () => {
    const { data } = await api.getStatistics();
    // console.log(data?.data);
    setActiveUser(data?.data?.dailyActiveUserCount);
    setAppDownloads(data?.data?.totalAppDownloadCount);
    setTodayReview(data?.data?.todayTotalReviewCount);
    setTotalUsers(data?.data?.totalUserCount);
    setTotalReviews(data?.data?.totalReviewCount);
    setWeeklyActive(data?.data?.weeklyActiveUsers);
  };

  useEffect(() => {
    if (localStorage.getItem("authToken"))
    {
      getStatsData();
    }
    
  }, []);

  const downloadContent = (
    <div style={{ display: "flex", flexDirection: "column", width: "200px" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
          Today's Downloads:{" "}
        </p>
        <p>{todayReview}</p>
        {/* Use TotalDownloads here */}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
           Total Downloads:
        </p>
        <p>{appDownloads}</p>
      </div>
    </div>
  );

  const statsContent = (
    <div style={{ display: "flex", flexDirection: "column", width: "200px" }}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
          Today's Total Reviews:{" "}
        </p>
        <p>{todayReview}</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
          Total Reviews:
        </p>
        <p>{totalReviews}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
          Total Users:{" "}
        </p>
        <p>{totalUsers}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "95%",
          }}
        >
          Weekly Active Users:
        </p>
        <p>{weeklyActive}</p>
      </div>
    </div>
  );

  return localStorage.getItem("authToken") ? (
    <>
      <Drawer
        title=""
        placement={"left"}
        closable={true}
        onClose={() => {
          setOpendrawer(false);
        }}
        visible={opendrawer}
      >
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[
            localStorage.getItem("active")
              ? localStorage.getItem("active")
              : "1",
          ]}
          items={[
            {
              key: "1",
              icon: <DashboardIcon />,
              label: "DASHBOARD",
              onClick: () => {
                localStorage.setItem("active", "1");
                navigate(ROUTES.DASHBOARD);
                setOpendrawer(false);
              },
            },
            {
              key: "2",
              icon: <FeedbackIcon />,
              label: "FEEDBACKS",
              onClick: () => {
                localStorage.setItem("active", "2");
                navigate(ROUTES.FEEDBACK);
                setOpendrawer(false);
              },
            },
            {
              key: "3",
              icon: <CussWordIcon />,
              label: "CUSS WORDS",
              onClick: () => {
                localStorage.setItem("active", "3");
                navigate(ROUTES.CUSSWORD);
                setOpendrawer(false);
              },
            },
            {
              key: "4",
              icon: <UsersIcon />,
              label: "USERS",
              onClick: () => {
                localStorage.setItem("active", "4");
                navigate(ROUTES.USERS);
                setOpendrawer(false);
              },
            },
            // {
            //   key: "5",
            //   icon: <SettingIcon />,
            //   label: "SETTINGS",
            //   onClick: () => {
            //     localStorage.setItem("active", "5");
            //     navigate(ROUTES.SETTING);
            //     setOpendrawer(false)
            //   },
            // },
          ]}
        />
      </Drawer>
      <Layout>
        {isMobile ? (
          <div
            className="mobile-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <MenuUnfoldOutlined
                onClick={() => {
                  setOpendrawer(true);
                }}
                style={{ color: "white", fontSize: 30, cursor: "pointer" }}
              />
            </div>
            <div className="logo">
              <LogoIcon />
            </div>
            <Popover
              content={
                <a
                  onClick={() => {
                    localStorage.clear();
                    hide();
                    navigate(ROUTES.INDEX);
                  }}
                >
                  Logout
                </a>
              }
              title=""
              trigger="click"
              visible={visible}
              placement="bottomRight"
              onVisibleChange={handleVisibleChange}
            >
              <Avatar
                style={{
                  color: "#f56a00",
                  cursor: "pointer",
                  backgroundColor: "#fde3cf",
                  marginLeft: 20,
                }}
                src={userInfo?.avatar}
              ></Avatar>
            </Popover>
          </div>
        ) : (
          <Sider trigger={null} collapsible collapsed={true}>
            <div
              className="logo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <LogoIcon />
              <div style={{ color: "yellow" }}>{userInfo.role}</div>
            </div>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[
                localStorage.getItem("active")
                  ? localStorage.getItem("active")
                  : "1",
              ]}
              items={[
                {
                  key: "1",
                  icon: <DashboardIcon />,
                  label: "DASHBOARD",
                  onClick: () => {
                    localStorage.setItem("active", "1");
                    navigate(ROUTES.DASHBOARD);
                  },
                },
                {
                  key: "2",
                  icon: <FeedbackIcon />,
                  label: "FEEDBACKS",
                  onClick: () => {
                    localStorage.setItem("active", "2");
                    navigate(ROUTES.FEEDBACK);
                  },
                },
                {
                  key: "3",
                  icon: <CussWordIcon />,
                  label: "CUSS WORDS",
                  onClick: () => {
                    localStorage.setItem("active", "3");
                    navigate(ROUTES.CUSSWORD);
                    setOpendrawer(false);
                  },
                },
                {
                  key: "4",
                  icon: <UsersIcon />,
                  label: "USERS",
                  onClick: () => {
                    localStorage.setItem("active", "4");
                    navigate(ROUTES.USERS);
                    setOpendrawer(false);
                  },
                },
                {
                  key: "5",
                  icon: <RocketFilled />,
                  label: "Campaign",
                  onClick: () => {
                    localStorage.setItem("active", "5");
                    navigate(ROUTES.Campaign);
                    setOpendrawer(false);
                  },
                },
                // {
                //   key: "6",
                //   icon: <PollIcon />,
                //   label: "POLL",
                //   onClick: () => {
                //     localStorage.setItem("active", "6");
                //     navigate(ROUTES.Chat);
                //     setOpendrawer(false);
                //   },
                // },
                {
                  key: "7",
                  icon: <EmojiEventsIcon />,
                  label: "SCRATCH CARD REWARDS ",
                  onClick: () => {
                    localStorage.setItem("active", "7");
                    navigate(ROUTES.Rewards);
                    setOpendrawer(false);
                  },
                },
                // {
                //   key: "5",
                //   icon: <SettingIcon />,
                //   label: "SETTINGS",
                //   onClick: () => {
                //     localStorage.setItem("active", "5");
                //     navigate(ROUTES.SETTING);
                //   },
                // },
              ]}
            />
          </Sider>
        )}
        <Layout>
          {!isMobile && (
            <>
              {/* <div>{userInfo?.role}</div> */}
              <Header style={{ padding: 0 }}>
                <div style={{ display: "flex" }}>
                  <div>
                    <Popover
                      content={
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a
                          onClick={() => {
                            localStorage.clear();
                            hide();
                            navigate(ROUTES.INDEX);
                          }}
                        >
                          {"Logout"}
                        </a>
                      }
                      title=""
                      trigger="click"
                      visible={visible}
                      placement="bottomRight"
                      onVisibleChange={handleVisibleChange}
                    >
                      <Avatar
                        style={{
                          color: "#f56a00",
                          cursor: "pointer",
                          backgroundColor: "#fde3cf",
                          marginLeft: 20,
                        }}
                        src={userInfo?.avatar}
                      ></Avatar>
                    </Popover>
                  </div>
                  <div>
                    <h1
                      style={{
                        transform: "scale(-1, 1)",
                        color: "white",
                        transform: "scale(-1, 1)",
                        marginLeft: "30px",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div style={{ marginRight: "-10px" }}>
                        <li style={{ color: "red" }}></li>
                      </div>
                      <div>
                        <b>{activeUser}</b> active users
                      </div>
                    </h1>
                  </div>
                  <h1
                    style={{
                      // transform: "scale(-1, 1)",
                      color: "white",
                      transform: "scale(-1, 1)",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Popover content={downloadContent}>
                      <MobileOutlined style={{ marginRight: "5px" }} />
                      <b style={{ marginRight: "10px" }}>Downloads</b>
                    </Popover>
                  </h1>
                  <h1
                    style={{
                      // transform: "scale(-1, 1)",
                      color: "white",
                      transform: "scale(-1, 1)",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Popover content={statsContent}>
                      <UserOutlined
                        style={{ fontSize: "15px", marginRight: "5px" }}
                      />
                      <b style={{ marginRight: "10px" }}>Stats</b>
                    </Popover>
                  </h1>
                </div>

                {/* <Statistic title="Unmerged" value={99} suffix="/ 100" /> */}
              </Header>
            </>
          )}

          <Content
            className="site-layout-background"
            style={{
              // margin: "24px 16px",
              padding: isMobile ? 10 : 10,
              minHeight: "91.8vh",
              height: "87vh",
              overflowY: isLaptop ? "scroll" : "scroll",
              overflowX: "hidden",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      <Footer
        className="row-space-bw"
        style={{
          borderTop: "1px solid #e8e8e8",
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <div className="row-space-bw">
          <div style={{ marginRight: 10, color: "grey" }}>Privacy</div>
          <div style={{ marginLeft: 10, color: "grey" }}>
            Terms of condition
          </div>
        </div>
        <div style={{ color: "grey" }}>All rights are reserved</div>
      </Footer>
    </>
  ) : (
    children
  );
};
export default AppHeader;
