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
} from "antd";
import React, { useContext, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { UserInfo } from "../../context/userInfo";
import useViewport from "../../hooks/useViewport";
import { apiDelete } from "../../utils/axios";
import FeedbackCard from "../Feedback";
import api from "../../services/feedaback";
import { useEffect } from "react";

const DataTable = ({
  feedaback,
  getFeedback,
  setFeedback,
  setUserData,
  setLoader,
  pageNumberCallBack,
  pageSizeCallBack,
  totalPages,
  setTotalPages,
  setTotalResults,
  totalResults,
  moderators,
  parentCallBack,
  index,
  userData,
  DashboardTab,
  fetchFlaggedComments,
  fetchDisputedFeedbacks
}) => {
 
  const { userInfo, getUserinfo } = useContext(UserInfo);
  const [searchText, setSearchText] = useState("");
  const { isLaptop,isMobile } = useViewport();
  const [feedback, setFeedbackToggle] = useState(false);
  const [viewfeedback, setViewfeedback] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageSize,setPageSize] = useState(10);
  const [pageNumber,setPageNumber] = useState();

  
 

  
  const assignModeratorOnClick = async (feedbackID, moderatorID) => {
    let payload={};

    index === 4 ? payload = {
      disputeId: feedbackID,
      moderatorId: moderatorID,
    }: payload = {
      feedbackId: feedbackID,
      moderatorId: moderatorID,
    };
    
    
    return await api.assignModerator(payload).then((res) => {
      if (res?.data?.error === false && selectedRowKeys.length > 0) {
        message.success(res?.data?.message);
      } else {
        if (selectedRowKeys.length === 0) {
          message.error("Please Select Some Feedbacks");
        } else {
          message.error(res?.data?.message);
        }
      }
      setLoader(true)
      
      // index === 4 ?  fetchDisputedFeedbacks(pageSize,pageNumber) : getFeedback(pageSize,pageNumber);
      getFeedback(pageSize,pageNumber)
      setLoader(false);
    });
  };
  const menus = moderators.map((item, index) => {
    return (
      <Menu.Item
        key={index}
        onClick={() => assignModeratorOnClick(selectedRowKeys, item.id)}
      >
        {item.fullName}
        <span style={{ color: "grey" }}>- Moderator {index + 1}</span>
      </Menu.Item>
    );
  });
  const menu = () => {
    return <Menu>{menus}</Menu>;
  };
  const searchInput = useRef(null);

  
  const fetchSearchedFeedbacks = async(text,tab,size,pageNum)=>{
    const payload={
      search:text,
      status:tab,
      limit: size ? size :10,
      page: pageNum ? pageNum : 1
    }
   await api.searchFeedbacks(payload).then(res=>{
    setFeedback(res?.data?.data?.results); 
    setTotalPages(res?.data?.data?.totalPages);
   setTotalResults(res?.data?.data?.totalResults);})
  }
  const fetchSearchedFlaggedComments=async(text,tab,size,pageNum)=>{
    const payload={
      search:text,
      status:tab,
      limit: size ? size :10,
      page: pageNum ? pageNum : 1
    }
       await api.searchFlaggedComments(payload).then((res)=>
       {setUserData(res?.data?.data?.results);
        setTotalPages(res?.data?.data?.totalPages);
   setTotalResults(res?.data?.data?.totalResults);
        });
  }

  const fetchSearchedDisputed = async (text,size,pageNum)=>{
    
    const payload={
      search:text,
      limit: size ? size :10,
      assigned: userInfo.role==='admin' ? false :true,
      page:pageNum ? pageNum : 1
    }
    await api.searchDisputedFeedbacks(payload).then((res) =>{ setFeedback(res?.data?.data?.results); 
      setTotalPages(res?.data?.data?.totalPages);
     setTotalResults(res?.data?.data?.totalResults);
     // console.log(res?.data?.data?.totalResults);
     setLoader(false) })
  }

const handleSearch =(e)=>{
  setSearchText(e.target.value);
  if(e.target.value!==""){
    if(index===0){
      fetchSearchedFeedbacks(searchText,"pending");
    }
    else if(index===1){
      fetchSearchedFeedbacks(searchText,"checked");
    }else if(index===2){
      fetchSearchedFeedbacks(searchText,"flagged");
    }
    else if(index===3){
      //flag comment search api
      fetchSearchedFlaggedComments(searchText,"pending")
    }else if(index===4){
     
      fetchSearchedDisputed(searchText);
    }
  }
  else{
    if(index===3){
      fetchFlaggedComments();
    }
    else if(index===4){
      fetchDisputedFeedbacks();
    }
    else{
      getFeedback();
    }
    
  }

}
const onShowSizeHandler =(current, pageSize)=>{
  
  setPageSize(pageSize);
  pageSizeCallBack(pageSize);
  if(searchText!==""){
    if(index===0){
      fetchSearchedFeedbacks(searchText,"pending",pageSize,pageNumber);
    }
    else if(index===1){
      fetchSearchedFeedbacks(searchText,"checked",pageSize,pageNumber);
    }else if(index===2){
      fetchSearchedFeedbacks(searchText,"flagged",pageSize,pageNumber);
    }
    else if(index===3){
      //flag comment search api
      fetchSearchedFlaggedComments(searchText,"pending",pageSize,pageNumber)
    }else if(index===4){
     
      fetchSearchedDisputed(searchText,pageSize,pageNumber);
    }
  }
  else{
    getFeedback(pageSize,pageNumber);
    fetchDisputedFeedbacks(pageSize,pageNumber);
  }
 
  setLoader(false);
}
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    parentCallBack(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div>
        
      </div>
    ),
    filterIcon: (filtered) => (
      <></>
    ),
    onFilter: (value, record) => {
      if (record[dataIndex].username) {
        if (
          record[dataIndex].username.toLowerCase().includes(value.toLowerCase())
        ) {
          return record[dataIndex];
        }
      }
    },
  });

  // const handleFromSearch = (e)=>{

  //   setFromSearch(e.target.value);
    
  //     const filterSearch = feedaback.filter((x)=>x?.sender?.fullName.includes(fromSearch));
  //     setFeedback(filterSearch);
    
    

  // }
  const titleContent=(
    <div style={{display:'flex',justifyContent:'space-between'}}>
      {/* <div>From</div> */}
     <div>
      <Input
       placeholder="From" size="small" prefix={<SearchOutlined style={{color:'white'}}/>} style={{backgroundColor:'transparent',color:'white'}} bordered={false} />
     </div>
    </div>
  )

  const titleTo=(
    <div style={{display:'flex',justifyContent:'space-between'}}>
      {/* <div>To</div> */}
     <div>
      <Input  placeholder="To" size="small" prefix={<SearchOutlined style={{color:'white'}}/>} style={{backgroundColor:'transparent'}} bordered={false}/>
     </div>
    </div>
  )

  const titleDate=(
    <div style={{display:'flex',justifyContent:'space-between'}}>
      {/* <div>Date</div> */}
     <div>
      <Input placeholder="Date"  size="small" prefix={<SearchOutlined style={{color:'white'}}/>} style={{backgroundColor:'transparent'}} bordered={false}/>
     </div>
    </div>
  )
  

  const columnsModerator = [
    {
      title: titleContent,
      key: "sender",
      dataIndex: index===3 ? ["user"]: index===4 ?["user"]: "sender",
      // width: '30%',
      ...getColumnSearchProps("sender"),
      sorter: (a, b) => a?.sender?.username.localeCompare(b?.sender?.username),
      sortDirections: ["descend", "ascend"],
      
      render: (e) => {
        return (
          <div className="row-space-bw">
            
            <div>{e?.fullName ? e?.fullName : e?.flagged?.user?.fullName}</div>
          </div>
        );
      },
    },
    {
      title: titleTo,
      dataIndex: index===3 ? ["flagged","user"] :  index===4 ? ["feedback","user"] : "user",
      key: "user",
      // width: '20%',
      ...getColumnSearchProps("user"),
      sorter: (a, b) => a?.user?.username.localeCompare(b?.user?.username),
      sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.fullName}</div>
          </div>
        );
      },
    },
    {
      title: titleDate,
      dataIndex: index===4 ? "disputeDate" : "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
      sortDirections: ["descend", "ascend"],
      render :(e)=>{
        return(
          <div className="row-space-bw">
              <div>{e}</div>
          </div>
        )
      }
    },
    {
      title: "Checked By",
      dataIndex: "moderator",
      key: "moderator",
      hidden: index===3 ? true :false,
      //...getColumnSearchProps("moderator"),
      sorter: (a, b) => a?.moderator?.email.localeCompare(b?.moderator?.email),
      sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.email}</div>
          </div>
        );
      },
    },
    {
      title: "Status",
      // dataIndex: index ===4 ? ["feedback","status"]:"status",
      key:  index ===4 ? ["feedback","status"]:"status",
      //...getColumnSearchProps("status"),
      sorter: (a, b) => a?.status.localeCompare(b?.status),
      sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div
              style={{
                backgroundColor:
                ( e?.status || e?.feedback?.status) === "rejected" || (e?.status || e?.feedback?.status) === "flagged"
                ? "red"
                : (e?.status || e?.feedback?.status)  === "approved"
                ? "green"
                : "orange",
                color: "white",
                width: 90,
                height: 25,
                textAlign: "center",
                borderRadius: 5,
              }}
            >
              {index===4 ? e?.feedback?.status : e?.status}
            </div>
          </div>
        );
      },
    },
  ].filter((x)=>!x.hidden);

  const columnsAdmin = [
    {
      title: titleContent,
      dataIndex: index===4 ? "user": "sender",
      key: "sender",
      width: "20%",

      ...getColumnSearchProps("sender"),
      sorter: (a, b) => a?.sender?.username.localeCompare(b?.sender?.username),
      sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.fullName }</div>
          </div>
        );
      },
    },
    {
      title: titleTo,
      dataIndex: index===4 ? ["feedback","user"]:"user",
      key: "user",
      width: "15%",
      ...getColumnSearchProps("user"),
      sorter: (a, b) => a?.user?.username.localeCompare(b?.user?.username),
      sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.fullName}</div>
          </div>
        );
      },
    },
    {
      title: titleDate,
      width: "12%",
      dataIndex: index===4 ? "disputeDate" : "createdAt",
      key: "created_at",
      sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
      sortDirections: ["descend", "ascend"],
      render :(e)=>{
        return(
          <div className="row-space-bw">
              <div>{ e}</div>
          </div>
        )
      }
    },
    {
      title: "Assigned To",
      dataIndex: "moderator",
      width: "20%",
      sorter: (a, b) => {
        if (a.moderator != undefined && b.moderator != undefined) {
          a?.fullName.localeCompare(b?.fullName);
        }
      },
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e?.fullName}</div>
          </div>
        );
      },
    },

    {
      title: "Status",
     
      //  dataIndex: index ===4 ? ["feedback","status"]:"status",
      key: index ===4 ? ["feedback","status"]:"status",
      //...getColumnSearchProps("status"),
      // sorter: (a, b) => a?.status.localeCompare(b?.status),
      // sortDirections: ["descend", "ascend"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div
              style={{
                backgroundColor:
                ( e?.status || e?.feedback?.status) === "rejected" || (e?.status || e?.feedback?.status) === "flagged"
                    ? "red"
                    : (e?.status || e?.feedback?.status)  === "approved"
                    ? "green"
                    : "orange",
                color: "white",
                width: 90,
                height: 25,
                textAlign: "center",
                borderRadius: 5,
              }}
            >
              {index===4 ? e?.feedback?.status : e?.status}
            </div>
          </div>
        );
      },
    },
    {
      title: "",
      width: "20%",
      hidden: true,
      render: (e) => {
        return (
          <div
            className="row-space-bw"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button>
                  <Space>
                    Assigned To
                    <CaretDownFilled />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        );
      },
    },
  ]

  const columnsAdminFC=[
    {
    title: titleContent,
   dataIndex:["user","fullName"],
    width: "30%",
    ...getColumnSearchProps("user"),
    sorter: (a, b) => a?.user?.fullName.localeCompare(b?.user?.fullName),
    sortDirections: ["descend", "ascend"],
    render: (e) => {
      return (
        <div className="row-space-bw">
          <div>{e} </div>
          
        </div>
      );
    },
  },

  {
    title: titleTo,
     dataIndex:["flagged","user","fullName"],
    width: "30%",
    ...getColumnSearchProps("user"),
    sorter: (a, b) => a?.user?.username.localeCompare(b?.user?.username),
      sortDirections: ["descend", "ascend"],
    render: (e) => {
      return (
        <div className="row-space-bw">
          <div>{e}</div>
        </div>
      );
    },
  },
  {
    title: titleDate,
    width: "30%",
    dataIndex: "createdAt",
    key: "createdAt",
    sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
      sortDirections: ["descend", "ascend"],
  },
  {
    title: "Status",
    dataIndex: ["flagged","status"],
    width:"40%",
    //key: "status",
    //...getColumnSearchProps("status"),
     sorter: (a, b) => a.status.length - b.status.length,
     sortDirections: ["descend", "ascend"],
    render: (e) => {
      return (
        <div className="row-space-bw">
          <div
            style={{
              backgroundColor:
                e?.status === "rejected" || e?.status === "flagged"
                  ? "red"
                  : e?.status === "approved"
                  ? "green"
                  : "orange",
              color: "white",
              width: 90,
              height: 25,
              textAlign: "center",
              borderRadius: 5,
            }}
          >
            {e}
          </div>
        </div>
      );
    },
  },
]

  return (
    <div>
     {feedback && <Modal
        //  style={{width:"50vw"}}
        width={"80vw"}
        centered
        visible={feedback}
        footer=""
        onCancel={() => {
          setFeedbackToggle(false);
        }}
      >
        <FeedbackCard item={viewfeedback} getFeedbacks={getFeedback} DashboardTab={DashboardTab} fetchFlaggedComments={fetchFlaggedComments} fetchDisputedFeedbacks={fetchDisputedFeedbacks} index={index}/>
      </Modal>}
      
     
        <div
          style={{
            display: "flex",
            flexDirection:  isMobile ? 'column': 'row',
            justifyContent: "space-between",
            marginBottom: "10px",
           
          }}
        >
          <div style={{backgroundColor:'#F7F9FC' , width:isMobile ? 300:350,height:40,padding:1,border:'1px solid grey',borderRadius:'25px',marginLeft:'5px',marginBottom:'5px'}}> <Input type="text" placeholder="Search Feedbacks..." size="large" bordered={false} style={{ width: isMobile ? 295: 347 }} prefix={<SearchOutlined style={{fontSize:'20px'}}/>} value={searchText} onChange={handleSearch} allowClear /></div>

          {(userInfo.role === "admin" && DashboardTab!=="FLAGGED COMMENT")&&(
          <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            <Space>
              Bulk Assigned To
              <CaretDownFilled />
            </Space>
          </Button>
        </Dropdown>
          )}
        </div>
    
      
      {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
      
      <Table
        rowKey={index ===4 ? "id" : "_id"}
        onRow={(record) => {
          return {
            onClick: (event) => {
              
              setFeedbackToggle(true);
              setViewfeedback(record);
              
            },
          };
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={
          userInfo.role === "admin"
            ? index === 3
              ? columnsAdminFC
              : columnsAdmin
            : columnsModerator
        }
        pagination={{
          total: totalResults,
          showSizeChanger:true,
          onShowSizeChange :onShowSizeHandler,
          pageSizeOptions: ["10","20","50","100"],
          onChange: (e) => {
           
            if(searchText!==""){
              if(index===0){
                fetchSearchedFeedbacks(searchText,"pending",pageSize,e);
              }
              else if(index===1){
                fetchSearchedFeedbacks(searchText,"checked",pageSize,e);
              }else if(index===2){
                fetchSearchedFeedbacks(searchText,"flagged",pageSize,e);
              }
              else if(index===3){
                //flag comment search api
                fetchSearchedFlaggedComments(searchText,"pending",pageSize,e)
              }
            }
            else{
              getFeedback(pageSize,e);
              fetchDisputedFeedbacks(pageSize,e);
            }
            setPageNumber(e);
            pageNumberCallBack(e);
            setLoader(false)
          },
        }}
        size={isMobile? 'small':'large'}
        style={{ height: "700px", overflowX: isLaptop ? "scroll" : "hidden",cursor: "pointer" }}
        dataSource={index===3 ? userData:feedaback}
      />
    </div>
  );
};

export default DataTable;
