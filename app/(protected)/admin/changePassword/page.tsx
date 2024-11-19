"use client";

import { useState } from "react";

import { UserOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Row, message } from "antd";

import { PageHeader } from "@/app/components";

import { updatePassword } from "@/lib/state/auth/auth.slice";
import { useAppDispatch } from "@/lib/state/hooks";

const formItemStyle = {};
const inputStyle = {};

const ChangePasswordComponent = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPasswordReset: "",
  });
  const dispatch = useAppDispatch();
  const handleUpdatePassword = () => {
    if (formData.confirmPasswordReset === formData.password) {
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.password,
      };
      dispatch(updatePassword(payload));
    } else {
      message.error("passwords do not match");
    }
  };

  return (
    <div>
      <PageHeader title="Update Password" />
      <Row
        className="p-2"
        style={{ background: "#EBE5DF", borderRadius: 16, maxWidth: "50vw" }}
      >
        <Form layout="vertical" style={{ width: "35%" }}>
          <Form.Item style={formItemStyle} label="Current Password">
            <Input
              size="large"
              type="password"
              className="custom-field-input"
              placeholder="Current Password"
              autoComplete=""
              allowClear
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              // defaultValue={authenticatedUser?.firstNames}

              style={inputStyle}
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="New Password">
            <Input
              size="large"
              type="password"
              className="custom-field-input"
              placeholder="New Password"
              autoComplete=""
              allowClear
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              // defaultValue={authenticatedUser?.firstNames}

              style={inputStyle}
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
            />
          </Form.Item>
          <Form.Item style={formItemStyle} label="Confirm Password">
            <Input
              size="large"
              type="password"
              className="custom-field-input"
              placeholder="Confirm Password"
              autoComplete=""
              // defaultValue={authenticatedUser?.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPasswordReset: e.target.value,
                })
              }
              style={inputStyle}
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
            />
          </Form.Item>

          <Flex gap={16}>
            <Button style={{ width: "8rem" }} type="primary">
              SAVE CHANGES
            </Button>
            <Button
              style={{ width: "8rem" }}
              type="primary"
              danger
              onClick={handleUpdatePassword}
            >
              Change Password
            </Button>
          </Flex>
        </Form>
      </Row>
    </div>
  );
};

export default ChangePasswordComponent;
