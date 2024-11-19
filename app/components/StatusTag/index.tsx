import React from "react";

import { Tag } from "antd";

import booking from "../Cards/booking";
import {
  negativeStatuses,
  neutralStatuses,
  positiveStatuses,
  warningStatuses,
} from "../DataTable/utilities";

const StatusTag = ({ status }: { status: string }) => {
  return (
    <Tag
      color={
        negativeStatuses.includes(status.toLowerCase())
          ? "error"
          : positiveStatuses.includes(status.toLowerCase())
            ? "success"
            : neutralStatuses.includes(status.toLowerCase())
              ? "blue"
              : warningStatuses.includes(status.toLowerCase())
                ? "warning"
                : "default"
      }
    >
      {status}
    </Tag>
  );
};

export default StatusTag;
