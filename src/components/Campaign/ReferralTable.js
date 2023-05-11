import { Table } from "antd";
import React from "react";

function ReferralTable({
  referrals,
  referralNameCallBack,
  referralAvatarCallBack,
  userListReferredCallBack,
  coinsEarnedCallBack,
  usersJoinedCallBack,
}) {
  const columns = [
    {
      title: "From",
      dataIndex: ["from", "fullName"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
    {
      title: "Coins Earned",
      dataIndex: ["from", "referralBalance"],
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
    {
      title: "Users Joined",
      dataIndex: "referCount",
      render: (e) => {
        return (
          <div className="row-space-bw">
            <div>{e}</div>
          </div>
        );
      },
    },
    {
      title: "Latest Referral Time",
      dataIndex: "createdAt",
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
    <div>
      <Table
        onRow={(record) => {
          return {
            onClick: (event) => {
              referralNameCallBack(record?.from?.fullName);
              referralAvatarCallBack(record?.from?.avatar);
              userListReferredCallBack(record?.to);
              coinsEarnedCallBack(record?.from?.referralBalance);
              usersJoinedCallBack(record?.referCount);
            },
          };
        }}
        columns={columns}
        dataSource={referrals}
        style={{
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export default ReferralTable;
