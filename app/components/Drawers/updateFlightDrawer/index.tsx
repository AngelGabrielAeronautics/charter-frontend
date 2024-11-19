import React, { useEffect } from "react";

import { Button, Drawer, Space } from "antd";

import AddDeadLegForm from "@/app/(protected)/operator/flights/add-dead-leg/components/add-dead-leg-form";
import UpdateDeadLegForm from "@/app/(protected)/operator/flights/add-dead-leg/components/update-dead-leg-form";

import { IFlight } from "@/lib/models/flight.model";

interface CreateFlightProps {
  open: boolean;
  onClose: () => void;
  selectedFlight: IFlight;
}

const UpdateFlightDrawer: React.FC<CreateFlightProps> = ({
  open,
  onClose,
  selectedFlight,
}) => {
  useEffect(() => {
    if (open) {
    }
  }, [open]);

  const closeDrawer = () => {
    onClose();
  };

  return (
    <Drawer
      title="Update Dead Leg"
      width={800}
      closable={false}
      onClose={closeDrawer}
      open={open}
      extra={
        [
          // <Space>
          // 	<Button onClick={closeDrawer}>Cancel</Button>
          // 	<Button onClick={closeDrawer} type='primary'>
          // 		Submit
          // 	</Button>
          // </Space>,
        ]
      }
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <UpdateDeadLegForm selectedFlight={selectedFlight} onClose={onClose} />
    </Drawer>
  );
};

export default UpdateFlightDrawer;
