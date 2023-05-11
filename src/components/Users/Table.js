import { EditFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Table, Space, Modal, message, Switch, Spin } from "antd";
import React, { useEffect, useState,useContext } from "react";
import { UserInfo } from "../../context/userInfo";
import useViewport from "../../hooks/useViewport";
import api from "../../services/feedaback";
import UserCard from "./UserCard";

const DataTable = ({ userData, totalResults, getUserDetails ,setUserData,loader,setLoader}) => {
  const { isLaptop,isMobile } = useViewport();
  const [userSpecificData, setUserSpecificData] = useState({});
  const [userFeedbackReceiver, setUserFeedbackReceiver] = useState([]);
  const [userFeedbackSender, setUserFeedbackSender] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [alert, setAlert] = useState("");
  const [rowId , setRowId] = useState("");
  const [pageNumber, setPageNumber] = useState();
  const [pageSize,setPageSize] = useState(10);
  const [receiverPages,setReceiverPages] = useState(1);
  const [senderPages,setSenderPages] = useState(1);
 
  const { userInfo } = useContext(UserInfo);

  const showModal = () => {
    editUserDetails(userSpecificData?.data?.user);
    setIsModalVisible(true)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const editUserDetails = (details) => {
    const edited = {
      fullName: details.fullName,
      phone: details.phone,
      email: details.email,
    };
   
    setEditDetails(edited);
    
  };
  const handleEditChange = (e) => {
    if (e.target.name === "name") {
      editDetails.fullName = e.target.value;
    } else if (e.target.name === "email") {
      editDetails.email = e.target.value;
    } else if (e.target.name === "phone") {
      editDetails.phone = e.target.value;
      if (editDetails.phone.length < 13) {
        setAlert("enter valid phone number");
      } else {
        setAlert("");
      }
    }

    setEditDetails(Object.assign({}, editDetails));

  };
  const updateDetails = async (id) => {
    await api.updateExistingUsers(id, editDetails).then((res) => {
    
      if (res?.data?.data === false) {
        message.success(res?.data?.message);
      } else {
        message.error(res?.data?.message);
      }
      getUserDetails(pageSize,pageNumber);
      getUserSpecificData(rowId);
    });
  };
  const onShowSizeHandler = (current, pageSize) => {
   
    setPageSize(pageSize);
    getUserDetails(pageSize,current);
    setLoader(false);
  };
  const getUserSpecificData = async (rowId) => {
    const { data } = await api.getUserData({ id: rowId ? rowId : null });
    setUserSpecificData(data);
  };
  const getUserSpecificFeedbackReceiver = async (rowId,pageSize,pageNumber) => {
    await api.getUserReceivedFeedback({ user: rowId ? rowId : null ,limit:pageSize ? pageSize: 10,page:pageNumber ? pageNumber: 1}).then((res) => {
      if (res?.data?.error === false) {
        setUserFeedbackReceiver(res?.data?.data?.results);
        setReceiverPages(res?.data?.data?.totalResults);
       
      }
    });
  };
  const getUserSpecificFeedbackSender = async (rowId,pageSize,pageNumber) => {
    await api.getUserPostedFeedback({ sender: rowId ? rowId : null ,limit:pageSize ? pageSize: 10,page:pageNumber ? pageNumber: 1}).then((res) => {
      if (res?.data?.error === false) {
        setUserFeedbackSender(res?.data?.data?.results);
        setSenderPages(res?.data?.data?.totalResults);
        
      }
    });
  };
  const maskPhone = (phone) => {
    const last3Digits = phone.slice(-3);
    return last3Digits.padStart(phone.length, "*");
  };
  //eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
   
  //     getUserSpecificData();
  //     getUserSpecificFeedbackReceiver();
  //     getUserSpecificFeedbackSender();
    
  // }, [rowId,pageSize,pageNumber]);

  const columns = [
    {
      title: "Name",
      width: "auto",
      hidden:false,
      sorter: (a,b) => a?.fullName?.length-b?.fullName?.length,
      sortDirections: ['descend', 'ascend'],
      render: (row) => {
        return (
          <div className="row-space-bw">
            <div style={{wordBreak:'break-word'}}>
              {row.fullName
                ? row.fullName
                : row.username
                ? row.username
                : row.phone
                ? maskPhone(row.phone)
                : row.email}
            </div>
          </div>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      hidden:false,
      // key: "phone",
      width: "auto",
      sorter: (a,b) => a?.phone?.length-b?.phone?.length,
      sortDirections: ['descend', 'ascend'],
      render: (row) => {
        return (
          <div className="row-space-bw">
          <div style={{wordBreak:'break-word'}}>{row != null? maskPhone(row) : "N/A"}</div>
        </div> 
        );
      },
    },
    {
      title: "Email",
      width: "auto",
     hidden:false,
      sorter: (a, b, sortOrder) => {
        if (a.email != null && b.email != null) {
          a.email.localeCompare(b.email);
        }
        if (a.email) {
          return sortOrder === 'ascend' ? 1 : -1;
        }
        if (b.email) {
          return sortOrder === 'ascend' ? -1 : 1;
        }
        return 0;
      },
      sortDirections: ['descend', 'ascend'],
      render: (row) => {
        return (
          <div className="row-space-bw">
            <div style={{wordBreak:'break-word'}}>{row?.email ? row?.email : "N/A"}</div>
          </div>
        );
      },
    },
    {
      title:"Trust Score",
      width:'auto',
      hidden:false,
      render:(e)=>{
        return(
          <div style={{wordBreak:'break-word'}}>
            {e.trustScore}
          </div>
        )
      }
    },

    {
      title: "Edit",
      hidden: userInfo.role === 'admin' ? false: true,
      width: "auto",
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>
              <Button
                title={e.id ===rowId ? "Edit details" : "Click on Row"}
                onClick={showModal}
                disabled={e.id ===rowId ? false: true}
              > 
                <EditFilled />
              </Button>
            </div>
          </div>
        );
      },
    },
  ].filter(item => !item.hidden);
  return (
    <>
      <div>
        <Modal
          title="Edit User Details"
          visible={isModalVisible}
          onOk={(e) => {
            updateDetails(userSpecificData?.data?.user?.id);
            setIsModalVisible(false);
          }}
          onCancel={handleCancel}
        >
          <p>
            <Input
              prefix="Name"
              name="name"
              value={editDetails.fullName}
              onChange={handleEditChange}
            />
          </p>
          <p>
            <Input
              prefix="Phone"
              name="phone"
              value={editDetails.phone}
              onChange={handleEditChange}
              maxLength={13}
            />
            <span style={{ color: "red" }}>{alert}</span>
          </p>
          <p>
            <Input
              prefix="Email"
              name="email"
              value={editDetails.email}
              onChange={handleEditChange}
            />
          </p>
        </Modal>

        
      </div>
      {!visible ? (
        <Row>
          <Col span={24}>
          
            { loader ? (<Spin tip="Loading..."/>) : 
            (<Table
              rowKey="id"
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    
                    setRowId(record.id);
                    getUserSpecificData(record.id);
                    getUserSpecificFeedbackReceiver(record.id);
                    getUserSpecificFeedbackSender(record.id);
                    setVisible(true);
                  },
                };
              }}
              dataSource={userData}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              size= {isMobile ? 'small': 'large'}
              columns={columns}
              pagination={{
                total: totalResults,
                showSizeChanger:true,
                onShowSizeChange:onShowSizeHandler ,
                pageSizeOptions: ["10","20","50","100"],
                onChange: (e) => {
                  getUserDetails(pageSize,e);
                  setPageNumber(e);
                  setLoader(false);
                },
              }}
             
              tableLayout='fixed'
              style={{
                height: "700px",
                width:'100vw',
                overflowX: isLaptop ? "auto" : "hidden",
              //  overflowWrap: isMobile ? 'break-word' :'anywhere' ,
                cursor:'pointer'
              }}
            />)}
          </Col>
        </Row>
      ) : (
        <Row>
          <Col  span={12} sm={24} md={12} xs={24} xxl={12}>
          
           {loader ? (<Spin tip="Loading..."/>) :
            (<Table
              rowKey="id"
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    
                    setRowId(record.id);
                    getUserSpecificData(record.id);
                    getUserSpecificFeedbackReceiver(record.id);
                    getUserSpecificFeedbackSender(record.id);
                    setVisible(true);
                
                  },
                };
              }}
              dataSource={userData}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              columns={columns}
              pagination={{
                total: totalResults,
                showSizeChanger:true,
                onShowSizeChange :onShowSizeHandler,
                pageSizeOptions: ["10","20","50","100"],
                onChange: (e) => {
                  getUserDetails(pageSize,e);
                  setPageNumber(e);
                  setLoader(false);
                },
              }}
                 
                 tableLayout='fixed'
                 size= {isMobile ? 'small': 'large'}
              style={{
                height: "700px",
                overflowX: isLaptop ? "auto" : "hidden",
                // overflowWrap: isMobile ? 'break-word' :'anywhere' ,
                cursor:'pointer'
              }}
            />)}
          </Col>
          <Col   span={12} sm={24} md={12} xs={24} xxl={12} >
            <div >
              <UserCard
                userSpecificData={userSpecificData}
                getUserSpecificData={getUserSpecificData}
                userFeedbackReceiver={userFeedbackReceiver}
                getUserDetails={getUserDetails}
                pageNumber={pageNumber}
                pageSize={pageSize}
                getUserSpecificFeedbackReceiver={getUserSpecificFeedbackReceiver}
                getUserSpecificFeedbackSender={getUserSpecificFeedbackSender}
                userFeedbackSender={userFeedbackSender}
               receiverPages={receiverPages}
               senderPages={senderPages}
               rowId={rowId}
               setVisible={setVisible}
              />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default DataTable;
