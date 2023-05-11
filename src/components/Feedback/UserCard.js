import { Avatar, Divider, Tabs, Radio, Pagination, Tooltip, Button, Space, Input, Switch, message } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { CheckCircleFilled, EditFilled, UserOutlined } from "@ant-design/icons";
import api from "../../services/feedaback";
import FeedbackCard from "../../components/Feedback";
import { UserInfo } from "../../context/userInfo";
import { getConversations } from "../../utils/firebase";
import useViewport from "../../hooks/useViewport";

const { TabPane } = Tabs;

export default function UserCard({
  userSpecificData,
  getUserSpecificData,
  userFeedbackReceiver,
  userFeedbackSender,
  getUserSpecificFeedbackReceiver,
  getUserSpecificFeedbackSender,
  receiverPages,
  senderPages,
  id
}) {
  const [currentBtn, setCurrentBtn] = useState("enable");
  const [feedaback, setFeedback] = useState([]);
  const [limit, setLimit] = useState(10);
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [coversation, setConversation] = useState([]);
  const { isMobile } = useViewport();
  const [pageNumberSender,setPageNumberSender] = useState(1);
  const [pageNumberReceiver,setPageNumberReceiver] = useState(1);
  const [btnStatus, setBtnStatus] = useState(
    userSpecificData?.data?.user?.autoApprove
  );
  const [trustScore, setTrustScore] = useState(userSpecificData?.data?.user?.trustScore);
  const [toggleEdit, setToggleEdit] = useState(true);
  const [toggleSave, setToggleSave] = useState(false);
  const [generateReport, setGenerateReport] = useState(userSpecificData?.data?.user?.generateReportOption);

  console.log('edit',toggleEdit,'save',toggleSave);

  const getFeedbacks = async () => {
    const data = await api.getFeedbackfilter({
      status: "pending",
      limit: limit,
      page: 1,
      assigned: false,
    });
    if (data?.data?.error === false) {
      setFeedback(data?.data?.data?.results);
    }
  };
  useEffect(() => {
    getFeedbacks();
    getConversations();
  }, []);
  const getConversations = async () => {
    const conversation = await getConversations(userInfo?._id);
    setConversation(conversation);
  };

  const onChange = (key) => {
    
  };
  const approve = async (ID, bool) => {
    const auto = {
      autoApprove: bool,
    };

    await api
      .autoApprove(ID, auto)
      .then((res) => {

        if (res?.data?.data === false) {
          message.success(res?.data?.message);
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleBtnChange = (e) => {
    setBtnStatus(!btnStatus);

    approve(userSpecificData?.data?.user?.id, !btnStatus);
  };
  const updateTrustScore = async (id) => {
    const payload = {
      trustScore: trustScore
    }
    await api.updateExistingUsers(id, payload).then((res) => {
      if (res?.data?.data === false) {
        message.success(res?.data?.message);
        
      } else {
        message.error(res?.data?.message);
      }
      // getUserDetails(pageSize, pageNumber);
      // getUserSpecificData(id);
      setToggleEdit(!toggleEdit);
      setToggleSave(!toggleSave)

    });
  }

  const updateGenerateReport = async (id, status) => {
    const payload = {
      generateReportOption: status
    }
    await api.updateExistingUsers(id, payload).then((res) => {
      if (res?.data?.data === false) {
        message.success(res?.data?.message);
      } else {
        message.error(res?.data?.message);
      }
    });

  }
  const handleReportChange = (state, event) => {
    setGenerateReport(!generateReport);
    updateGenerateReport(id, state);
  }
  const handleTrustScore = (e) => {
    setTrustScore(e.target.value);
  }
  const pageChangeHandlerReceiver = (page,pageSize)=>{
    getUserSpecificFeedbackReceiver(id,pageSize,page)
    setPageNumberReceiver(page)
   }
   const pageChangeHandlerSender =(page,pageSize)=>{
    getUserSpecificFeedbackSender(id,pageSize,page)
    setPageNumberSender(page)
   }

  
  
  useEffect(() => {
     setBtnStatus(userSpecificData?.data?.user?.autoApprove);
    setGenerateReport(userSpecificData?.data?.user?.generateReportOption);
    setTrustScore(userSpecificData?.data?.user?.trustScore)
  }, [userSpecificData?.data?.user?.autoApprove,userSpecificData?.data?.user?.generateReportOption,userSpecificData?.data?.user?.trustScore])
  return (
    <div>
      {isMobile ? (
        <div className="userCard chat-menu" >
          <div >
            <div className="flex-row-center">
              <Avatar src={userSpecificData?.data?.user?.avatar} size={50} />
              <div>
                <div className="title ml-10">
                  {userSpecificData?.data?.user?.fullName}
                </div>
                <div className="ml-10 location">
                  {userSpecificData?.data?.user?.email}
                </div>
              </div>
            </div>
            <div className="flex-row-center justify-center mt-20">
              <div>
                <div className="title anonymousText ml-50 ">
                  {userSpecificData?.data?.feedbackReceived}
                </div>
                <div>Feedback Received</div>
              </div>
              <div>
                <div className="title anonymousText ml-50">
                  {" "}
                  {userSpecificData?.data?.feedbackPosted}
                </div>
                <div className="ml-10">Feedback Post</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}} >
            <div className="flex-column-center" style={{marginTop:'20px'}}>
                <Radio.Group
                  //className="enable-disable"
                  value={btnStatus}
                  onChange={handleBtnChange}
                >
                  <Radio.Button
                    id="enable"
                    name="button"
                    //value="enable"
                    className="enable-toggle"
                    style={{
                      color: !btnStatus ? "black" : "white",
                      backgroundColor: !btnStatus ? "transparent" : "green",
                    }}
                  >
                    Enable
                  </Radio.Button>
                  <Radio.Button
                    id="disable"
                    name="button"
                    //value="disable"
                    className="enable-toggle"
                    style={{
                      color: btnStatus ? "black" : "white",
                      backgroundColor: btnStatus ? "transparent" : "red",
                    }}
                  >
                    Disable
                  </Radio.Button>
                </Radio.Group>
                <div className=" m-10 anonymousText" style={{marginLeft:'30px'}}>
                  {"Auto Approval"}
                </div>
            
            </div>
                {userInfo.role==='admin' && <div className="mt-10" style={{ display: "flex",flexDirection:'column',justifyContent:'center',alignItems:'flex-start',padding:'5px' }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p>
                    <Switch
                      checked={generateReport}
                      size="small"
                      onChange={handleReportChange}
                    />{" "}
                  </p>
                  <p style={{fontSize:'15px'}}> Generate Report</p>
                </div>

                <div>
                  <Space>
                    <Input
                      type="text"
                      style={{ width: "45px", backgroundColor: "white" }}
                      maxLength={3}
                      bordered={false}
                      value={trustScore}
                      onChange={handleTrustScore}
                      disabled={toggleEdit}
                    />
                    {toggleEdit && (
                      <span>
                        <Tooltip title="Edit Trust Score">
                          <Button
                            type="link"
                            onClick={(e) => {
                              setToggleEdit(!toggleEdit);
                              setToggleSave(!toggleSave);
                            }}
                          >
                            <EditFilled />
                          </Button>
                        </Tooltip>
                      </span>
                    )}
                    {toggleSave && (
                      <span>
                        <Tooltip title="SAVE">
                          {" "}
                          <Button type="text" disabled={!trustScore}>
                            <CheckCircleFilled
                              style={{
                                fontSize: "25px",
                                color: "green",
                                cursor: "pointer",
                              }}
                              onClick={updateTrustScore.bind(this, id)}
                            />
                          </Button>
                        </Tooltip>
                      </span>
                    )}
                  </Space>
                  <p style={{fontSize:'15px'}}>Trust Score</p>
                </div>
              </div>}
              </div>
          <div>
            <Divider className="mt-50" />
            <Tabs defaultActiveKey="1" onChange={onChange}>
              <TabPane tab="Feedback Received" key="1" >
                {" "}
                {userFeedbackReceiver.length === 0 ? (
                  <div>No Feedback Received</div>
                ) : (
                  <>
                    {userFeedbackReceiver?.map((u) => {
                      return (
                        <div  >
                          <FeedbackCard
                            item={u}
                            getFeedbacks={getFeedbacks}
                            getConversations={getConversations}
                          />
                          <Divider />
                        </div>
                      );
                    })}
                     <Pagination total={receiverPages} onChange={pageChangeHandlerReceiver} current={pageNumberReceiver}/>
                  </>
                )}
              </TabPane>
              <TabPane tab="Feedback Posted" key="2" >
                {userFeedbackSender.length === 0 ? (
                  <div>No Feedback Posted</div>
                ) : (
                  <>
                    {userFeedbackSender?.map((u) => {
                      return (
                        <div >
                          <FeedbackCard
                            item={u}
                            getFeedbacks={getFeedbacks}
                            getConversations={getConversations}
                          />
                          <Divider />
                        </div>
                      );
                    })}
                    <Pagination total={senderPages} onChange={pageChangeHandlerSender} current={pageNumberSender}/>
                  </>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="userCard ml-10 chat-menu" >
          <div className="row-space-bw">
            <div className="flex-row-center ">
              <Avatar
                size={70}
                src={userSpecificData?.data?.user?.avatar}
                icon={<UserOutlined />}
              />
              <div>
                <div className="title ml-10">
                  {userSpecificData?.data?.user?.fullName}
                </div>
                <div className="ml-10 location">
                  {userSpecificData?.data?.user?.email}
                </div>
              </div>
              
            </div>
            <div className="flex-row-center">
              <div>
                <div className="title ml-50 anonymousText">
                  {" "}
                  {userSpecificData?.data?.feedbackReceived}
                </div>
                <div>Feedback Received</div>
              </div>
              <div>
                <div className="title ml-50 anonymousText">
                  {" "}
                  {userSpecificData?.data?.feedbackPosted}
                </div>
                <div className="ml-10">Feedback Post</div>
              </div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between'}} >
            <div className="flex-row-center">
                <div style={{display:'flex',flexDirection:'column'}}>
                     
                      <Radio.Group
                        className="enable-disable"
                        value={btnStatus}
                        onChange={handleBtnChange}
                      >
                        <Radio.Button
                          id="enable"
                          name="button"
                          //value="enable"
                          className="enable-toggle"
                          style={{
                            color: !btnStatus ? "black" : "white",
                            backgroundColor: !btnStatus ? "transparent" : "green",
                          }}
                        >
                          Enable
                        </Radio.Button>
                        <Radio.Button
                          id="disable"
                          name="button"
                          //value="disable"
                          className="enable-toggle"
                          style={{
                            color: btnStatus ? "black" : "white",
                            backgroundColor: btnStatus ? "transparent" : "red",
                          }}
                        >
                          Disable
                        </Radio.Button>
                      </Radio.Group>
                      <div className=" m-10 anonymousText mr-20" style={{marginLeft:'30px'}}>
                        {"Auto Approval"}
                      </div>
                </div>
                </div>
                {userInfo.role==='admin' && <div className="mt-10" style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <p>
                    <Switch
                      checked={generateReport}
                      size="small"
                      onChange={handleReportChange}
                    />{" "}
                  </p>
                  <p> Generate Report</p>
                </div>

                <div style={{ marginLeft: "30px" }}>
                  <Space>
                    <Input
                      type="text"
                      style={{ width: "45px", backgroundColor: "white" }}
                      maxLength={3}
                      bordered={false}
                      value={trustScore}
                      onChange={handleTrustScore}
                      disabled={toggleEdit}
                    />
                    {toggleEdit && (
                      <span>
                        <Tooltip title="Edit Trust Score">
                          <Button
                            type="link"
                            onClick={(e) => {
                              setToggleEdit(!toggleEdit);
                              setToggleSave(!toggleSave);
                            }}
                          >
                            <EditFilled />
                          </Button>
                        </Tooltip>
                      </span>
                    )}
                    {toggleSave && (
                      <span>
                        <Tooltip title="SAVE">
                          {" "}
                          <Button type="text" disabled={!trustScore}>
                            <CheckCircleFilled
                              style={{
                                fontSize: "25px",
                                color: "green",
                                cursor: "pointer",
                              }}
                              onClick={updateTrustScore.bind(this, id)}
                            />
                          </Button>
                        </Tooltip>
                      </span>
                    )}
                  </Space>
                  <p>Trust Score</p>
                </div>
              </div>}
              </div>
       
          
          <Divider />
      
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            style={{ marginLeft: 5 }}
          >
          
            <TabPane tab="Feedback Received" key="1" >
              {userFeedbackReceiver.length === 0 ? (
                <div>No Feedback Received</div>
              ) : (
                <>
                  {userFeedbackReceiver?.map((u) => {
                    return (
                      <div >
                        <FeedbackCard
                          item={u}
                          getFeedbacks={getFeedbacks}
                          getConversations={getConversations}
                        />
                        <Divider />
                      </div>
                    );
                  })}
                   <Pagination total={receiverPages} onChange={pageChangeHandlerReceiver} current={pageNumberReceiver}/>
                </>
              )}
            </TabPane>
            
            <TabPane tab="Feedback Posted" key="2" >
              {userFeedbackSender.length === 0 ? (
                <div>No Feedback Posted</div>
              ) : (
                <>
                  {userFeedbackSender?.map((u) => {
                    return (
                      <div >
                        <FeedbackCard
                          item={u}
                          getFeedbacks={getFeedbacks}
                          getConversations={getConversations}
                        />
                        <Divider />
                      </div>
                    );
                  })}
                  <Pagination total={senderPages} onChange={pageChangeHandlerSender} current={pageNumberSender}/>
                </>
              )}
            </TabPane>
          </Tabs>
  
          
        </div>
      )}
    </div>
  );
}
