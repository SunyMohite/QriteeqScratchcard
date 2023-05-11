import {
  CaretDownFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Dropdown,
  Menu,
  message,
  Row,
  Col,
  Divider,
  Progress,
  Avatar,
  Card,
} from "antd";
import React, { useContext, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { UserInfo } from "../../context/userInfo";
import useViewport from "../../hooks/useViewport";
import { apiDelete } from "../../utils/axios";
import FeedbackCard from "../Feedback";
import api from "../../services/feedaback";
import { useEffect } from "react";

const CampaignDataTable = ({
  campaigns,
  totalResults,
  fetchCampaignsOngoing,
  fetchCampaignsCompleted,
  fetchCampaigns,
  pageNumberCallBack,
  pageSizeCallBack,
  setLoader,
  callBackId,
  callBackAvatar,
  callBackName,
  callBackTitle,
  callBackDescription
}) => {
  // const { userInfo, getUserinfo } = useContext(UserInfo);
  // const [searchText, setSearchText] = useState("");
  // const { isLaptop, isMobile } = useViewport();
  // const [feedback, setFeedbackToggle] = useState(false);
  // const [viewfeedback, setViewfeedback] = useState({});
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { isLaptop,isMobile } = useViewport();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState();

  
 

  // const fetchSearchedFeedbacks = async (text, tab, size, pageNum) => {
  //   const payload = {
  //     search: text,
  //     status: tab,
  //     limit: size ? size : 10,
  //     page: pageNum ? pageNum : 1,
  //   };
  //   await api.searchFeedbacks(payload).then((res) => {
  //     setFeedback(res?.data?.data?.results);
  //     setTotalPages(res?.data?.data?.totalPages);
  //     setTotalResults(res?.data?.data?.totalResults);
  //   });
  // };
  // const fetchSearchedFlaggedComments = async (text, tab, size, pageNum) => {
  //   const payload = {
  //     search: text,
  //     status: tab,
  //     limit: size ? size : 10,
  //     page: pageNum ? pageNum : 1,
  //   };
  //   await api.searchFlaggedComments(payload).then((res) => {
  //     setUserData(res?.data?.data?.results);
  //     setTotalPages(res?.data?.data?.totalPages);
  //     setTotalResults(res?.data?.data?.totalResults);
  //   });
  // };
  // const handleSearch = (e) => {
  //   setSearchText(e.target.value);
  //   if (e.target.value !== "") {
  //     if (index === 0) {
  //       fetchSearchedFeedbacks(searchText, "pending");
  //     } else if (index === 1) {
  //       fetchSearchedFeedbacks(searchText, "checked");
  //     } else if (index === 2) {
  //       fetchSearchedFeedbacks(searchText, "flagged");
  //     } else if (index === 3) {
  //       //flag comment search api
  //       fetchSearchedFlaggedComments(searchText, "pending");
  //     }
  //   } else {
  //     if (index === 3) {
  //       fetchFlaggedComments();
  //     } else {
  //       getFeedback();
  //     }
  //   }
  // };
  const onShowSizeHandler = (current, pageSize) => {
    setPageSize(pageSize);
    pageSizeCallBack(pageSize);
   
    fetchCampaigns(pageSize,pageNumber);
    // setLoader(false);
  };
  // const onSelectChange = (newSelectedRowKeys) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  //   parentCallBack(newSelectedRowKeys);
  // };
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };
  // const hasSelected = selectedRowKeys.length > 0;

  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => <div></div>,
  //   filterIcon: (filtered) => <></>,
  //   onFilter: (value, record) => {
  //     if (record[dataIndex].username) {
  //       if (
  //         record[dataIndex].username.toLowerCase().includes(value.toLowerCase())
  //       ) {
  //         return record[dataIndex];
  //       }
  //     }
  //   },
  // });
  
  const titleContent = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* <div>From</div> */}
      <div >
        <Input  placeholder="From" size="small" prefix={<SearchOutlined style={{color:'white'}}/>}  style={{backgroundColor:'transparent'}} bordered={false} autoFocus />
      </div>
    </div>
  );

  const titleTo = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* <div>To</div> */}
      <div>
        <Input placeholder="To" size="small" prefix={<SearchOutlined style={{color:'white'}}/>}  style={{backgroundColor:'transparent'}} bordered={false}/>
      </div>
    </div>
  );

  const titleDate = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {/* <div>Date</div> */}
      <div>
        <Input placeholder="Date" size="small" prefix={<SearchOutlined style={{color:'white'}}/>}  style={{backgroundColor:'transparent'}} bordered={false}/>
      </div>
    </div>
  );

  const columns = [
    {
      title: "Title",
      dataIndex:'title',
       key: "title",
      // width: '30%',
      // ...getColumnSearchProps("sender"),
      // sorter: (a, b) => a?.sender?.username.localeCompare(b?.sender?.username),
      // sortDirections: ["descend", "ascend"],

      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>
              {e}
            </div>
          </div>
        );
      },
    },
    {
      title: "Started by",
       dataIndex: "user",
       key: "user",
      // width: '20%',
      // ...getColumnSearchProps("user"),
      // sorter: (a, b) => a?.user?.username.localeCompare(b?.user?.username),
      // sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.fullName}</div>
          </div>
        );
      },
    },
    {
      title: "Start Date",
     dataIndex: "startDate",
      key: "startDate",
      // sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
      // sortDirections: ["descend", "ascend"],
      render :(e)=>{
        return(
          <div className="row-space-bw">
              <div>{e}</div>
          </div>
        )
      }
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      //...getColumnSearchProps("moderator"),
      // sorter: (a, b) => a?.moderator?.email.localeCompare(b?.moderator?.email),
      // sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
    {
      title: "Description",
       dataIndex: "description",
      key: "description",
      //...getColumnSearchProps("status"),
      // sorter: (a, b) => a?.status.localeCompare(b?.status),
      // sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div >
              {e}
            </div>
          </div>
        );
      },
    },
    {
      title: "Feedback Received",
      dataIndex: "feedbacksReceivedCount",
      key: "feedbacksReceivedCount",
      //...getColumnSearchProps("moderator"),
      //sorter: (a, b) => a?.moderator?.email.localeCompare(b?.moderator?.email),
      //sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
    {
      title: "New Users",
      dataIndex: "newUsersCount",
      key: "newUsersCount",
      //...getColumnSearchProps("moderator"),
      //sorter: (a, b) => a?.moderator?.email.localeCompare(b?.moderator?.email),
      //sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
  ];

  

  return (
   <div >
    

      <Table
        rowKey={"id"}

        onRow={(record) => {
          return {
            onClick: (event) => {
              console.log(record.id);
              callBackId(record?.user.id);
              callBackAvatar(record?.user?.avatar);
              callBackName(record?.user?.fullName);
              callBackDescription(record?.description);
              callBackTitle(record?.title)

            },
          };
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        // rowSelection={{
        //   type: "checkbox",
        //   ...rowSelection,
        // }}
        columns={columns}
        pagination={{
          total: totalResults,
          showSizeChanger: true,
           onShowSizeChange: onShowSizeHandler,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: (e) => {
            // if (searchText !== "") {
            //   if (index === 0) {
            //     fetchSearchedFeedbacks(searchText, "pending", pageSize, e);
            //   } else if (index === 1) {
            //     fetchSearchedFeedbacks(searchText, "checked", pageSize, e);
            //   } else if (index === 2) {
            //     fetchSearchedFeedbacks(searchText, "flagged", pageSize, e);
            //   } else if (index === 3) {
            //     //flag comment search api
            //     fetchSearchedFlaggedComments(
            //       searchText,
            //       "pending",
            //       pageSize,
            //       e
            //     );
            //   }
            // } else {
            //   getFeedback(pageSize, e);
            // }
            fetchCampaigns(pageSize,e);
             setPageNumber(e);
             pageNumberCallBack(e);
             setLoader(false);
            
          },
        }}
         size={isMobile ? "small" : "large"}
        style={{
          height: "700px",
          overflowX: isLaptop ? "scroll" : "hidden",
          cursor: "pointer",
        }}
        dataSource={campaigns}
      />
   
      
     </div>
   
  );
};

export default CampaignDataTable;
