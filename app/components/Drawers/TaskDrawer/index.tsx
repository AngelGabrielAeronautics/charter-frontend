import React, { useEffect, useState } from "react";

import { Button, DatePicker, Drawer, Form, Input, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";

import AddDeadLegForm from "@/app/(protected)/operator/flights/add-dead-leg/components/add-dead-leg-form";
import Flights from "@/app/bookings/BookingDetails";
import Bookings from "@/app/bookings/page";
import FlightDetails from "@/app/flights/[id]/page";

import { useAppDispatch } from "@/lib/state/hooks";

import AddAssetForm from "../../Assets/AddAsset";

interface CreateTaskProps {
  open: boolean;
  onClose: () => void;
}

const CreateTaskDrawer: React.FC<CreateTaskProps> = ({ open, onClose }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  const closeDrawer = () => {
    onClose();
    setDrawerVisible(false);
  };

  return (
    <Drawer
      title="Add Task"
      width={680}
      closable={true}
      onClose={closeDrawer}
      open={open}
      extra={[
        <Space>
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button onClick={closeDrawer} type="primary">
            Submit
          </Button>
        </Space>,
      ]}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <Form layout="vertical">
        <Form.Item
          name="assignTo"
          label="Assign To"
          rules={[
            {
              required: true,
              message: "Please select a user to assign the task too.",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Assign To"
            optionFilterProp="label"
            options={[
              {
                value: "ruben naude",
                label: "Ruben Naude",
              },
              {
                value: "given somdaka",
                label: "Given Somdaka",
              },
              {
                value: "delroy granger",
                label: "Delroy Granger",
              },
            ]}
            style={{ backgroundColor: "white", borderRadius: 10 }}
          />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[
            { required: true, message: "Please select the task due date." },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          name="taskTitle"
          label="Task Title"
          rules={[{ required: true, message: "Please select the task title." }]}
        >
          <Input placeholder="Task Title" />
        </Form.Item>
        <Form.Item
          name="taskDescription"
          label="Task Description"
          rules={[
            { required: true, message: "Please select add a description." },
          ]}
        >
          <TextArea rows={6} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateTaskDrawer;
