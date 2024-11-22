"use client";

import { Button, Flex, Form, Input, Select } from "antd";

import { useAppDispatch } from "@/lib/state/hooks";
import { update } from "@/lib/state/tickets/slice";

const PassengerListForm = ({ ticketId }: { ticketId: string }) => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const addPassengerDetails = (values: any) => {
    const data = {
      id: ticketId,
      payload: { passengerDetails: values },
    };

    dispatch(update(data));
  };

  return (
    <Form form={form} layout="vertical" onFinish={addPassengerDetails}>
      <Flex gap={16} align="center">
        <Form.Item
          className="flex-1"
          label="First Names"
          name="firstNames"
          rules={[{ required: true }]}
        >
          <Input className="custom-field-input" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="Last Name"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input className="custom-field-input" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true }]}
          className="flex-1"
        >
          <Select
            style={{
              background: "#ffffff",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <Select.Option key="Male" value="Male">
              Male
            </Select.Option>
            <Select.Option key="Female" value="Female">
              Female
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="flex-1"
          label="Passport Number"
          name="passportNumber"
          rules={[{ required: true }]}
        >
          <Input className="custom-field-input" style={{ width: "100%" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="mb-2 w-[8.75rem]">
          Generate Ticket
        </Button>
      </Flex>
    </Form>
  );
};

export default PassengerListForm;
