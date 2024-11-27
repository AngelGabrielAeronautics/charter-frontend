import React from "react";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Space, Tag } from "antd";

import { useAppSelector } from "@/lib/state/hooks";

import AdminFlightDetailsComponent from "./admin-flight-details-component";

interface FlightDetailProps {
  visible: boolean;
  onClose: () => void;
}

const AdminFlightDetailsDrawer: React.FC<FlightDetailProps> = ({
  visible,
  onClose,
}) => {
  const { selectedFlight } = useAppSelector((state) => state.flights);

  const isFlightReady = () => {
    if (!selectedFlight) return false;
    if (!selectedFlight.checklist) return false;

    const {
      aircraftBooked = false,
      airportHandler = false,
      allPaymentsReceived = false,
      arrivalAndIndemnity = false,
      catering = false,
      crewAccommodation = false,
      issuedAllTickets = false,
      roadShuttle = false,
      supplierPaid = false,
    } = selectedFlight?.checklist!;
    return (
      aircraftBooked &&
      airportHandler &&
      allPaymentsReceived &&
      arrivalAndIndemnity &&
      catering &&
      crewAccommodation &&
      issuedAllTickets &&
      roadShuttle &&
      supplierPaid
    );
  };

  return (
    <Drawer
      id="flight-details-drawer"
      title="Flight Details"
      width={720}
      closable={false}
      onClose={() => onClose()}
      open={visible}
      extra={[
        <Space>
          <InfoCircleOutlined size={8} />
          <small className="font-semibold">Status: </small>
          <Tag color={isFlightReady() ? "success" : "error"}>
            {isFlightReady() ? "Ready" : "Not Ready"}
          </Tag>
        </Space>,
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <AdminFlightDetailsComponent />
    </Drawer>
  );
};

export default AdminFlightDetailsDrawer;
