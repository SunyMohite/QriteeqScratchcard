import {
  Avatar,
  Divider,
  Button,
  Col,
  Row,
  Image,
  Space,
  Modal,
  Dropdown,
  Menu,
  Typography,
  Tooltip,
  Popover,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import moment from "moment";
import {
  ChatIcon,
  RejectedFeedbacksIcon,
  ApprovedFeedbacksIcon,
} from "../../icons";
import api from "../../services/feedaback";
import { createconversation } from "../../utils/firebase";
import smartphone from "../../assets/smartphone.png";
import smiley from "../../assets/smiley.png";
import { notify } from "../../utils/helper";
import useViewport from "../../hooks/useViewport";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../context/userInfo";
import sad from "../../assets/sad.png";
import fine from "../../assets/fine.png";
import great from "../../assets/great.png";
import poor from "../../assets/poor.png";
import amazing from "../../assets/amazing.png";
import globe from "../../assets/Globe.png";
import noPicture from "../../assets/no-profile-pic.jpg";
import UserCard from "./UserCard";
import Paragraph from "antd/lib/skeleton/Paragraph";
import videoIcon from "../../assets/videoIcon.png";
import {
  AntDesignOutlined,
  CaretRightOutlined,
  DownloadOutlined,
  FlagFilled,
  UserOutlined,
} from "@ant-design/icons";
const FeedbackCard = ({
  item,
  getFeedbacks,
  getConversations,
  activeTab,
  fetchFlaggedComments,
  DashboardTab,
  fetchDisputedFeedbacks,
  index,
 

}) => {

console.log('tab',index)
  

  const { userInfo } = useContext(UserInfo);
  const { isMobile } = useViewport();
  const [mediaType, setMediaType] = useState();
  const [userSpecificData, setUserSpecificData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [userFeedbackReceiver, setUserFeedbackReceiver] = useState([]);
  const [userFeedbackSender, setUserFeedbackSender] = useState([]);
  const [receiverPages, setReceiverPages] = useState(1);
  const [senderPages, setSenderPages] = useState(1);
  const [id, setId] = useState("");
  const [download, setDownload] = useState(false);
  const [flagModal, setFlagModal] = useState(false);
  
  
 

  console.log(index);
  
  const menu = (
    <Menu
      items={[
        {
          label: (
            <p
              onClick={() =>
                updatefeedback(
                  "rejected",
                  "This Content is Vulgar and Objectionable"
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
                updatefeedback("rejected", "It may cause violence or hatred")
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
                updatefeedback(
                  "rejected",
                  "This profile is pretending to be someone else"
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
                updatefeedback(
                  "rejected",
                  "This cannot be added as a Feedback"
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

  const showVideo = () => {
    setIsVideoVisible(true);
  };

  const handleOkVideo = () => {
    setIsVideoVisible(false);
  };

  const handleCancelVideo = () => {
    setIsVideoVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const downloadImage = () => {
    saveAs(
      item?.document[0]?.url || item?.feedback?.document[0]?.url,
      "image.jpg"
    );
  };
  const mediaCheck = () => {
    if (item?.document?.length > 0) {
      const media = item?.document[0]?.ext || item?.feedback?.document[0]?.ext;

      if (media?.match(/\.(jpeg|jpg|gif|png|.jpeg|.jpg|.gif|.png|)$/) != null) {
        setMediaType("image");
      } else if (media?.match(/\.(mp4|mov|mkv|.mp4)$/) != null) {
        setMediaType("video");
      } else if (
        media?.match(/\.(ppt|pdf|xls|doc|docx|xlsx|.ppt|.xls|.xlsx|.docx)$/) !=
        null
      ) {
        setMediaType("document");
      }
    }
  };

  const navigate = useNavigate();
  const updatefeedback = async (type, reasonText) => {
    console.log(item, "77777");
    let update = {};
    if (
      activeTab === "Flagged Comments" ||
      DashboardTab === "FLAGGED COMMENT"
    ) {
      update = await api.updateComment({
        flagId: item._id,
        status: type,
        reason: reasonText,
      });
    } else {
      update = await api.updatefeedback({
        feedbackId: item?._id,
        status: type,
        reason: reasonText,
      });
    }
    if (update?.data?.error) {
      notify("error", update?.data?.message);
    } else {
      if (type === "rejected") {
        createconversation(
          userInfo?._id,
          item?.sender?.id || item?.user?.id,
          `Hi User, We have rejected your feedback to ${
            item?.user?.username || item?.sender?.username
          } on ${moment().format("Do MMM YY")}`,
          item?.sender?.avatar || item?.user?.avatar,
          item?.sender?.username || item?.user?.username,
          navigate,
          "",
          "",
          "",
          "",
          item?.user?.username,
          item?.user?.avatar
        );
        if (getConversations) {
          setTimeout(() => {
            getConversations();
          }, 1500);
        }
      }

      notify("success", update?.data?.message);
      if (
        activeTab === "Flagged Comments" ||
        DashboardTab === "FLAGGED COMMENT"
      ) {
        fetchFlaggedComments();
      } else {
        getFeedbacks();
      }
    }
    //getFeedbacks();
  };

  const handleSenderClick = (id) => {
    showModal();
    setId(id);
    getUserSpecificData(id);
    getUserSpecificFeedbackReceiver(id);
    getUserSpecificFeedbackSender(id);
  };
  const getUserSpecificData = async (rowId) => {
    const { data } = await api.getUserData({ id: rowId ? rowId : "" });
    setUserSpecificData(data);
  };
  const getUserSpecificFeedbackReceiver = async (
    rowId,
    pageSize,
    pageNumber
  ) => {
    await api
      .getUserReceivedFeedback({
        user: rowId,
        limit: pageSize ? pageSize : 10,
        page: pageNumber ? pageNumber : 1,
      })
      .then((res) => {
        if (res?.data?.error === false) {
          setUserFeedbackReceiver(res?.data?.data?.results);
          setReceiverPages(res?.data?.data?.totalResults);
        }
      });
  };
  const getUserSpecificFeedbackSender = async (rowId, pageSize, pageNumber) => {
    await api
      .getUserPostedFeedback({
        sender: rowId ? rowId : null,
        limit: pageSize ? pageSize : 10,
        page: pageNumber ? pageNumber : 1,
      })
      .then((res) => {
        if (res?.data?.error === false) {
          setUserFeedbackSender(res?.data?.data?.results);
          setSenderPages(res?.data?.data?.totalResults);
        }
      });
  };
  useEffect(() => {
    mediaCheck();
    // getUserSpecificData();
    // getUserSpecificFeedbackReceiver();
    // getUserSpecificFeedbackSender();
  }, [mediaType]);

  return (
    <div className="feedback">
      <div className="row-space-bw">
        <div className={isMobile ? "" : "row-space-bw"}>
          <div className="flex">
            <Avatar
              src={
                item?.user?.avatar === null || !item?.user?.avatar
                  ? noPicture
                  : item?.sender?.avatar || item?.user?.avatar
              }
              size={isMobile ? 40 : 50}
            />
            {/* {Sender} */}
            <div>
              <div className="row-space-bw">
                <Tooltip
                  title={`See Details of ${
                    item?.sender?.fullName || item?.user?.fullName
                  }`}
                >
                  <div
                    className="ml-10"
                    onClick={() => {
                      handleSenderClick(
                        item?.sender ? item?.sender?.id : item?.user?.id
                      );
                    }}
                    style={{
                      cursor: "pointer",
                      color: "grey",
                      fontSize: isMobile ? "15px" : "18px",
                    }}
                  >
                    {item?.sender?.fullName || item?.user?.fullName }
                  </div>
                </Tooltip>
                <div>
                  <Tooltip
                    title={`chat with ${
                      item?.sender?.fullName || item?.user?.fullName
                    }`}
                  >
                    <Button
                      type="link"
                      onClick={() => {
                        createconversation(
                          userInfo?._id,
                          item?.sender ? item?.sender?.id : item?.user?.id,
                          "",
                          item?.sender
                            ? item?.sender?.avatar
                            : item?.user?.avatar,
                          item?.sender
                            ? item?.sender?.username
                            : item?.user?.username,
                          navigate,
                          "",
                          "",
                          "",
                          "",
                          item?.user?.username,
                          item?.user?.avatar
                        );
                        if (getConversations) {
                          setTimeout(() => {
                            getConversations();
                          }, 1500);
                        }
                      }}
                    >
                      <ChatIcon />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div className="ml-10 location">
                <Space>
                  <div>
                    <img
                      src={
                        item?.sender?.flagUrl === null || !item?.sender?.flagUrl
                          ? globe
                          : item?.sender?.flagUrl
                      }
                      alt="country_flag"
                      width={22}
                      height={22}
                    />
                  </div>
                  {/* <div className="title">{item?.user?.username}</div> */}

                  <div>
                    {item?.sender?.countryName === "" ? (
                      <span>Unknown Country</span>
                    ) : (
                      item?.sender?.countryName
                    )}

                    {/* {item?.sender?.locationName?.state === "" ? (
                      <span>Country</span>
                    ) : (
                      <span>, {item?.sender?.locationName?.state}</span>
                    )} */}
                  </div>
                </Space>
              </div>
            </div>
          </div>

          <div className={isMobile ? "flex" : "row-space-bw"}>
            {/* <div className="ml-10">
              <p style={{ color: "#A8A8A8", fontSize: "22px" }}>|</p>
            </div> */}
            {isMobile ? (
              ""
            ) : (
              // <Divider
              //   type="vertical"
              //   className="ml-5 mr-5"
              //   style={{ backgroundColor: "Black", height: "30px" }}
              // />
              <CaretRightOutlined
                style={{ fontSize: "30px", padding: "5px" }}
              />
            )}

            <Avatar
              src={
                item?.user?.avatar === null || !item?.user?.avatar
                  ? noPicture
                  : (activeTab === "Flagged Comments" || index === 3)
                  ? item?.flagged?.user?.avatar
                  :( activeTab === 'Disputed Feedbacks' || index === 4) ? item?.feedback?.user?.avatar : item?.user?.avatar
              }
              size={isMobile ? 40 : 50}
            />
            {/* Receiver */}

            <div className=" feedback-location row-space-bw">
              <Tooltip
                title={`See Details of ${
                  (activeTab === "Flagged Comments" || index === 3)
                    ? item?.flagged?.user?.fullName
                    : (activeTab ==='Disputed Feedbacks' || index ===4) ? item?.feedback?.user?.fullName :  item?.user?.fullName
                }`}
              >
                <div
                  onClick={() =>
                    handleSenderClick(
                      (activeTab === "Flagged Comments" || index ===3)
                        ? item?.flagged?.user?.id
                        :( activeTab === 'Disputed Feedbacks' || index === 4) ? item?.feedback?.user?.id :  item?.user?.id
                    )
                  }
                  style={{
                    cursor: "pointer",
                    fontSize: isMobile ? "15px" : "18px",
                    color: "grey",
                    marginBottom: "25px",
                    marginLeft: "10px",
                    wordBreak: "break-word",
                  }}
                >
                  {(activeTab === "Flagged Comments" || index === 3)
                    ? item?.flagged?.user?.fullName
                    : (activeTab ==='Disputed Feedbacks' || index === 4) ? item?.feedback?.user?.fullName :  item?.user?.fullName}
                </div>
              </Tooltip>
              <div>
                <Tooltip
                  title={`Chat with ${
                   ( activeTab === "Flagged Comments" || index===3)
                    ? item?.flagged?.user?.fullName
                    : (activeTab ==='Disputed Feedbacks' || index===4) ? item?.feedback?.user?.fullName :  item?.user?.fullName
                  }`}
                >
                  <Button
                    type="link"
                    style={{ marginBottom: "20px" }}
                    onClick={() => {
                      createconversation(
                        userInfo?._id,
                        ( activeTab === "Flagged Comments" || index===3)
                        ? item?.flagged?.user?.id
                        : (activeTab ==='Disputed Feedbacks' || index===4) ? item?.feedback?.user?.id :  item?.user?.id,
                        "",
                        ( activeTab === "Flagged Comments" || index===3)
                          ? item?.flagged?.user?.avatar
                          : (activeTab ==='Disputed Feedbacks' || index===4) ? item?.feedback?.user?.avatar : item?.user?.avatar,
                          ( activeTab === "Flagged Comments" || index===3)
                          ? item?.flagged?.user?.username
                          :(activeTab ==='Disputed Feedbacks' || index===4) ? item?.feedback?.user?.username :item?.user?.username,
                        navigate,
                        "",
                        "",
                        "",
                        "",
                        item?.user?.username,
                        item?.user?.avatar
                      );
                      if (getConversations) {
                        setTimeout(() => {
                          getConversations();
                        }, 1500);
                      }
                    }}
                  >
                    <ChatIcon />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {isMobile ? null : (
          <div className="row-space-bw">
            {/* <Button
              onClick={() => {
                createconversation(
                  userInfo?._id,
                  item?.sender?.id || item?.user?.id,
                  "",
                  item?.sender?.avatar || item?.user?.avatar,
                  item?.sender?.username || item?.user?.username,
                  navigate
                );
                if (getConversations) {
                  setTimeout(() => {
                    getConversations();
                  }, 1500);
                }
              }}
              className="btn-primary mr-20"
              size={"large"}
            >
              <div className="row-space-bw">
                <ChatIcon className="mr-5 mt--5" />
                <div>Chat</div>
              </div>
            </Button> */}
            {item?.status !== "rejected" && (
              <Dropdown overlay={menu}>
                <Button
                  // onClick={() => {
                  //   updatefeedback("rejected");
                  // }}
                  danger
                  className="btn-danger mr-20"
                  size={"large"}
                >
                  <div className="row-space-bw">
                    <RejectedFeedbacksIcon className="mr-5" />
                    <div>Reject</div>
                  </div>
                </Button>
              </Dropdown>
            )}

            {item?.status !== "approved" && (
              <Button
                onClick={() => {
                  updatefeedback("approved", "Done");
                }}
                className="btn-sucess mr-20"
                size={"large"}
              >
                <div className="row-space-bw">
                  <ApprovedFeedbacksIcon className="mr-5" />
                  <div>Approve</div>
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
      {/* <div className="feedback-title mt-20">{item?.score}</div> */}

      <div className="feedback-description row-space-bw mt-5">
        <div className="flex">
          <div>
            {mediaType === "image" && item?.document?.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Image
                  width={isMobile ? 100 : 250}
                  height={isMobile ? 100 : 250}
                  src={
                    item?.document[0]?.url || item?.feedback?.document[0]?.url
                  }
                  alt="Image"
                  fallback="image loading"
                  style={{ padding: "5px" }}
                />

                <Tooltip title="Download this Image" placement="bottom">
                  {" "}
                  <Button
                    type="link"
                    style={{ marginLeft: isMobile ? "50px" : "100px" }}
                    onClick={downloadImage}
                  >
                    {" "}
                    <DownloadOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <></>
            )}
            {mediaType === "video" && item?.document?.length > 0 ? (
              <video
                width={isMobile ? 100 : 250}
                height={isMobile ? 100 : 250}
                poster={videoIcon}
                onClick={showVideo}
                src={item?.document[0]?.url || item?.feedback?.document[0]?.url}
              >
                {/* <source
                    src={
                      item?.document[0]?.url || item?.feedback?.document[0]?.url
                    }
                  /> */}
              </video>
            ) : (
              <></>
            )}
            {mediaType === "document" && item?.document?.length > 0 ? (
              <div>
                <img
                  src="https://media.istockphoto.com/id/931778082/vector/download-button-vector-icon.jpg?s=612x612&w=0&k=20&c=-SWrynGUHE9RX5j1IfqyDGREWnV4uUIGWodUiY3xdBs="
                  width={isMobile ? "50" : "100"}
                  height={isMobile ? "50" : "100"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setDownload(true)}
                />
                {download && (
                  <a
                    href={
                      item?.document[0]?.url || item?.feedback?.document[0]?.url
                    }
                  >
                    <p>Download file</p>
                  </a>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <div
            className="ml-5"
            style={{ overflowY: "scroll", paddingTop: "20px" }}
          >
            <Typography.Paragraph
              style={{
                fontFamily: "revert-layer",
                fontSize: isMobile ? "14px" : "17px",
                paddingLeft: "5px",
                wordBreak: "break-all",
              }}
              ellipsis={{
                rows: 2,
                expandable: true,
                symbol: "...more",
                tooltip: "View More",
              }}
            >
              {item?.text || item?.flagged?.text || item?.feedback?.text}
            </Typography.Paragraph>
          </div>
        </div>
      </div>
      <Divider />
      {isMobile && (
        <>
          <div
            style={{
              display: "flex",
              //justifyContent: "space-between"
            }}
            className="feedback-button-group"
          >
            <Button
              onClick={() => {
                createconversation(
                  userInfo?._id,
                  item?.sender?.id,
                  "Hello",
                  item?.sender?.avatar,
                  item?.sender?.username,
                  navigate,
                  "",
                  "",
                  "",
                  "",
                  item?.user?.username,
                  item?.user?.avatar
                );
                if (getConversations) {
                  setTimeout(() => {
                    getConversations();
                  }, 1500);
                }
              }}
              className="btn-primary"
              //size={"small"}
            >
              <div className="row-space-bw">
                <ChatIcon width={20} height={20} className="mt--5" />
                <div>Chat</div>
              </div>
            </Button>

            {item?.status !== "rejected" && (
              <Dropdown overlay={menu}>
                <Button
                  // onClick={() => {
                  //   updatefeedback("rejected");
                  // }}
                  danger
                  className="btn-danger ml-5"
                  //size={"large"}
                >
                  <div className="row-space-bw">
                    <RejectedFeedbacksIcon
                      className="mr-5"
                      width={18}
                      height={18}
                    />
                    <div>Reject</div>
                  </div>
                </Button>
              </Dropdown>
            )}

            {item?.status !== "approved" && (
              <Button
                onClick={() => {
                  updatefeedback("approved", "Done");
                }}
                className="btn-sucess ml-5"
                //size={"large"}
              >
                <div className="row-space-bw">
                  <ApprovedFeedbacksIcon
                    width={18}
                    height={18}
                    className="mr-5"
                  />
                  <div>Approve</div>
                </div>
              </Button>
            )}
          </div>
          <Divider className="mt-5" />
        </>
      )}

      <div
        className="flex"
        style={{
          margin: "-8px",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <div className="flex">
          <div className="flex">
            <button
              className="shared-via-great-btn"
              style={{
                color: "orange",
                //padding: "0px 3px 0px 5px",
              }}
            >
              <strong
                style={{ marginLeft: "-2px", fontSize: isMobile ? "12px" : "" }}
              >
                Shared via
              </strong>
              <img
                src={smartphone}
                width={isMobile ? 15 : 20}
                height={isMobile ? 15 : 20}
                alt="phone"
              />
            </button>
          </div>
          <div>
            {item?.score ? (
              <button
                className="shared-via-great-btn ml-5"
                style={{
                  color: "blue",
                  cursor: "auto",
                }}
              >
                <div className="row-space-bw">
                  {item?.score === "bad" ? (
                    <img width={25} height={25} src={sad} />
                  ) : item?.score === "fine" ? (
                    <img width={25} height={25} src={fine} />
                  ) : item?.score === "poor" ? (
                    <img width={25} height={25} src={poor} />
                  ) : item?.score === "great" ? (
                    <img width={20} height={20} src={great} />
                  ) : item?.score === "amazing" ? (
                    <img width={25} height={25} src={amazing} />
                  ) : (
                    <></>
                  )}
                  <strong
                    style={{
                      marginLeft: "1px",
                      fontSize: isMobile ? "12px" : "",
                    }}
                  >
                    {item?.score}
                  </strong>
                </div>
              </button>
            ) : (
              <></>
            )}
          </div>
          {(activeTab === "Flagged Feedbacks" ||
            activeTab === "Flagged Comments") && (
            <div
              style={{
                marginLeft: "20px",
                display: "flex",
                flexDirection: "row",
                alignItems: "space-between",
              }}
            >
              {/* List of users who flagged */}
              <p style={{display:'flex'}}>
                <Tooltip title={activeTab==='Flagged Comments' ? "Flag reason" : "Flagged by"}>
                  <FlagFilled
                    style={{
                      color: "red",
                      fontSize: "20px",
                      paddingTop: "5px",
                    }}
                  />
                </Tooltip>
                {item?.reason && (
                  <div style={{marginLeft:'5%',width:'100%'}}>
                    {/* <Divider /> */}
                    {item?.reason}
                  </div>
                )}
              </p>
              {item?.flaggedBy  && <Button type="link" onClick={() => setFlagModal(!flagModal)}>
                <Avatar.Group
                  maxCount={item?.flaggedBy.length -1}
                  size="medium"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                    cursor: "pointer",
                  }}
                  maxPopoverPlacement="bottom"
                  maxPopoverTrigger="hover"
                >
                  

                  {item?.flaggedBy.map((item,index)=>(
                      <Avatar src={item.avatar} key={index} />
                  ))}
                  
                </Avatar.Group>
              </Button>}

              {item?.othersWhoFlagged  && <Button type="link" onClick={() => setFlagModal(!flagModal)}>
                <Avatar.Group
                  maxCount={2}
                  size="medium"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                    cursor: "pointer",
                  }}
                  maxPopoverPlacement="bottom"
                  maxPopoverTrigger="hover"
                >
                  

                  {item?.othersWhoFlagged.map((item,index)=>(
                      <Avatar src={item.avatar} key={index} />
                  ))}
                  
                </Avatar.Group>
              </Button>}
            </div>
          )}
        </div>
        <div className="ml-10 mt-5">{item?.createdAt || item?.created_at}</div>
      </div>

      
      <div>
        <Modal
          title="Details"
          bodyStyle={{ overflowY: "scroll", height: "500px ", padding: "15px" }}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1200}
          footer={[]}
        >
          <UserCard
            userSpecificData={userSpecificData}
            userFeedbackReceiver={userFeedbackReceiver}
            userFeedbackSender={userFeedbackSender}
            getUserSpecificFeedbackReceiver={getUserSpecificFeedbackReceiver}
            getUserSpecificFeedbackSender={getUserSpecificFeedbackSender}
            receiverPages={receiverPages}
            senderPages={senderPages}
            id={id}
          />
        </Modal>
      </div>

      {isVideoVisible && (
        <Modal
          visible={isVideoVisible}
          onOk={handleOkVideo}
          onCancel={handleCancelVideo}
          destroyOnClose={true}
          maskClosable={false}
          footer={[]}
        >
          <video
            width={isMobile ? 300 : 450}
            height={isMobile ? 300 : 450}
            controls
            autoPlay
            src={item?.document[0]?.url || item?.feedback?.document[0]?.url}
          >
            {/* <source
              src={item?.document[0]?.url || item?.feedback?.document[0]?.url}
            /> */}
          </video>
        </Modal>
      )}

      {(flagModal && (item?.flaggedBy) && (
        <Modal
          title="Flagged by"
          visible={flagModal}
          width={200}
          onCancel={() => setFlagModal(false)}
          footer={[]}
        >
          <div style={{ height: "150px", overflowY: "scroll" }}>
            {item?.flaggedBy?.map((item,index)=>(
                <Row gutter={[0, 0]} style={{ marginBottom: "5%" }} key={index}>
                <Col span={24}>
                  <Space>
                    <Avatar src={item.avatar} size={75} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p style={{ fontSize: "15px" }}>{item?.fullName}</p>
                      <Tooltip title={`chat with ${item?.fullName}`} >
                        <Button type="link" onClick={() =>
                         {
                        createconversation(
                          userInfo?._id,
                          item?.id,
                          "",
                          item?.avatar,
                          item?.username,
                          navigate,
                          "",
                          "",
                          "",
                          "",
                          item?.username,
                          item?.avatar
                        );
                        if (getConversations) {
                          setTimeout(() => {
                            getConversations();
                          }, 1500);
                        }

                        setFlagModal(false);
                      }}>
                          <ChatIcon style={{ fontSize: "50px" }} />
                        </Button>
                      </Tooltip>
                    </div>
                  </Space>
                </Col>
               
                  {/* <Space direction="horizontal">
                    <FlagFilled
                      style={{
                        color: "red",
                        fontSize: "20px",
                        marginBottom: "15px",
                      }}
                    /> */}
                    {/* pending from backend */}
                    {/* <p style={{ fontWeight: "bolder" }}>Reason:</p>
                  </Space> */}
                  {/* pending from backend */}
                  {/* <span style={{ fontSize: "15px", wordWrap: "break-word" }}>
                    This content is vulgar and Objectionable
                  </span> */}
                
              </Row>
            ))}
            
            
          </div>
        </Modal>
      ))}
    </div>
  );
};
export default FeedbackCard;
