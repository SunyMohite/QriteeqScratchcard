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
  Typography,
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
import AnalyticsCardCampaign from "../../components/Dashboard/AnalyticsCardCampaign"
import {CampaignDataTable} from "../../components/Campaign";
import {
  CAMPAIGNS_TAB_ALL,
  DASHBOARD_TAB,
  FEEDBACK_TAB_ADMIN,
  FEEDBACK_TAB_MODERATOR,
} from "../../utils/constant";
import { UserInfo } from "../../context/userInfo";
import {
  CaretDownFilled,
  CaretDownOutlined,
  CheckCircleOutlined,
  DownOutlined,
  Loading3QuartersOutlined,
  SoundOutlined,
  SoundTwoTone,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { notify } from "../../utils/helper";
import { createconversation, getconversations } from "../../utils/firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../route/constant";
import ReferralTable from "../../components/Campaign/ReferralTable";

const { TabPane } = Tabs;

const Campaign = () => {
  const { isMobile } = useViewport();
  const { Text, Link ,Title} = Typography;
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [activeTab, setActiveTab] = useState(DASHBOARD_TAB.FEEDBACK);
  const [currentFeedback, setCurrentfeedback] = useState("ONGOING CAMPAIGNS");
  const [feedaback, setFeedback] = useState([]);
  const [campaigns,setCampaigns] = useState([]);
  const [activity, setActivity] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [moderators, setModerators] = useState([]);
  const [feedbackIds, setFeedbackIds] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [referrals,setReferrals]=useState([]);

  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [ongoingCount,setOngoingCount]=useState(0);
  
  const [completedCount,setCompletedCount]=useState(0);
  const [totalUserCount,setTotalUserCount]=useState(0);

  const [dummyId,setDummyId]= useState('');
  const [avatar,setAvatar]=useState(campaigns[0]?.user?.avatar);
  const [name,setName]=useState('');
  const [title,setTitle]=useState(campaigns[0]?.title);
  const [description,setDescription]=useState('');

  const [referralName,setReferralName] = useState('');
  const [referralAvatar,setReferralAvatar] = useState(''); 
  const [referralList,setReferralList] = useState([]);
  const [coinsEarned,setCoinsEarned] = useState('');
  const [usersJoined,setUsersJoined] = useState(0);

  const [ongo,setOngo]=useState(0);
  const [completed,setCompleted]=useState(0);
  const[total,setTotal] = useState(0);

  const navigate = useNavigate();
  const locationTab = useLocation();

    const callBackId =(childData)=>{
      
    setDummyId(childData);
    fetchCampaignsCount(dummyId)
    }

    const callBackAvatar =(childData)=>{
    setAvatar(childData);

    }

    const callBackName =(childData)=>{
    setName(childData);
    }
    const callBackTitle =(childData)=>{
        setTitle(childData);
    }
    const callBackDescription =(childData)=>{
      setDescription(childData);
    }

    const referralNameCallBack =(childData)=>{
      setReferralName(childData);
    }
    const referralAvatarCallBack =(childData)=>{
      setReferralAvatar(childData);
    }
    const userListReferredCallBack =(childData)=>{
      setReferralList(childData);
    }
    const coinsEarnedCallBack =(childData)=>{
        setCoinsEarned(childData);
    }
    const usersJoinedCallBack = (childData)=>{
        setUsersJoined(childData)
    }

    const fetchCampaignsCount =async(ID)=>{
      const payload ={
        id: ID
      }
      const data= await api.getCampaignCount(payload);
      console.log(data?.data?.data);
      setOngo(data?.data?.data?.ongoingCampaignCount);
      setCompleted(data?.data?.data?.completeCampaignCount);
      setTotal(data?.data?.data?.totalCampaignCount);
    }
   

  const handleCallBack = (childData) => {
    setFeedbackIds(childData);
  };
  const handlePageNumberCallBack = (childData) => {
    setPageNumber(childData);
  };
  const handlePageSizeCallBack = (childData) => {
    setPageSize(childData);
  };
 
  
  const [counts, setCount] = useState({
    all: 0,
    ongoing: 0,
    completed: 0,
    
  });
  const [mycount, setMycount] = useState({
    all: 0,
    approved: 0,
    checked: 0,
    pending: 0,
    rejected: 0,
    flagged: 0,
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
    fetchCampaigns();
    
    getCount();
    (async () => {
      getModeratorsList();
    })();
  }, []);

const fetchReferrals =async()=>{
const data = await api.getReferrals();

setReferrals(data?.data?.data?.results);
}



  const CAMPAIGNS_TAB = CAMPAIGNS_TAB_ALL;

  const fetchCampaignsOngoing= async (limit, e) => {
    setLoader(true);
    const data = await api.getCampaigns({
      status: true,
      limit: limit ? limit : 10,
      page: e ? e : 1,
    });
    if (data?.data?.error === false) {
      setTotalResults(data?.data?.data?.totalResults);
      setOngoingCount(data?.data?.data?.totalResults)
      setTotalPages(data?.data?.data?.totalPages);
      setCampaigns(data?.data?.data?.results);
      setTotalUserCount(data?.data?.data?.totalNewUsersCount);
      
      console.log(campaigns);
      setLoader(false);
    }
    return data;
  };

  const fetchCampaignsCompleted= async (limit, e) => {
    setLoader(true);
    const data = await api.getCampaigns({
      status: false,
      limit: limit ? limit : 10,
      page: e ? e : 1,
    });
    if (data?.data?.error === false) {
      setTotalResults(data?.data?.data?.totalResults);
      setCompletedCount(data?.data?.data?.totalResults);
      setTotalPages(data?.data?.data?.totalPages);
      setCampaigns(data?.data?.data?.results);
      console.log(campaigns);
      setLoader(false);
    }
    return data;
  };
  const fetchCampaigns = async (limit, e) => {
    if (currentFeedback === CAMPAIGNS_TAB?.[0]) {
     fetchCampaignsOngoing(limit, e);
    }
    if (currentFeedback === CAMPAIGNS_TAB?.[1]) {
     fetchCampaignsCompleted(limit, e);
    }
  
  };
  // useEffect(() => {
  //   if (currentFeedback === "PENDING FEEDBACK") {
  //     getFeedback();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userInfo.role]);


  useEffect(() => {
     fetchCampaigns();
    // fetchCampaignsOngoing();
    // fetchCampaignsCompleted();
    fetchReferrals();
    
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
      <div className="title mt-5">Campaign</div>
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
        {/* <div
          onClick={() => {
            localStorage.setItem("active", "2");
            navigate(ROUTES.FEEDBACK);
          }}
          style={{ display: "contents" }}
        > */}
          <AnalyticsCardCampaign
            count={ongoingCount+completedCount}
            title="All Campaigns"
            Icon= {SoundTwoTone}
          />
        {/* </div> */}
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to="/feedbacks"
          state={{ activeTab: "Approved" }}
          replace
        > */}
        {/* <div
          onClick={() => {
            localStorage.setItem("active", "2");
            navigate(ROUTES.FEEDBACK);
          }}
          style={{ display: "contents" }}
        > */}
          <AnalyticsCardCampaign
            count={
              ongoingCount
            }
            title="Ongoing Campaigns"
            Icon={Loading3QuartersOutlined}
          />
        {/* </div> */}
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to={ROUTES.FEEDBACK}
          state={{ activeTab: "Rejected" }}
          
        > */}
        {/* <div
          onClick={() => {
            localStorage.setItem("active", "2");
            navigate(ROUTES.FEEDBACK);
          }}
          style={{ display: "contents" }}
        > */}
          <AnalyticsCardCampaign
            count={
              completedCount
            }
            title="Completed Campaigns"
            Icon={CheckCircleOutlined}
          />
        {/* </div> */}
        {/* </Link> */}
        {/* <Link
          style={{ display: "contents" }}
          to="/feedbacks"
          state={{ activeTab: "Flagged Feedbacks" }}
          replace
        > */}
        {/* <div
          onClick={() => {
            navigate(ROUTES.FEEDBACK);
            localStorage.setItem("active", "2");
          }}
          style={{ display: "contents" }}
        > */}
          <AnalyticsCardCampaign
            count={
              totalUserCount
            }
            title="New Users through Campaigns"
            Icon={UserAddOutlined}
          />
        {/* </div> */}
        {/* </Link> */}
      </Row>
     
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
            All Campaigns
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
            Referrals
          </div>
        </div>
        
      </div>
      <Row gutter={[30, 30]} >
        <Col xs={24} sm={24} md={24} xl={18} xxl={18} span={18}>
          {activeTab === DASHBOARD_TAB.GRAPH ? (
            <Card className="dashboard-card-analytics">
              <ReferralTable
              referrals={referrals}
              referralNameCallBack={referralNameCallBack}
              referralAvatarCallBack={referralAvatarCallBack}
              userListReferredCallBack={userListReferredCallBack}
              coinsEarnedCallBack={coinsEarnedCallBack}
              usersJoinedCallBack={usersJoinedCallBack}
              />
            </Card>
          ) : (
            <Card className="dashboard-card-analytics">
              <Tabs
                onChange={(e) => {
                  setCurrentfeedback(e);
                }}
                defaultActiveKey={currentFeedback}
              >
                {CAMPAIGNS_TAB.map((i, index) => {
                  return (
                    <>
                      <TabPane tab={i} key={i}>
                        {loader ? (
                          <Spin tip="Loading..." />
                        ) : (
                          <CampaignDataTable
                          campaigns={campaigns}
                          totalResults={totalResults}
                          fetchCampaignsOngoing={fetchCampaignsOngoing}
                          fetchCampaignsCompleted={fetchCampaignsCompleted}
                          fetchCampaigns={fetchCampaigns}
                          pageNumberCallBack={handlePageNumberCallBack}
                          pageSizeCallBack={handlePageSizeCallBack}
                          setLoader={setLoader}
                          callBackId={callBackId}
                          callBackAvatar={callBackAvatar}
                          callBackName={callBackName}
                          callBackTitle={callBackTitle}
                          callBackDescription={callBackDescription}
                          />
                        )}
                      </TabPane>
                    </>
                  );
                })}
              </Tabs>
            </Card>
          )}
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          xl={6}
          xxl={6}
          span={6}
          style={{ marginBottom: "90px" }}
        > 
         
         <Card className="dashboard-card-analytics">
            <div className="text-center">
              <Avatar src={ activeTab==='FEEDBACK' ? avatar : referralAvatar} size={70} />
              <div className="card-name-moderator">{ activeTab==='FEEDBACK' ? name : referralName}</div>
              <br/>
              <Title level={4}>{ activeTab==='FEEDBACK' ? title : null}</Title>
              <Text type='secondary'>{ activeTab==='FEEDBACK' ? description : null}</Text>
              {/* <div>{dummyId}</div> */}
              {/* <div className="card-name-type">{userInfo?.role}</div> */}
            </div>

            <div className="row-space-bw mt-20 ">
              <div>
                <Progress
                  format={() => {
                     return activeTab==='FEEDBACK' ? ongo: coinsEarned 
                  }}
                  type="circle"
                  width={75}
                  strokeWidth={12}
                  strokeColor={"#1484CD"}
                  // percent={(counts.checked / counts.all) * 100}
                  percent={
                    activeTab==='FEEDBACK' ? (ongo/total)*100 : coinsEarned
                    // userInfo.role === "admin"
                    //   ? (counts.checked / counts.all) * 100
                    //   : (mycount.checked / mycount.all) * 100
                  }
                />

                <div className="text-center dashboard-user-circle">{ activeTab==='FEEDBACK' ? <p>On Going</p> : <p>Coins Earned </p>}</div>
              </div>
              <div>
                <Progress
                  format={() => {
                    return activeTab==='FEEDBACK' ? completed: usersJoined
                  }}
                  type="circle"
                  strokeWidth={12}
                  width={75}
                  strokeColor={"#35B533"}
                  percent={

                    activeTab==='FEEDBACK' ? (completed/total)*100 : usersJoined
                    // userInfo.role === "admin"
                    //   ? (counts.approved / counts.all) * 100
                    //   : (mycount.approved / mycount.all) * 100
                  }
                />
                <div className="text-center dashboard-user-circle">
                { activeTab==='FEEDBACK' ? <p>Completed</p> : <p>Users Joined </p>}
                </div>
              </div>

             {activeTab==='FEEDBACK' && <div>
                <Progress
                  format={() => {
                    return total
                      
                  }}
                  width={75}
                  type="circle"
                  strokeWidth={12}
                  strokeColor={"#F87A1D"}
                  percent={
                    total
                  }
                />
                <div className="text-center dashboard-user-circle">
                  Total
                </div>
              </div>}
            </div>
            <Divider />
            <div className="card-name-moderator-dashboard ">
              Recent Activity
            </div>
            {activeTab === 'FEEDBACK' ? (<><div className="flex-row-center mt-20">
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    {/* <span style={{ color: "#35B533" }}>Approved</span>{" "} */}
                    <div>User 1 joined this campaign</div>
                  </div>
                  
                </div>
                <div className="flex-row-center mt-20">
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    {/* <span style={{ color: "#35B533" }}>Approved</span>{" "} */}
                    <div>User 2 joined this campaign</div>
                  </div>
                  
                </div>
                <div className="flex-row-center mt-20">
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    {/* <span style={{ color: "#35B533" }}>Approved</span>{" "} */}
                    <div>User 3 joined this campaign</div>
                  </div>
                  
                </div>
                <div className="flex-row-center mt-20">
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    {/* <span style={{ color: "#35B533" }}>Approved</span>{" "} */}
                    <div>User 4 joined this campaign</div>
                  </div>
                  
                </div></>) :(<>
                  {
                referralList.map((item,index)=>(
                  <div className="flex-row-center mt-20" key={index}>
                  <ApprovedSmallIcon />
                  <div className="card-name-type ml-10">
                    {/* <span style={{ color: "#35B533" }}>Approved</span>{" "} */}
                    <div>{item?.fullName} joined via this referral</div>
                  </div>
                  
                </div>
                ))
              }
                </>)}
                
             
          </Card> 
        
         </Col>
      </Row>
    </div>
  );
};
export default Campaign;
