import React, { useState } from "react";



import { InfoCircleOutlined } from "@ant-design/icons";
import { Drawer, Space, Tag } from "antd";



import { useAppSelector } from "@/lib/state/hooks";



import AdminFlightDetailsComponent from "./admin-flight-details-component";
import FlightChecklist from "@/app/(protected)/admin/flights/flight-checklist";


interface FlightDetailProps {
  visible: boolean;
  onClose: () => void;
}

const AdminFlightDetailsDrawer: React.FC<FlightDetailProps> = ({
  visible,
  onClose,
}) => {
  const { selectedFlight } = useAppSelector((state) => state.flights);
  const [checklistVisible, setChecklistVisible] = useState(false);

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
        <Space onClick={() => setChecklistVisible(true)}>
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
      {/* Inner Drawer for Checklist */}
      <Drawer
        id="flight-checklist-drawer"
        title="Flight Checklist"
        width={480}
        onClose={() => setChecklistVisible(false)} // Close checklist drawer
        open={checklistVisible}
        destroyOnClose
      >
        {selectedFlight?.checklist ? (
          <FlightChecklist checklist={selectedFlight.checklist} />
        ) : (
          <p>No checklist available for this flight.</p>
        )}
      </Drawer>
    </Drawer>
  );
};

export default AdminFlightDetailsDrawer;