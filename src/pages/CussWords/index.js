import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Input,
  Button,
  Checkbox,
  Space,
  Modal,
  Dropdown,
  Menu,
  Card
} from "antd";
import useViewport from "../../hooks/useViewport";
import { DeleteFilled, EditFilled, SearchOutlined } from "@ant-design/icons";
import api from "../../services/feedaback";
import FeedbackCard from "../../components/Feedback";

const Cusswords = () => {
  const [cuss, setCuss] = useState([]);
  const { isMobile } = useViewport();
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [cussModal,setCussModal] = useState(false);
  const [cussFeedbacks,setCussFeedbacks]= useState([]);

  const [editWord, setEditWord] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const updateSearch = useRef();

  const handleNewWord = (e) => {
    setNewWord(e.target.value);
  };
  const showSaveModal = () => {
    setSaveModalVisible(true);
  };
  const showEditModal = () => {
    setEditModalVisible(true);
  };
  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  const handleSaveOk = () => {
    setSaveModalVisible(false);
    setNewWord("");
  };

  const handleSaveCancel = () => {
    setSaveModalVisible(false);
  };
  const handleEditOk = () => {
    setEditModalVisible(false);
  };
  const handleEditCancel = () => {
    setEditModalVisible(false);
  };
  const handleDeleteOk = () => {
    setDeleteModalVisible(false);
  };
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };
  const ascendingSort = () => {
    const ascending = [...cuss].sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase() ? 1 : -1));
    setCuss(ascending);
  };
  const descendingSort = () => {
    const descending = [...cuss].sort((a, b) => (a.word.toLowerCase() < b.word.toLowerCase() ? 1 : -1));
    setCuss(descending);
  };
  const fetchCussWords = async () => {
    const { data } = await api.getCussWords();  
    setCuss(data.data.results);
  };

  const addNewCussWord = () => {
    const newCuss = {
      word: newWord,
    };
    const data = api.addCussWord(newCuss).then((res) => {
      fetchCussWords();
    });
    

    handleSaveOk();
  };
  const editCussWord = () => {
    const id = deleteId;
    const editedCussWord = {
      word: editWord,
    };
    api.updateCussWord(id,editedCussWord).then((res) => {
     
      fetchCussWords();
    });
    handleEditCancel();
  };
  const deleteCussWord = () => {
    const id = deleteId;
    api.removeCussWord(id).then((res) => {
     
      fetchCussWords();
      setEdit(!edit);
    });
    handleDeleteCancel();
  };
  const searchCussWords = (e) => {
    
    setSearch(e?.target?.value);
    if (e?.target?.value !== "") {
      var filteredWords = cuss.filter((item) => item.word.toLowerCase().includes(updateSearch?.current?.input?.value.toLowerCase()));
      
      setCuss(filteredWords);
    } else {
      fetchCussWords();
    }
  };
 const fetchCussFeedbacks = async()=>{
  const data= await api.getCussFeedbacks();
  setCussFeedbacks(data?.data?.data?.results);
  console.log(cussFeedbacks)
}
 


  useEffect(() => {
    fetchCussWords();
    fetchCussFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const menu = (
    <Menu
      items={[
        {
          label: <p onClick={ascendingSort}>Sort Ascending</p>,
          key: "0",
        },
        {
          label: <p onClick={descendingSort}>Sort Descending</p>,
          key: "1",
        },
      ]}
    />
  );
  return (
    <div>
      {isMobile ? (
        
      <Row>
        <div>
        <div className="title" style={{ width: "40%" }}>

              Cuss Words
            </div>
            <Input
              size="small"
              type="text"
              placeholder="Search cuss words"
              value={search}
              ref={updateSearch}
              onChange={searchCussWords}
              prefix={<SearchOutlined />}
              suffix={
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Space>
                    <p
                      style={{
                        fontSize: "14px",
                        margin: "8px",
                      }}
                    >
                      ⇅
                    </p>
                  </Space>
                </Dropdown>
              }
            ></Input>

            <Space style={{margin: "20px 0px 0px -15px"}}>
              <Button className="add-words h-30" onClick={showSaveModal}>
                + ADD WORD
              </Button>
              <Button
              className="h-30 mr-10"
              style={{ backgroundColor: !edit ? "gray" : "white", color: !edit ? "white" : "gray" }}
                onClick={showEditModal}
                disabled={!edit ? true : false}
              >
                <EditFilled />
                EDIT
              </Button>
              
            </Space>
            <Space className="mt-10">
              <Button
              className="h-30"
              style={{ backgroundColor: !edit ? "gray" : "white", color: !edit ? "white" : "gray" }}
                onClick={showDeleteModal}
              disabled={!edit ? true : false}
              >
                <DeleteFilled />
                DELETE
              </Button>
              <Button  className="h-30" onClick={()=>setCussModal(true)}>
                Cuss Words Feedbacks
              </Button>
            </Space>
            <Col xs={24} style={{marginBottom: "100px"}}>
              {cuss?.map((item, index) => {
                while (index < 12)
                  return (
                    <>
                      <p
                        key={index}
                        style={{
                          margin: 15,
                          padding: 5,
                          backgroundColor: "white",
                          borderRadius: "10px",
                          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          display:"inline-block"
                        }}
                      >
                        <Checkbox
                          type="checkbox"
                          style={{wordBreak:'break-word'}}
                          id={item.id}
                          onChange={(e) => {
                            e.target.checked ? setDeleteId(e.target.id):setDeleteId(undefined);
                            setEdit(!edit);
                            setEditWord(e.target.value);
                          }}
                          value={item.word}
                          checked={item.id === deleteId ? true : false}
                        >
                          {item.word}
                        </Checkbox>
                      </p>
                    </>
                  );
              })}
            </Col>
            </div>
        </Row>) : (
          <div>
                <Row>
                <Col
                  style={{
                    overflowY: "scroll",
                    height: "10vh",
                    paddingRight: 0,
                    width: "80wh",
                    overflowX: "hidden",
                  }}
                  className="mt-5"
                  span={24}
                  xs={24}
                  sm={24}
                  md={24}
                  xl={18}
                  xxl={18}
                >
                
                  <div className="cuss-word">
                    <div className="title" style={{ width: "40%" }}>
                      Cuss Words
                    </div>
        
                    <Input
                      size="small"
                      type="text"
                      placeholder="Search cuss words"
                      value={search}
                      onChange={searchCussWords}
                      ref={updateSearch}
                      prefix={<SearchOutlined />}
                      suffix={
                        <Dropdown overlay={menu} trigger={["click"]}>
                          <Space>
                            <p
                              style={{
                                fontSize: "14px",
                                margin: "8px",
                              }}
                            >
                              ⇅
                            </p>
                          </Space>
                        </Dropdown>
                      }
                    ></Input>
        
                    <Space>
                      <Button className="add-words h-40" onClick={showSaveModal}>
                        + ADD WORD
                      </Button>
                      <Button
                      className="h-40 br-5"
                        style={{ backgroundColor: !edit ? "gray" : "white", color: !edit ? "white" : "gray" }}
                        onClick={showEditModal}
                        disabled={!edit ? true : false}
                      >
                        <EditFilled />
                        EDIT
                      </Button>
                      <Button
                      className="h-40 br-5"
                        style={{ backgroundColor: !edit ? "gray" : "white", color: !edit ? "white" : "gray" }}
                        onClick={showDeleteModal}
                        disabled={!edit ? true : false}
                      >
                        <DeleteFilled />
                        DELETE
                      </Button>
                      <Button className="h-40 br-5" onClick={()=>setCussModal(true)}>
                         Cuss Words Feedbacks
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
              <Row style={{padding:'1%'}}>
              <div className="cussword-card-analytics" >
        <Col style={{height:'500px'}}>
         
            <div style={{ marginTop: "10px", display:'contents' }}>
              {cuss?.map((item, index) => {
                
                  return (
                    <>
                      <p
                        key={index}
                        style={{
                          margin: 15,
                          padding: 5,
                          backgroundColor: "white",
                          borderRadius: "10px",
                          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          display: "inline-flex"
                        }}
                      >
                        <Checkbox
                          type="checkbox"
                          style={{wordBreak:'break-word'}}
                          id={item.id}
                          onChange={(e) => {
                            e.target.checked ? setDeleteId(e.target.id):setDeleteId(undefined);
                            setEdit(!edit);
                            setEditWord(e.target.value);
                          }}
                          value={item.word}
                          checked={item.id === deleteId ? true : false}
                        >
                          {item.word}
                        </Checkbox>
                      </p>
                    </>
                  );
              })}
            </div>
        </Col>

        </div>
      </Row>
              </div> 
        )
}

      
      <Row>
        <div>
          <Modal
            title="Add Cuss Words"
            visible={saveModalVisible}
            onOk={handleSaveOk}
            onCancel={handleSaveCancel}
            footer={[
              <Button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={addNewCussWord}
              >
                SAVE
              </Button>,
            ]}
          >
            <Input size="large" value={newWord} onChange={handleNewWord} />
          </Modal>
          <Modal
            title="Edit Cuss Words"
            visible={editModalVisible}
            onOk={handleEditOk}
            onCancel={handleEditCancel}
            footer={[
              <Button
                style={{ backgroundColor: "green", color: "white" }}
                onClick={editCussWord}
              >
                SAVE
              </Button>,
            ]}
          >
            <Input
              size="large"
              value={editWord}
              onChange={(e) => setEditWord(e.target.value)}
            />
          </Modal>
          <Modal
            visible={deleteModalVisible}
            onOk={handleDeleteOk}
            onCancel={handleDeleteCancel}
            footer={[
              <Button
                style={{ backgroundColor: "white", color: "gray" }}
                onClick={handleDeleteCancel}
              >
                No
              </Button>,

              <Button
                style={{ backgroundColor: "Red", color: "white" }}
                onClick={deleteCussWord}
              >
                Yes
              </Button>,
            ]}
          >
            <div style={{ color: "red" }}>
              Are you sure you want to Delete this word?
            </div>
          </Modal>
          <Modal title="Cuss words feedbacks"  visible={cussModal} bodyStyle={{ overflowY: "scroll",height:'500px ' }} width={1200} onCancel={()=>setCussModal(false)} footer={[ <></>]}>
           <div>
            {cussFeedbacks.map((u)=>(
              <Card
              style={{ marginBottom: 15 }}
              className="dashboard-card-analytics"
            >
              <FeedbackCard item={u}/>
              </Card>
            ))}
           </div>
          </Modal>
        </div>
      </Row>
    </div>
  );
};
export default Cusswords;
