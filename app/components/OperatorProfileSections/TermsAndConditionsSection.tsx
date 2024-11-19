"use client";

import React from "react";

import { Button, Form, Input } from "antd";

import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { update } from "@/lib/state/operators/operators.slice";

interface IProps {}

const TermsAndConditionsSection = ({}: IProps) => {
  const [form] = Form.useForm();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator } = useAppSelector((state) => state.operators);

  const dispatch = useAppDispatch();

  const handleFinish = (values: any) => {
    const data: {
      id: string;
      payload: IOperator;
    } = {
      id: currentOperator?._id as string,
      payload: values,
    };
    dispatch(update(data));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="space-y-4"
      onFinish={handleFinish}
      initialValues={{
        cancellationPolicy: currentOperator?.cancellationPolicy,
        refundPolicy: currentOperator?.refundPolicy,
      }}
    >
      <Form.Item label="Cancellation Terms" name="cancellationPolicy">
        <Input.TextArea
          placeholder="Add your company's cancellation terms"
          autoSize={{ minRows: 4, maxRows: 10 }}
          style={{ maxHeight: "200px", overflowY: "auto" }}
        />
      </Form.Item>

      <Form.Item label="Refund Policy" name="refundPolicy">
        <Input.TextArea
          placeholder="Add your company's refund policy"
          autoSize={{ minRows: 4, maxRows: 10 }}
          style={{ maxHeight: "200px", overflowY: "auto" }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TermsAndConditionsSection;
