import React, { useEffect, useState } from "react";

import { Button, Drawer, Space } from "antd";

import FlightDetailsComponent from "./flight-details-component";

interface FlightDetailProps {
  visible: boolean;
  onClose: () => void;
}

const FlightDetailsDrawer: React.FC<FlightDetailProps> = ({
  visible,
  onClose,
}) => {
  const closeDrawer = () => {
    onClose();
  };

  return (
    <Drawer id="flight-details-drawer"
      title="Flight Details"
      width={720}
      closable={false}
      onClose={closeDrawer}
      open={visible}
      extra={[]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <FlightDetailsComponent />
    </Drawer>
  );
};

export default FlightDetailsDrawer;
