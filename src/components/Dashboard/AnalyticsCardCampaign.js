import { Card, Col } from "antd";
import React from "react";

const AnalyticsCardCampaign = ({ Icon, count, title }) => {
  return (
    <Col className="mt-20 cursor-pointer" xs={24} sm={24} md={24} xl={6} xxl={6} span={6} >
      <Card className="dashboard-card-analytics">
        <div className="row-space-bw">
          <Icon style={{fontSize:'40px',color:'#1677ff'}}/>
          <div>
            <div className="count">{count}</div>
            <div className="count-title">{title}</div>
          </div>
        </div>
      </Card>
    </Col>
  );
};
export default AnalyticsCardCampaign