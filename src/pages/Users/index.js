import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Input, Row, Space } from "antd";
import api from "../../services/feedaback";
import useViewport from "../../hooks/useViewport";
import { useLocation, useNavigate } from "react-router-dom";
import { UserInfo } from "../../context/userInfo";
import { DataTable } from "../../components/Users";
import UserCard from "../../components/Users/UserCard";
import Search from "antd/lib/transfer/search";
import { SearchOutlined } from "@ant-design/icons";

const Users = () => {
  const { isMobile } = useViewport();
  const [userData, setUserData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectuser, setSelectUser] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loader,setLoader] = useState(false);

  const getUserDetails = async (limit, e) => {
    setLoader(true);
    const { data } = await api.getAllUsers({ limit: limit, page: e ? e : 1 });

    if (data?.error === false) {
      setUserData(data?.data?.results);
      setTotalPages(data?.data?.totalPages);
      setTotalResults(data?.data?.totalResults);
      setLoader(false)
    }
  };
  const fetchSearchedUsers = async (searchValue) => {
    const payload = {
      search: searchValue
    }
    await api.searchUsers(payload).then((res) => setUserData(res?.data?.data?.results));
  }
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value !== "") {
      fetchSearchedUsers(searchText);
    }
    else {
      getUserDetails()
    }
  }
  useEffect(() => {
    (async () => {
      getUserDetails();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isMobile ? (<>

        <Row className="ant-col-24"
          style={{marginBottom: '40%'}}
          xs={24}
          sm={24}
          md={24}
          xl={24}
          xxl={24}>

          <Col xs={23}
            span={24}>
            <Space direction="vertical">
              <div className="title mr-5">Users</div>
              <div
                style={{
                  backgroundColor: "#F7F9FC",
                  width: 330,
                  height: 40,
                  padding: 1,
                  border: "1px solid grey",
                  borderRadius: "25px",
                  marginBottom: "10px",
                }}
              >
              <Input type="text" placeholder="Search Users" size="large" bordered={false} style={{ width: 325 }} prefix={<SearchOutlined style={{fontSize:'20px'}}/>} value={searchText} onChange={handleSearch} allowClear />
              </div>
            </Space>

            <DataTable
              userData={userData}
              setUserData={setUserData}
              getUserDetails={getUserDetails}
              totalResults={totalResults}
              selectuser={selectuser}
              setSelectUser={setSelectUser}
              loader={loader}
              setLoader={setLoader}
            />
          </Col>
        </Row></>) : (
        <Row className="ant-col-24">
          <Col xs={23}
            span={24}>
          <Space direction="horizontal">
              <div className="title mb-10">Users</div>
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
              <Input type="text" placeholder="Search Users..." size="large" bordered={false} style={{ width: 345 }} prefix={<SearchOutlined style={{fontSize:'20px'}}/>} value={searchText} onChange={handleSearch} allowClear />
              </div>
            </Space>
            <DataTable
              userData={userData}
              setUserData={setUserData}
              getUserDetails={getUserDetails}
              totalResults={totalResults}
              selectuser={selectuser}
              setSelectUser={setSelectUser}
              loader={loader}
              setLoader={setLoader}
            />
          </Col>
        </Row>)}
    </>
  );
};
export default Users;
