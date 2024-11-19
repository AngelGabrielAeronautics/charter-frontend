import React, { useEffect } from "react";

import { Button, Drawer, Space } from "antd";

import AddDeadLegForm from "@/app/(protected)/operator/flights/add-dead-leg/components/add-dead-leg-form";

interface CreateFlightProps {
  open: boolean;
  onClose: () => void;
}

const CreateFlightDrawer: React.FC<CreateFlightProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (open) {
    }
  }, [open]);

  const closeDrawer = () => {
    onClose();
  };

  return (
    <Drawer
      title="Add Dead Leg"
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
      <AddDeadLegForm />
    </Drawer>
  );
};

export default CreateFlightDrawer;
