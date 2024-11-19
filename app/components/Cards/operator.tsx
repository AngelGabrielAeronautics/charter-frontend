import React from "react";

import { DownloadOutlined } from "@ant-design/icons";
import { Avatar, Rate } from "antd";

const OperatorCard = () => {
  return (
    <div
      className="flex h-1/4 space-x-2 rounded-md"
      style={{ backgroundColor: "#F1EBE4" }}
    >
      <div className="just-a-border h-full flex-1 flex-grow p-6 text-center">
        <div className="mb-2 text-sm font-medium uppercase">
          <Avatar src="" size={50} />
        </div>
        <div className="font-medium">Operator Name</div>
      </div>
      <div className="just-a-border h-full flex-1 flex-grow p-6 text-center">
        <div className="mb-2 text-sm font-medium uppercase">
          {" "}
          <Avatar src="" size={50} />
        </div>
        <div className="font-medium">Verified Operator</div>
      </div>
      <div className="just-a-border h-full flex-1 flex-grow content-center p-6 text-center">
        <div className="mb-2 text-sm font-medium uppercase">
          <Rate allowHalf defaultValue={2.5} />
        </div>
        <div className="font-medium">Customer Satisfaction</div>
      </div>
      <div className="just-a-border h-full flex-1 flex-grow p-6 text-center">
        <div className="mb-2 text-sm font-medium uppercase">
          <div className="flex items-center justify-between space-x-2 text-center">
            <p style={{ fontSize: 8 }}>Air Operating Certificate</p>
            <DownloadOutlined />
          </div>
          <hr style={{ color: "#DDD6D0", padding: 2 }} />
          <div className="flex items-center justify-between space-x-2 text-center">
            <p style={{ fontSize: 8 }}>Certificate of Insurance</p>
            <DownloadOutlined />
          </div>
          <hr style={{ color: "#DDD6D0", padding: 2 }} />
          <div className="flex items-center justify-between space-x-2 text-center">
            <p style={{ fontSize: 8 }}>Certificate of Air Worthiness</p>
            <DownloadOutlined />
          </div>
          <hr style={{ color: "#DDD6D0", padding: 2, paddingBottom: 10 }} />
          <h4>Operator Documentation</h4>
        </div>
      </div>
    </div>
  );
};

export default OperatorCard;
