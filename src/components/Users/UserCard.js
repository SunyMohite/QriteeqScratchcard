import {
  Avatar,
  Divider,
  Tabs,
  Radio,
  message,
  Pagination,
  Switch,
  Input,
  Button,
  Space,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import { CheckCircleFilled, EditFilled, UserOutlined } from "@ant-design/icons";
import api from "../../services/feedaback";
import FeedbackCard from "../../components/Feedback";
import { UserInfo } from "../../context/userInfo";
import { getConversations } from "../../utils/firebase";
import useViewport from "../../hooks/useViewport";
import { CloseOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

const { TabPane } = Tabs;

export default function UserCard({
  userSpecificData,
  getUserSpecificFeedbackReceiver,
  getUserSpecificFeedbackSender,
  getUserSpecificData,
  getUserDetails,
  userFeedbackReceiver,
  userFeedbackSender,
  pageNumber,
  pageSize,
  rowId,
  senderPages,
  receiverPages,
  setVisible,
}) {
  // const [currentBtn, setCurrentBtn] = useState(false);
  const [btnStatus, setBtnStatus] = useState(
    userSpecificData?.data?.user?.autoApprove
  );
  const [feedaback, setFeedback] = useState([]);
  const [limit, setLimit] = useState(10);
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [coversation, setConversation] = useState([]);
  const { isMobile } = useViewport();
  const [generateReport, setGenerateReport] = useState(
    userSpecificData?.data?.user?.generateReportOption
  );
  const [pageNumberSender, setPageNumberSender] = useState(1);
  const [pageNumberReceiver, setPageNumberReceiver] = useState(1);
  const [trustScore, setTrustScore] = useState("");
  const [toggleEdit, setToggleEdit] = useState(true);
  const [toggleSave, setToggleSave] = useState(false);

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
  const pageChangeHandlerReceiver = (page, pageSize) => {
    getUserSpecificFeedbackReceiver(rowId, pageSize, page);
    setPageNumberReceiver(page);
  };
  const pageChangeHandlerSender = (page, pageSize) => {
    getUserSpecificFeedbackSender(rowId, pageSize, page);
    setPageNumberSender(page);
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

  const updateGenerateReport = async (id, status) => {
    const payload = {
      generateReportOption: status,
    };
    await api.updateExistingUsers(id, payload).then((res) => {
      if (res?.data?.data === false) {
        message.success(res?.data?.message);
      } else {
        message.error(res?.data?.message);
      }
    });
  };
  const handleReportChange = (state, event) => {
    setGenerateReport(!generateReport);
    updateGenerateReport(rowId, state);
  };
  useEffect(() => {
    getFeedbacks();
    // getConversations();
  }, []);
  const getConversations = async () => {
    const conversation = await getConversations(userInfo?._id);
    setConversation(conversation);
  };

  const handleTrustScore = (e) => {
    setTrustScore(e.target.value);
  };

  const handleBtnChange = (e) => {
    setBtnStatus(!btnStatus);

    approve(userSpecificData?.data?.user?.id, !btnStatus);
  };

  useEffect(() => {
    setBtnStatus(userSpecificData?.data?.user?.autoApprove);
    setGenerateReport(userSpecificData?.data?.user?.generateReportOption);
    setTrustScore(userSpecificData?.data?.user?.trustScore);
  }, [
    userSpecificData?.data?.user?.autoApprove,
    userSpecificData?.data?.user?.generateReportOption,
    userSpecificData?.data?.user?.trustScore,
  ]);

  const maskPhone = (phone) => {
    const last3Digits = phone.slice(-3);
    return last3Digits.padStart(phone.length, "*");
  };

  const updateTrustScore = async (id) => {
    const payload = {
      trustScore: trustScore,
    };
    await api.updateExistingUsers(id, payload).then((res) => {
      if (res?.data?.data === false) {
        message.success(res?.data?.message);
      } else {
        message.error(res?.data?.message);
      }
      getUserDetails(pageSize, pageNumber);
      getUserSpecificData(rowId);
      setToggleEdit(!toggleEdit);
      setToggleSave(!toggleSave);
    });
  };
  return (
    <div>
      {isMobile ? (
        <div className="userCard chat-menu">
          <CloseOutlined
            style={{ position: "absolute", right: "20px" }}
            onClick={() => {
              setVisible(false);
            }}
          />
          <div>
            <div className="flex-row-center">
              <Avatar src={userSpecificData?.data?.user?.avatar} size={50} />
              <div>
                <div className="title ml-10" style={{wordBreak:'break-word',fontSize:'11px'}}>
                  {userSpecificData?.data?.user?.fullName !== undefined
                    ? userSpecificData?.data?.user?.fullName
                    : userSpecificData?.data?.user?.phone !== undefined
                    ? maskPhone(userSpecificData?.data?.user?.phone)
                    : userSpecificData?.data?.user?.email != undefined
                    ? userSpecificData?.data?.user?.email
                    : ""}
                </div>
                <div className="ml-10 location">
                  {userSpecificData?.data?.user?.email}
                </div>
              </div>
            </div>
            <div className="flex-row-center mt-20" >
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
          <div style={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'flex-start',padding:'10px'}} >
            <div style={{marginBottom:'25px'}}>
                <div style={{marginBottom:'40px'}}>
                  <Radio.Group
                    className="enable-disable mt-5"
                    style={{ position: "absolute" }}
                    value={btnStatus}
                    onChange={handleBtnChange}
                  >
                    <Radio.Button
                      id="enable"
                      name="button"
                      value="enable"
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
                      value="disable"
                      className="enable-toggle"
                      style={{
                        color: btnStatus ? "black" : "white",
                        backgroundColor: btnStatus ? "transparent" : "red",
                      }}
                    >
                      Disable
                    </Radio.Button>
                  </Radio.Group>
                </div>
                
                <div className="anonymousText mt-10 mr-20 " style={{marginLeft:'30px'}} >{"Auto Approval"}</div>
            </div>
            
            { userInfo.role ==='admin' && <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <div style={{  display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center' }}>
                  <p><Switch checked={generateReport} size="small" onChange={handleReportChange} /> </p>
                  <p style={{fontSize:'16px'}}> Generate Report</p>
                </div>
                <div >
                  <div >
                        <Input type="text" style={{ width: '45px', backgroundColor: 'white' }} maxLength={3} bordered={false} value={trustScore}  onChange={handleTrustScore} disabled={toggleEdit} />
                        {toggleEdit && <span>
                          <Tooltip title="Edit Trust Score">
                            <Button type="link" onClick={(e) => {
                              setToggleEdit(!toggleEdit);
                              setToggleSave(!toggleSave);
                            }}

                            ><EditFilled /></Button>
                          </Tooltip>
                        </span>}
                      { toggleSave && <span>
                          <Tooltip title="SAVE"> <Button type="text" disabled={!trustScore}><CheckCircleFilled style={{ fontSize: '25px', color: 'green', cursor: 'pointer' }} onClick={updateTrustScore.bind(this, rowId)}  /></Button></Tooltip>
                        </span>}
                  </div>
                    <p style={{fontSize:'17px'}}>Trust Score</p>
                </div>
            </div>}
            
          </div>
          <div>
            <Divider className="mt-50" />
            <Tabs defaultActiveKey="1">
              <TabPane tab="Feedback Received" key="1">
                {" "}
                {userFeedbackReceiver.length === 0 ? (
                  <div>No Feedback Received</div>
                ) : (
                  <>
                    {userFeedbackReceiver?.map((u, index) => {
                      return (
                        <div key={index}>
                          <FeedbackCard
                            item={u}
                            getFeedbacks={getFeedbacks}
                            getConversations={getConversations}
                          />
                          <Divider />
                        </div>
                      );
                    })}
                    <Pagination
                      total={receiverPages}
                      onChange={pageChangeHandlerReceiver}
                      current={pageNumberReceiver}
                    />
                  </>
                )}
              </TabPane>
              <TabPane tab="Feedback Posted" key="2">
                {userFeedbackSender.length === 0 ? (
                  <div>No Feedback Posted</div>
                ) : (
                  <>
                    {userFeedbackSender?.map((u, index) => {
                      return (
                        <div key={index}>
                          <FeedbackCard
                            item={u}
                            getFeedbacks={getFeedbacks}
                            getConversations={getConversations}
                          />
                          <Divider />
                        </div>
                      );
                    })}
                    <Pagination
                      total={senderPages}
                      onChange={pageChangeHandlerSender}
                      current={pageNumberSender}
                    />
                  </>
                )}
              </TabPane>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="userCard chat-menu ml-10 scrollable-height">
          <CloseOutlined
            style={{ position: "absolute", right: "20px" }}
            onClick={() => {
              setVisible(false);
            }}
          />
          <div
            className="mt-10"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <div className="flex-row-center ">
                <Avatar
                  size={70}
                  src={userSpecificData?.data?.user?.avatar}
                  icon={<UserOutlined />}
                />
                <div>
                  <div className="title ml-10">
                    {userSpecificData?.data?.user?.fullName !== undefined
                      ? userSpecificData?.data?.user?.fullName
                      : userSpecificData?.data?.user?.phone !== undefined
                      ? maskPhone(userSpecificData?.data?.user?.phone)
                      : userSpecificData?.data?.user?.email != undefined
                      ? userSpecificData?.data?.user?.email
                      : ""}
                  </div>
                  <div className="ml-10 location">
                    {userSpecificData?.data?.user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-10" style={{ display: "flex",flexDirection:'column',justifyContent:'center',alignItems:'center',marginRight:'55px' }}>
                
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
                <div className=" m-10 anonymousText mr-20">
                  {"Auto Approval"}
                </div>
              </div>
            </div>

            <div>
              <div
                className="flex-row-center mt-10"
                style={{ marginRight: "25px" }}
              >
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
                              onClick={updateTrustScore.bind(this, rowId)}
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
          </div>

          <Divider />

          <Tabs defaultActiveKey="1" style={{ marginLeft: 5 }}>
            <TabPane tab="Feedback Received" key="1">
              {userFeedbackReceiver.length === 0 ? (
                <div>No Feedback Received</div>
              ) : (
                <>
                  {userFeedbackReceiver?.map((u, index) => {
                    return (
                      <div key={index}>
                        <FeedbackCard
                          item={u}
                          getFeedbacks={getFeedbacks}
                          getConversations={getConversations}
                        />
                        <Divider />
                      </div>
                    );
                  })}
                  <Pagination
                    total={receiverPages}
                    onChange={pageChangeHandlerReceiver}
                    current={pageNumberReceiver}
                  />
                </>
              )}
            </TabPane>
            <TabPane tab="Feedback Posted" key="2">
              {userFeedbackSender.length === 0 ? (
                <div>No Feedback Posted</div>
              ) : (
                <>
                  {userFeedbackSender?.map((u, index) => {
                    return (
                      <div key={index}>
                        <FeedbackCard
                          item={u}
                          getFeedbacks={getFeedbacks}
                          getConversations={getConversations}
                        />
                        <Divider />
                      </div>
                    );
                  })}
                  <Pagination
                    total={senderPages}
                    onChange={pageChangeHandlerSender}
                    current={pageNumberSender}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        </div>
      )}
    </div>
  );
}
