import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Tabs,
  Progress,
  Divider,
  Button,
  Dropdown,
  Space,
  Menu,
  Spin,
} from "antd";
import useViewport from "../../hooks/useViewport";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/feedaback";
import {
  AllFeedbackIcon,
  ApprovedFeedbackIcon,
  ApprovedSmallIcon,
  FlagReportIcon,
  RejectedFeedbackIcon,
  RejectedSmallIcon,
  RejectedFeedbacksIcon,
  ApprovedFeedbacksIcon,
} from "../../icons";
import { AnalyticsCard, DataTable } from "../../components/Dashboard";
import {
  DASHBOARD_TAB,
  FEEDBACK_TAB_ADMIN,
  FEEDBACK_TAB_MODERATOR,
} from "../../utils/constant";
import { UserInfo } from "../../context/userInfo";
import {
  CaretDownFilled,
  CaretDownOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { notify } from "../../utils/helper";
import { createconversation, getconversations } from "../../utils/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../route/constant";

const { TabPane } = Tabs;

const Dashboard = () => {
  const { isMobile } = useViewport();
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [activeTab, setActiveTab] = useState(DASHBOARD_TAB.FEEDBACK);
  const [currentFeedback, setCurrentfeedback] = useState("PENDING FEEDBACK");
  const [feedaback, setFeedback] = useState([]);
  const [activity, setActivity] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [moderators, setModerators] = useState([]);
  const [feedbackIds, setFeedbackIds] = useState([]);
  const [pageNumber,setPageNumber] = useState(1);
  const [pageSize,setPageSize] = useState(10);

  const [userData, setUserData] = useState([]);
  const [loader,setLoader] = useState(false);

  const navigate = useNavigate();
  const locationTab = useLocation();

  const handleCallBack = (childData) => {
    setFeedbackIds(childData);
  };
  const handlePageNumberCallBack =(childData)=>{
    setPageNumber(childData);
  }
  const handlePageSizeCallBack =(childData)=>{
    setPageSize(childData);
  }
  const bulkUpdate = async (type,reasonText) => {
   
    let update={};
    if(currentFeedback==='FLAGGED COMMENT'){
      update = await api.updateComment({
        flagId: feedbackIds,
        status: type,
        reason: reasonText,
      });
    }
    else{
      update = await api
      .updatefeedback({
        feedbackId: feedbackIds,
        status: type,
        reason: reasonText,
      })
    }
   
     
     
    if (update?.data?.error) {
      notify("error", update?.data?.message);
    } else {
      notify("success", update?.data?.message);
    }
   
    if(currentFeedback==='FLAGGED COMMENT'){
      setLoader(true)
      fetchFlaggedComments(pageSize,pageNumber);
      setLoader(false)
    }
    else{
      console.log('page number',pageNumber,'page size',pageSize);
      setLoader(true)
      getFeedback(pageSize,pageNumber);
      setLoader(false)
    }
    
  };
  const menuDropdown = (
    <Menu
      items={[
        {
          label: (
            <p
              onClick={() =>
                bulkUpdate(
                  "rejected",
                  "  This Content is Vulgar and Objectionable"
                )
              }
            >
              This Content is Vulgar and Objectionable
            </p>
          ),

          key: "1",
        },
        {
          label: (
            <p
              onClick={() =>
                bulkUpdate("rejected", "It may cause violence or hatred")
              }
            >
              It may cause violence or hatred
            </p>
          ),

          key: "2",
        },
        {
          label: (
            <p
              onClick={() =>
                bulkUpdate(
                  "rejected",
                  "  This profile is pretending to be someone else"
                )
              }
            >
              This profile is pretending to be someone else
            </p>
          ),

          key: "3",
        },
        {
          label: (
            <p
              onClick={() =>
                bulkUpdate(
                  "rejected",
                  "  This cannot be added as a Feedback"
                )
              }
            >
              This cannot be added as a Feedback
            </p>
          ),

          key: "4",
        },
      ]}
    />
  );
  const [counts, setCount] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    checked:0
  });
  const [mycount, setMycount] = useState({
    all: 0,
    approved: 0,
    checked: 0,
    pending: 0,
    rejected: 0,
    flagged:0
  });
  const getModeratorsList = async () => {
    const { data } = await api.getAllModerators();
    setModerators(data?.data?.results);
  
  };
  const getCount = async () => {
    const count = await api.getFeedbackcount();
    setCount(count?.data?.data?.totalCount);
    setMycount(count?.data?.data?.yourCount);
    const activity = await api.getRecentactivity();
    setActivity(activity?.data?.data?.results);
  };

  useEffect(() => {
    getUserinfo();
    getCount();
    (async () => {
      getModeratorsList();
      
    })();
    
  }, []);
 
  const FEEDBACK_TAB = FEEDBACK_TAB_ADMIN;

  const fetchFlaggedComments = async (limit,e) => {
    setLoader(true);
    const data = await api.getFlaggedComments({
      status: "pending",
      limit: limit ?limit :10,
      page: e ? e:  1,
    });
    if (data?.data?.error === false) {
      setTotalResults(data?.data?.data?.totalResults);
      setTotalPages(data?.data?.data?.totalPages);
      setUserData(data?.data?.data?.results)
      setLoader(false);
    }
    return data;
  };
  
  const fetchDisputedFeedbacks = async (limit,e)=>{
    setLoader(true);
    const data = await api.getDisputedFeedbacks({
      limit: limit ? limit :10,
      page: e ? e : 1,
      assigned: userInfo?.role==='admin' ? false :true
    })
    if (data?.data?.error === false) {
      setTotalResults(data?.data?.data?.totalResults);
      setTotalPages(data?.data?.data?.totalPages);
      setFeedback(data?.data?.data?.results);
      console.log(data);
      setLoader(false);
    }
  }
  const getFeedback = async (limit,e) => {
    if (currentFeedback === FEEDBACK_TAB?.[0]) {
      
      if (userInfo.role === "admin") {
           setLoader(true);
         
        const data = await api.getAdminFeedbacks({
          status: "pending",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
      
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
          setLoader(false);
        }
      } else {
          setLoader(true);
        const data = await api.getFeedback({
          status: "pending",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
          setLoader(false);
        }
      }
    }
    if (currentFeedback === FEEDBACK_TAB?.[1]) {
      if (userInfo.role === "admin") {
         setLoader(true);
        const data = await api.getAdminFeedbacks({
          status: "checked",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
           setLoader(false);
        }
      } else {
        setLoader(true);
        const data = await api.getFeedback({
          status: "checked",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
          setLoader(false);
        }
      }
    }
    if (currentFeedback === FEEDBACK_TAB?.[2]) {
      if (userInfo.role === "admin") {
        setLoader(true);
        const data = await api.getAdminFeedbacks({
          status: "flagged",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
          setLoader(false);
        }
      } else {
        setLoader(true);
        const data = await api.getFeedback({
          status: "flagged",
          limit: limit ? limit :10,
          page: e ? e : 1,
        });
        if (data?.data?.error === false) {
          setTotalResults(data?.data?.data?.totalResults);
          setTotalPages(data?.data?.data?.totalPages);
          setFeedback(data?.data?.data?.results);
          setLoader(false);
        }
      }
    }
    if (currentFeedback === FEEDBACK_TAB?.[3]) {
      
      fetchFlaggedComments(limit,e)
    }
    if (currentFeedback === FEEDBACK_TAB?.[4]){
      fetchDisputedFeedbacks();
    }
  };
  useEffect(() => {
    if (currentFeedback === 'PENDING FEEDBACK') {
      getFeedback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userInfo.role]);

  useEffect(() => {
    getFeedback();
   fetchFlaggedComments();
   fetchDisputedFeedbacks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFeedback]);

 

  const menus = moderators.map((item, index) => {
    return <Menu.Item key={index}>{item.fullName}</Menu.Item>;
  });
  const menu = () => {
    return <Menu>{menus}</Menu>;
  };

 
  return (
    <div>
      <div className="title mt-5">Dashboard</div>
      <Row gutter={[30, 30]} className="dashboard-cards">
        {/* <Link
      <div className="title mt-10">Dashboard</div>
      <Row gutter={[30, 30]}>
        <Link
          style={{ display: "contents" }}
          to="/feedbacks"
          state={{ activeTab: "All feedbacks" }}
          // onClick={()=>{localStorage.setItem("active", "1");
          //   navigate(ROUTES.FEEDBACK)
          // }}
          replace
        > */}
       <div onClick={()=>{localStorage.setItem("active", "2");
             navigate(ROUTES.FEEDBACK)
          }}
          style={{ display: "contents" }}
          >
          <AnalyticsCard
            count={userInfo.role==='admin' ? counts?.all : mycount?.all}
            title="All Feedback"
            Icon={AllFeedbackIcon}
            
          />
      </div>
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to="/feedbacks"
          state={{ activeTab: "Approved" }}
          replace
        > */}
        <div onClick={()=>{localStorage.setItem("active", "2");
             navigate(ROUTES.FEEDBACK);
          }}
          style={{ display: "contents" }}>
          <AnalyticsCard
            count={userInfo.role==='admin' ? counts?.approved : mycount?.approved}
            title="Approved Feedback"
            Icon={ApprovedFeedbackIcon}
          />
          </div>
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to={ROUTES.FEEDBACK}
          state={{ activeTab: "Rejected" }}
          
        > */}
        <div onClick={()=>{localStorage.setItem("active", "2");
             navigate(ROUTES.FEEDBACK)
          }}
          style={{ display: "contents" }}>
          <AnalyticsCard
            count={userInfo.role==='admin' ? counts?.rejected :mycount?.rejected}
            title="Rejected Feedback"
            Icon={RejectedFeedbackIcon}
          />
          </div>
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to="/feedbacks"
          state={{ activeTab: "Flagged Feedbacks" }}
          replace
        > */}
        <div onClick={()=>{
             navigate(ROUTES.FEEDBACK);
             localStorage.setItem("active", "2");
          }}
          style={{ display: "contents" }}
          >
          <AnalyticsCard
            count={ userInfo.role==='admin' ? counts?.flagged : mycount?.flagged }
            title="Flag Report"
            Icon={FlagReportIcon}
          />
          </div>
        {/* </Link> */}
      </Row>
      {isMobile && (
        <div className="mt-20">
           <Dropdown overlay={menuDropdown}>
                <Button
                  // onClick={() => {
                  //   updatefeedback("rejected");
                  // }}
                  danger
                  className="btn-danger mr-10"
                  size={"large"}
                >
                  <div className="row-space-bw">
                    <RejectedFeedbacksIcon  />
                    <div className="ml-10">Bulk Reject</div>
                  </div>
                </Button>
              </Dropdown>
          <Button className="btn-sucess mr-20" size={"large"}   onClick={() => bulkUpdate("approved","accepted")}>
            <div className="row-space-bw">
              <ApprovedFeedbacksIcon width={20} height={20} className="mr-5" />
              <div>Bulk Approve</div>
            </div>
          </Button>
        </div>
      )}
      <div className="mt-40 row-space-bw bulk-width ">
        <div className="dashboard-top-tab ">
          <div
            className={
              activeTab === DASHBOARD_TAB.FEEDBACK
                ? "active-tab cursor-pointer"
                : "unactive-tab cursor-pointer"
            }
            onClick={() => {
              setActiveTab(DASHBOARD_TAB.FEEDBACK);
            }}
          >
            All Feedback
          </div>
          <div
            className={
              activeTab === DASHBOARD_TAB.GRAPH
                ? "active-tab cursor-pointer"
                : "unactive-tab cursor-pointer"
            }
            onClick={() => {
              setActiveTab(DASHBOARD_TAB.GRAPH);
            }}
          >
            Graph Analysis
          </div>
        </div>
        {isMobile === false && (
          <div className="ant-col-4.8 ant-col-xs-1 bulk-padding">
            <Space>
            <Dropdown overlay={menuDropdown}>
                <Button
                  // onClick={() => {
                  //   updatefeedback("rejected");
                  // }}
                  danger
                  className="btn-danger mr-10"
                  size={"large"}
                >
                  <div className="row-space-bw">
                    <RejectedFeedbacksIcon  />
                    <div className="ml-10">Bulk Reject</div>
                  </div>
                </Button>
              </Dropdown>
              <Button
                className="btn-sucess"
                size={"large"}
                onClick={() => bulkUpdate("approved","accepted")}
              >
                <div className="row-space-bw">
                  <ApprovedFeedbacksIcon />
                  <div className="ml-10">Bulk Approve</div>
                </div>
              </Button>
            </Space>
          </div>
        )}
      </div>
      <Row gutter={[30, 30]}>
        <Col xs={24} sm={24} md={24} xl={18} xxl={18} span={18}>
          {activeTab === DASHBOARD_TAB.GRAPH ? (
            <Card className="dashboard-card-analytics">
              <div>Coming soon</div>
              {/* <ResponsiveContainer className="graph" height="90%" width="100%">
                <LineChart
                  width={600}
                  height={300}
                  data={[
                    {
                      approved: 2400,
                      rejected: 2400,
                    },
                    {
                      approved: 1398,
                      rejected: 2210,
                    },
                    {
                      approved: 9800,
                      rejected: 2290,
                    },
                    {
                      approved: 3908,
                      rejected: 2000,
                    },
                    {
                      approved: 4800,
                      rejected: 2181,
                    },
                    {
                      approved: 3800,
                      rejected: 2500,
                    },
                    {
                      approved: 4300,
                      rejected: 2100,
                    },
                  ]}
                  barSize={20}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    stroke="#D2E7FB"
                    fillOpacity={0}
                  />

                  <Tooltip />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="approved"
                    stroke="#4318FF"
                    strokeWidth={8}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rejected"
                    stroke="#6AD2FF"
                    strokeWidth={8}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer> */}
            </Card>
          ) : (
            <Card className="dashboard-card-analytics">
              <Tabs
                onChange={(e) => {
                  
                  setCurrentfeedback(e);
                }}
                defaultActiveKey={currentFeedback}
              >
                {FEEDBACK_TAB.map((i, index) => {
                  return (
                    <>
                      <TabPane tab={i} key={i}>
                        {loader ? (<Spin tip="Loading..."/>): (<DataTable
                          feedaback={feedaback}
                          getFeedback={getFeedback}
                          setUserData={setUserData}
                          setFeedback={setFeedback}
                          totalPages={totalPages}
                          totalResults={totalResults}
                          moderators={moderators}
                          parentCallBack={handleCallBack}
                          pageNumberCallBack={handlePageNumberCallBack}
                          pageSizeCallBack={handlePageSizeCallBack}
                          index={index}
                          DashboardTab={currentFeedback}
                          fetchDisputedFeedbacks={fetchDisputedFeedbacks}
                          fetchFlaggedComments={fetchFlaggedComments}
                          userData={userData}
                          setTotalPages={setTotalPages}
                          setTotalResults={setTotalResults}
                          setLoader={setLoader}
                        />)}
                        
                      </TabPane>
                    </>
                  );
                })}
              </Tabs>
            </Card>
          )}
        </Col>
        <Col xs={24} sm={24} md={24} xl={6} xxl={6} span={6} style={{marginBottom:'90px'}}>
          <Card className="dashboard-card-analytics">
            <div className="text-center">
              <Avatar src={userInfo?.avatar} size={70} />
              <div className="card-name-moderator">{userInfo?.username}</div>
              <div className="card-name-type">{userInfo?.role}</div>
            </div>

            <div className="row-space-bw mt-20 ">
              <div>
                <Progress
                  format={() => {
                    // return counts.checked;
                    return userInfo.role === "admin"
                      ? counts.approved + counts.rejected
                      : mycount.approved + mycount.rejected;
                  }}
                  type="circle"
                  width={75}
                  strokeWidth={12}
                  strokeColor={"#1484CD"}
                  // percent={(counts.checked / counts.all) * 100}
                  percent={
                    userInfo.role === "admin"
                      ? (counts.checked / counts.all) * 100
                      : (mycount.checked / mycount.all) * 100
                  }
                />

                <div className="text-center dashboard-user-circle">Checked</div>
              </div>
              <div>
                <Progress
                  format={() => {
                    return userInfo.role === "admin"
                      ? counts.approved
                      : mycount.approved;
                  }}
                  type="circle"
                  strokeWidth={12}
                  width={75}
                  strokeColor={"#35B533"}
                  percent={
                    userInfo.role === "admin"
                      ? (counts.approved / counts.all) * 100
                      : (mycount.approved / mycount.all) * 100
                  }
                />
                <div className="text-center dashboard-user-circle">
                  Approved
                </div>
              </div>

              <div>
                <Progress
                  format={() => {
                    return userInfo.role === "admin"
                      ? counts.rejected
                      : mycount.rejected;
                  }}
                  width={75}
                  type="circle"
                  strokeWidth={12}
                  strokeColor={"#F87A1D"}
                  percent={
                    userInfo.role === "admin"
                      ? (counts.rejected / counts.all) * 100
                      : (mycount.rejected / mycount.all) * 100
                  }
                />
                <div className="text-center dashboard-user-circle">
                  Rejected
                </div>
              </div>
            </div>
            <Divider />
            <div className="card-name-moderator-dashboard ">
              Recent Activity
            </div>
            {activity?.map((i) => {
              return i?.status === "approved" ? (
                <div className="flex-row-center mt-20">
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    <span style={{ color: "#35B533" }}>Approved</span>{" "}
                    {i?.sender?.username}'s Feedback
                  </div>
                </div>
              ) : (
                i?.status === "rejected" && (
                  <div className="flex-row-center mt-20">
                    <RejectedSmallIcon />
                    <div className="card-name-type ml-10">
                      <span style={{ color: "#FF3C3C" }}>Rejected</span>{" "}
                      {i?.sender?.username}'s Feedback
                    </div>
                  </div>
                )
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dashboard;
