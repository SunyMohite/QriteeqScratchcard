import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Col,
  Row,
  Badge,
  Card,
  Menu,
  Avatar,
  Input,
  Button,
  Space,
  Spin,
} from "antd";
import moment from "moment";
import api from "../../services/feedaback";
import FeedbackCard from "../../components/Feedback";
import { TabBar } from "antd-mobile";
import * as DB from "../../utils/firebase";
import { useScrollToBottom } from "use-scroll-to-bottom";
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  SearchOutline,
} from "antd-mobile-icons";
import {
  createconversation,
  getconversations,
  getMessages,
} from "../../utils/firebase";
import { CloseIcon, SendIcon } from "../../icons";
import { notify } from "../../utils/helper";
import useViewport from "../../hooks/useViewport";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../route/constant";
import { UserInfo } from "../../context/userInfo";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
const Feedback = () => {
  const { isMobile } = useViewport();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [feedaback, setFeedback] = useState([]);
  const [coversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [currentmessage, setcurrentmessage] = useState({});
  const [messagelist, setMessagelist] = useState([]);
  const [activeTab, setActiveTab] = useState("All feedbacks");
  const [setBottomRef, isBottom] = useScrollToBottom();
  const [loader, setLoader] = useState(false);
  const [messageLoader,setMessageLoader] = useState(false);

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(15);
  const ref = useRef();

  const [filteredConversations, setFilteredConversation] = useState([]);
  const [searchText, setSearchText] = useState("");
 
 

  const { Search } = Input;
  const onSearch = (e) => {

    if(e.target.value!==""){
      const filteredconv = coversation.filter((name) =>
      name.senderusername.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredConversation(filteredconv);
    }
    else{
     
      setFilteredConversation(coversation);
    }
   
  };
  let params = new URLSearchParams(location.search);
  console.log(totalResults);
  const fetchSearchedFeedbacks = async (text, tab) => {
    const payload = {
      search: text,
      status: tab,
      limit:limit,
      page:1
    };
    setLoader(true)
    await api
      .searchFeedbacks(payload)
      .then((res) =>{ setFeedback(res?.data?.data?.results); 
         setTotalPages(res?.data?.data?.totalPages);
        setTotalResults(res?.data?.data?.totalResults);
        // console.log(res?.data?.data?.totalResults);
        setLoader(false) });
  };


  const fetchSearchedDisputed = async (text)=>{
    
    const payload={
      search:text,
      limit: limit,
      assigned: userInfo.role==='admin' ? false :true,
      page:1
    }
    await api.searchDisputedFeedbacks(payload).then((res) =>{ setFeedback(res?.data?.data?.results); 
      setTotalPages(res?.data?.data?.totalPages);
     setTotalResults(res?.data?.data?.totalResults);
     // console.log(res?.data?.data?.totalResults);
     setLoader(false) })
  }

  const fetchSearchedFlaggedComments = async (text, tab) => {
    const payload = {
      search: text,
      status: tab,
      limit:limit,
      page:1
    };
    setLoader(true)
    await api
      .searchFlaggedComments(payload)
      .then((res) =>{ setFeedback(res?.data?.data?.results);  
        // setTotalPages(res?.data?.data?.totalPages);
        // setTotalResults(res?.data?.data?.totalResults);
        console.log(res?.data?.data?.totalResults)
        setLoader(false)});
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value !== "") {
      if (activeTab === "All feedbacks") {
        
        fetchSearchedFeedbacks(searchText, "all");
      } else if (activeTab === "Flagged Feedbacks") {
        fetchSearchedFeedbacks(searchText, "flagged");
      } else if (activeTab === "Flagged Comments") {
        fetchSearchedFlaggedComments(searchText, "pending");
      } else if (activeTab === "Assigned to you") {
        fetchSearchedFeedbacks(searchText, "pending");
      }
      else if (activeTab === "Approved") {
        fetchSearchedFeedbacks(searchText, "approved");
      } else if (activeTab === "Rejected") {
        fetchSearchedFeedbacks(searchText, "rejected");
      }else if(activeTab === 'Disputed Feedbacks'){
        fetchSearchedDisputed(searchText)
      }

    } else {
      if (activeTab === "Flagged Comments") {
        fetchFlaggedComments();
      }else if(activeTab === 'Disputed Feedbacks'){
         fetchDisputedFeedbacks();
      } 
      else {
     
        getFeedbacksbystatus();
      }
    }
  };

  const fetchFlaggedComments = async () => {
    setLoader(true);
    const data = await api.getFlaggedComments({
      status: "pending",
      limit: 10,
      page: 1,
    });
    if (data?.data?.error === false) {
      setTotalPages(data?.data?.data?.totalPages);
      setTotalResults(data?.data?.data?.totalResults);
      setFeedback(data?.data?.data?.results);
      setLoader(false);
    }
    return data;
  };

  
  const getConversations = async () => {
    const conversation = await getconversations(userInfo?._id);
    setConversation(conversation);
    setFilteredConversation(conversation);
  };

  useEffect(() => {
    if (userInfo?._id) {
      var unsubscribe = DB.default.db
        .collection("conversations")
        .where("sender", "==", userInfo?._id)
        .onSnapshot(function (snapshot) {
          getConversations();
        });

      unsubscribe();
    }
    if (params.get("id") !== null) {
      var unsubscribe = DB.default.db
        .collection("messagesMediaSending")
        .where("conid", "==", params.get("id"))
        .onSnapshot(function (snapshot) {
          getMessagelist(params.get("id"));
        });

      unsubscribe();
    }
  }, []);

  const getMessagelist = async (coid) => {
    setMessageLoader(true);
    const messages = await getMessages(coid);
    setMessagelist(messages);
    setMessageLoader(false);
  };

  useEffect(() => {
    if (messagelist.length && endChatRef.current) {
      endChatRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [messagelist]);

  const [activeKey, setActiveKey] = useState("feedback");

  const tabs = [
    {
      key: "feedback",
      title: "Feedback",
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: "message",
      title: "Messages",
      icon: (active) => (active ? <MessageFill /> : <MessageOutline />),
      badge: "99+",
    },
  ];

  const locationTab = useLocation();

  const fetchDisputedFeedbacks = async (limit,e)=>{
    setLoader(true);
    const data = await api.getDisputedFeedbacks({
      limit: limit ? limit :10,
      page: e ? e : 1,
      assigned: userInfo.role === 'admin' ? false:true
    })
    if (data?.data?.error === false) {
      setTotalResults(data?.data?.data?.totalResults);
      setTotalPages(data?.data?.data?.totalPages);
      setFeedback(data?.data?.data?.results);
      console.log(data);
      setLoader(false);
    }
  }

  const getFeedbacksbystatus = async () => {
    locationTab.state
      ? setActiveTab(locationTab.state.activeTab)
      : setActiveTab(activeTab);

    if (activeTab === "All feedbacks") {
      setLoader(true);
      const data = await api.getFeedbackfilter({
        status: "all",
        limit: limit,
        page: 1,
        assigned: false,
      });
      if (data?.data?.error === false) {
        //setLimit(limit + 10);
        setTotalPages(data?.data?.data?.totalPages);
        setTotalResults(data?.data?.data?.totalResults);
        setFeedback(data?.data?.data?.results);
        setLoader(false);
      }
    } else if (activeTab === "Rejected") {
      setLoader(true);
      const data = await api.getFeedbackfilter({
        status: "rejected",
        limit: limit,
        page: 1,
        assigned: false,
      });
      if (data?.data?.error === false) {
        //setLimit(limit + 10);
        setTotalPages(data?.data?.data?.totalPages);
        setTotalResults(data?.data?.data?.totalResults);
        setFeedback(data?.data?.data?.results);
        setLoader(false)
      }
    } else if (activeTab === "Assigned to you") {
      setLoader(true);
      const data = await api.getFeedbackfilter({
        status: "pending",
        limit: limit,
        page: 1,
        assigned: true,
      });
      if (data?.data?.error === false) {
        //setLimit(limit + 10);
        setTotalPages(data?.data?.data?.totalPages);
        setTotalResults(data?.data?.data?.totalResults);
        setFeedback(data?.data?.data?.results);
        setLoader(false);
      }
    } else if (activeTab === "Flagged Feedbacks") {
      setLoader(true);
      const data = await api.getFeedbackfilter({
        status: "flagged",
        limit: limit,
        page: 1,
        assigned: false,
      });
      if (data?.data?.error === false) {
        //setLimit(limit + 10);
        setTotalPages(data?.data?.data?.totalPages);
        setTotalResults(data?.data?.data?.totalResults);
        setFeedback(data?.data?.data?.results);
        
        setLoader(false);
      }
    } else if (activeTab === "Approved") {
      setLoader(true);
      const data = await api.getFeedbackfilter({
        status: "approved",
        limit: limit,
        page: 1,
        assigned: false,
      });
      if (data?.data?.error === false) {
        //setLimit(limit + 10);
        setTotalPages(data?.data?.data?.totalPages);
        setTotalResults(data?.data?.data?.totalResults);
        setFeedback(data?.data?.data?.results);
        setLoader(false);
      }
    } else if (activeTab === "Flagged Comments") {
      fetchFlaggedComments();
    } else if (activeTab === "Disputed Feedbacks") {
      fetchDisputedFeedbacks();
    }
  };

  useEffect(() => {
    
    if(searchText!==""){
      if (activeTab === "All feedbacks") {
        
        fetchSearchedFeedbacks(searchText, "all");
      } else if (activeTab === "Flagged Feedbacks") {
        fetchSearchedFeedbacks(searchText, "flagged");
      } else if (activeTab === "Flagged Comments") {
        fetchSearchedFlaggedComments(searchText, "pending");
      } else if (activeTab === "Assigned to you") {
        fetchSearchedFeedbacks(searchText, "pending");
      }
      else if (activeTab === "Approved") {
        fetchSearchedFeedbacks(searchText, "approved");
      } else if (activeTab === "Rejected") {
        fetchSearchedFeedbacks(searchText, "rejected");
      }else if(activeTab === 'Disputed Feedbacks'){
        fetchSearchedDisputed(searchText)
     } 
    }
    else{
      if (activeTab === "Flagged Comments") {
        fetchFlaggedComments();
      }else if(activeTab === 'Disputed Feedbacks'){
        fetchDisputedFeedbacks();
     }  else {
     
        getFeedbacksbystatus();
      }
    }
    // fetchSearchedFeedbacks();
    // fetchSearchedFlaggedComments();

   
  }, [activeTab, limit,searchText]);


  // useEffect(() => {
  //   getFeedbacksbystatus();
  //   // fetchSearchedFeedbacks();
  //   // fetchSearchedFlaggedComments();
  // }, []);
  var paramId = params.get("id");

  useEffect(() => {
    if (paramId !== null) {
      const currentconversation = coversation?.filter(
        (i) => i?.conversationId === paramId
      );
      setcurrentmessage(currentconversation?.[0]);
      getMessagelist(paramId);
    }
  }, [paramId,filteredConversations]);

  // useEffect(() => {
  //   if (searchText!=="" && limit < totalResults) {
  //     console.log('with is bottom dependancy')
  //     // getFeedbacksbystatus();
  //     fetchSearchedFeedbacks()
  //   }
  // }, [searchText]);
  useEffect(() => {
    if (ref) {
      ref?.current?.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [params.get("id") !== null]);

useEffect(()=>{
  getConversations();
},[userInfo._id])


  useEffect(() => {
    getUserinfo();
    getFeedbacksbystatus();
    // fetchFlaggedComments();
    
  }, []);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const endChatRef = useRef();

  return (
    <div>
      {isMobile ? (
        <div style={{marginBottom: '20%'}}>
          <Row >
            {activeKey === "feedback" && (
              <Col
                style={{
                  overflowY: "scroll",
                }}
                xs={24}
                sm={24}
                md={24}
                xl={24}
                xxl={24}
                span={24}
              >
                <Space direction="vertical">
                  <div className="title">Feedbacks </div>
                  <div
                    style={{
                      backgroundColor: "#F7F9FC",
                      width: 320,
                      height: 40,
                      padding: 4,
                      border: "1px solid grey",
                      borderRadius: "25px",
                      marginLeft: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    {" "}
                    <Input
                      type="text"
                      placeholder="Search Feedbacks..."
                      //size="large"
                      bordered={false}
                      style={{ width: "348" }}
                      prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                      value={searchText}
                      onChange={handleSearch}
                      allowClear
                    />
                  </div>
                </Space>
                <select
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setLimit(10);
                    setActiveTab(e.target.value);
                  }}
                >
                  <option value={"All feedbacks"}>All feedbacks</option>
                  {userInfo.role === "moderator" && (
                    <option value={"Assigned to you"}>Assigned to you</option>
                  )}
                  <option value={"Flagged Feedbacks"}>Flagged Feedbacks</option>
                  <option value={"Flagged Comments"}>Flagged Comments</option>
                  <option value={"Approved"}>Approved</option>
                  <option value={"Rejected"}>Rejected</option>
                  <option value={"Disputed Feedbacks"}>Disputed Feedbacks</option>
                </select>
                {feedaback?.map((u) => {
                  return (
                    <Card
                      style={{ marginBottom: 15, width:'100%' }}
                      className="dashboard-card-analytics"
                      
                    >
                      <FeedbackCard
                        item={u}
                        getFeedbacks={getFeedbacksbystatus}
                        getConversations={getConversations}
                        fetchFlaggedComments={fetchFlaggedComments}
                        activeTab={activeTab}
                      
                      
                      />
                    </Card>
                  );
                })}
                <div className="flex" style={{ justifyContent: "center" }}>
              {totalResults > 15 && totalResults !== limit && (
                <Button
                  type="link"
                  onClick={() => {
                    {
                      totalResults - limit > 15
                        ? setLimit(limit + 15)
                        : setLimit(limit + (totalResults - limit));
                    }
                  }}
                >
                  Load More
                </Button>
              )}
            </div>
              </Col>
            )}
            {activeKey === "message" && (
              <Col
                style={{
                  overflowY: "scroll",
                }}
                className="mt-20"
                xs={24}
                sm={24}
                md={24}
                xl={24}
                xxl={24}
                span={24}
              >
                {currentmessage?.conversationId ? (
                  <div>
                    <div style={{height:'600px',marginTop:'5vw'}}>
                      <div className="chat--container">
                        <div className="chat-block">
                          <Avatar
                            src={currentmessage?.sendarAvatar}
                            size={50}
                          />
                          <div className="chat-item ml-10">
                            {currentmessage?.senderusername}
                          </div>
                        </div>
                        <div>
                          <CloseIcon
                            onClick={() => {
                              navigate(ROUTES.FEEDBACK);
                              setcurrentmessage({});
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>

                      <div ref={ref} className="message-list-container">
                        {messagelist?.[0]?.message?.map((i) => {
                          return (
                            <>
                              {i?.sender === userInfo?._id ? (
                                <div className="right-message-container">
                                  <div className="right-message">
                                    {messageLoader ? <Spin indicator={antIcon}/> : <>
                                    <div className="long-message">
                                      {i?.message}
                                    </div>
                                    <div className="time">
                                      {moment(i?.created.toDate()).fromNow()}
                                    </div></>}
                                    
                                  </div>
                                </div>
                              ) : (
                                <div className="left-message-container">
                                  <div className="left-message">
                                    {messageLoader ? <Spin indicator={antIcon}/> : <>
                                    <div className="long-message">
                                      {i?.message}
                                    </div>
                                    <div className="time">
                                      {moment(i?.created.toDate()).fromNow()}
                                    </div></>}
                                    
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                      </div>
                      <div className="send-mssage-container"  >
                        <Input
                          className="send-message-input"
                          style={{width:'85%'}}
                          placeholder="Send a message..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (message?.trim() === "") {
                                notify("error", "Please enter your message");
                              } else {
                                createconversation(
                                  userInfo?._id,
                                  currentmessage?.reciever,
                                  message,
                                  currentmessage?.sendarAvatar,
                                  currentmessage?.senderusername,
                                );
                                setTimeout(() => {
                                  getMessagelist(
                                    currentmessage?.conversationId
                                  );
                                  getConversations();
                                }, 1000);
                                setMessage("");
                              }
                            }
                          }}
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                          }}
                        />
                        <SendIcon
                          onClick={() => {
                            if (message?.trim() === "") {
                              notify("error", "Please enter your message");
                            } else {
                              createconversation(
                                userInfo?._id,
                                currentmessage?.reciever,
                                message,
                                currentmessage?.sendarAvatar,
                                currentmessage?.senderusername
                              );
                              setTimeout(() => {
                                getMessagelist(currentmessage?.conversationId);
                                getConversations();
                              }, 1000);
                              setMessage("");
                            }
                          }}
                          
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Menu
                    className="chat-menu chat-menu-flow"
                    theme="light"
                    mode="inline"
                  >
                    <div className="title mt-20" >Chatroom</div>
                <Search
                  className="mt-5 mb-10"
                  placeholder="Search"
                  size="large"
                  allowClear
                  onChange={onSearch}
                  style={{
                    width: 300,
                    height:'40px'
                  }}
                />
                    {filteredConversations.length > 0
                  ? filteredConversations?.map((i) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          navigate(
                            ROUTES.FEEDBACK + `?id=${i?.conversationId}`
                          );
                        }}
                        key={i?.conversationId}
                      >
                        <div className="row-space-bw">
                          <div className="row-space-bw">
                            <Avatar src={i?.sendarAvatar} size={45} />
                            <div>
                              <div className="chat-item ml-10">
                                {i?.senderusername}
                              </div>
                              <div className="ml-10 chat-message">
                                {i?.lastmessage}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Menu.Item>
                    );
                  })
                  : 
                  <>
                  </>}
                  </Menu>
                )}
              </Col>
            )}
          </Row>
          <TabBar
            activeKey={activeKey}
            onChange={(e) => {
              setActiveKey(e);
            }}
          >
            {tabs.map((item) => (
              <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
          </TabBar>
        </div>
      ) : (
        <Row gutter={[30, 30]}>
          <Col
            className="col-style"
            xs={24}
            sm={24}
            md={24}
            xl={18}
            xxl={18}
            span={18}
          >
            <Space direction="horizontal">
              <div className="title mb-10">Feedbacks</div>
              <div
                style={{
                  backgroundColor: "#F7F9FC",
                  width: 350,
                  height: 40,
                  padding: 1,
                  border: "1px solid grey",
                  borderRadius: "25px",
                  marginLeft: "5px",
                  marginBottom: "10px",
                }}
              >
                <Input
                  type="text"
                  placeholder="Search Feedbacks..."
                  size="large"
                  bordered={false}
                  style={{ width: 348 }}
                  prefix={<SearchOutlined style={{ fontSize: "20px" }} />}
                  value={searchText}
                  onChange={handleSearch}
                  allowClear
                />
              </div>
            </Space>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={24} xl={4} xxl={4} span={2}>
                <div
                  className={
                    activeTab === "All feedbacks"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setLimit(15);
                    setActiveTab("All feedbacks");
                  }}
                  style={{ width: "100%" }}
                >
                  All feedbacks
                </div>
              </Col>
              {userInfo.role === "moderator" && (
                <Col xs={24} sm={24} md={24} xl={4} xxl={4} span={2}>
                  <div
                    className={
                      activeTab === "Assigned to you"
                        ? "tab-feedback-active cursor-pointer"
                        : "tab-feedback-unactive cursor-pointer"
                    }
                    onClick={() => {
                      setLimit(15);
                      setActiveTab("Assigned to you");
                    }}
                    style={{ width: "100%" }}
                  >
                    Assigned to you
                  </div>
                </Col>
              )}
              <Col xs={24} sm={24} md={24} xl={5} xxl={4} span={2}>
                <div
                  className={
                    activeTab === "Flagged Feedbacks"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setLimit(15);
                    setActiveTab("Flagged Feedbacks");
                  }}
                  style={{ width: "100%" }}
                >
                  Flagged Feedbacks
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} xl={5} xxl={4} span={0}>
                <div
                  className={
                    activeTab === "Flagged Comments"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setActiveTab("Flagged Comments");
                  }}
                  style={{ width: "100%" }}
                >
                  Flagged Comments
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} xl={3} xxl={4} span={0}>
                <div
                  className={
                    activeTab === "Approved"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setLimit(15);
                    setActiveTab("Approved");
                  }}
                  style={{ width: "100%" }}
                >
                  Approved
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} xl={3} xxl={4} span={2}>
                <div
                  className={
                    activeTab === "Rejected"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setLimit(15);
                    setActiveTab("Rejected");
                  }}
                  style={{ width: "100%" }}
                >
                  Rejected
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} xl={3} xxl={4} span={2}>
                <div
                  className={
                    activeTab === "Disputed Feedbacks"
                      ? "tab-feedback-active cursor-pointer"
                      : "tab-feedback-unactive cursor-pointer"
                  }
                  onClick={() => {
                    setLimit(15);
                    setActiveTab("Disputed Feedbacks");
                  }}
                  style={{ width: "100%" }}
                >
                  Disputed Feedbacks
                </div>
              </Col>
            </Row>
            {feedaback?.map((u) => {
              return (
                <>

                  <Card
                    style={{ marginBottom: 15 }}
                    className="dashboard-card-analytics"
                  >
                    {loader ? (<Spin tip="Loading..." />) : <FeedbackCard
                      item={u}
                      getFeedbacks={getFeedbacksbystatus}
                      getConversations={getConversations}
                      fetchFlaggedComments={fetchFlaggedComments}
                      activeTab={activeTab}
                    
                    />}
                  </Card>
                </>
              );
            })}
            <div className="flex" style={{ justifyContent: "center" }}>
              {totalResults > 15 && totalResults !== limit && (
                <Button
                  type="link"
                  onClick={() => {
                    {
                      totalResults - limit > 15
                        ? setLimit(limit + 15)
                        : setLimit(limit + (totalResults - limit));
                    }
                  }}
                >
                  Load More
                </Button>
              )}
            </div>
            <div ref={setBottomRef}>.</div>
          </Col>
          <Col
            className="col-conversation"
            xs={24}
            sm={24}
            md={24}
            xl={6}
            xxl={6}
            span={6}
          >
            {currentmessage?.conversationId && (
              <div className="message-drop-menu">
                <div style={{ height: "100%",marginTop:'20px' }}>
                  <div className="chat--container">
                    <div className="chat-block">
                      <Avatar src={currentmessage?.sendarAvatar} size={50} />
                      <div className="chat-item ml-10">
                        {currentmessage?.senderusername}
                      </div>
                    </div>
                    <div>
                      <CloseIcon
                        onClick={() => {
                          navigate(ROUTES.FEEDBACK);
                          setcurrentmessage({});
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <div ref={ref} className="message-list-container">
                    {messagelist?.[0]?.message?.map((i) => {
                      return (
                        <>
                          {i?.sender === userInfo?._id ? (
                             
                              <div className="right-message-container">
                              <div className="right-message">
                             { messageLoader ?  <Spin indicator={antIcon}/>:
                             <>
                              <div className="long-message">{i?.message}</div>
                                <div className="time">
                                  {moment(i?.created.toDate()).fromNow()}
                                </div>
                                </>}
                              </div>
                            </div>
                          ) : (
                            <div className="left-message-container">
                              <div className="left-message">
                                {messageLoader ? <Spin indicator={antIcon}/> : <>
                                <div className="long-message">{i?.message}</div>
                                <div className="time">
                                  {moment(i?.created.toDate()).fromNow()}
                                </div>
                                </>}
                                
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })}
                    <div
                      ref={endChatRef}
                      className="right-message-container"
                      style={{ border: "1px solid" }}
                    ></div>
                  </div>
                  <div className="send-mssage-container">
                    <Input
                      className="send-message-input"
                      placeholder="Send a message..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (message?.trim() === "") {
                            notify("error", "Please enter your message");
                          } else {
                            createconversation(
                              userInfo?._id,
                              currentmessage?.reciever,
                              message,
                              currentmessage?.sendarAvatar,
                              currentmessage?.senderusername
                            );
                            setTimeout(() => {
                              getMessagelist(currentmessage?.conversationId);
                              getConversations();
                            }, 1000);
                            setMessage("");
                          }
                        }
                      }}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                    <SendIcon
                      onClick={() => {
                        if (message?.trim() === "") {
                          notify("error", "Please enter your message");
                        } else {
                          createconversation(
                            userInfo?._id,
                            currentmessage?.reciever,
                            message,
                            currentmessage?.sendarAvatar,
                            currentmessage?.senderusername
                          );
                          setTimeout(() => {
                            getMessagelist(currentmessage?.conversationId);
                            getConversations();
                          }, 1000);
                          setMessage("");
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <Menu
                className="chat-menu chat-menu-flow"
                style={{ float: "right" }}
                theme="light"
                mode="inline"
              >
                <div className="title mt-10" style={{marginTop:'20px'}}>Chatroom</div>
                <Search
                  className="mt-10"
                  placeholder="Search"
                  size="large"
                  allowClear
                  onChange={onSearch}
                  style={{
                    width: 300,
                    // height:40
                  }}
                />
                {filteredConversations.length > 0
                  ? filteredConversations?.map((i) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          navigate(
                            ROUTES.FEEDBACK + `?id=${i?.conversationId}`
                          );
                        }}
                        key={i?.conversationId}
                      >
                        <div className="row-space-bw">
                          <div className="row-space-bw">
                            <Avatar src={i?.sendarAvatar} size={45} />
                            <div>
                              <div className="chat-item ml-10">
                                {i?.senderusername}
                              </div>
                              <div className="ml-10 chat-message">
                                {i?.lastmessage}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Menu.Item>
                    );
                  })
                  : (<></>)
                }
              </Menu>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};
export default Feedback;
