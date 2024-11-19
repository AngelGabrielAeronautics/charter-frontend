"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { LockOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, message } from "antd";

import themeColors from "../(config)/colors";
import { eRoutes } from "../(config)/routes";
import UnauthenticatedLayout from "../(layouts)/UnauthenticatedLayout";
import { AppLogo } from "../components/CustomIcon";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      message.error("Please fill in all the fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("New passwords do not match.");
      return;
    }
    // Implement password change logic here
    // After successful change:
    router.push("/profile");
  };

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col span={9} style={{ backgroundColor: themeColors.background.login }}>
          <div
            className="flex flex-col items-center px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Form
              layout="vertical"
              name="sign-in-form"
              className="w-full self-center text-start"
              onFinish={handleChangePassword}
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h2 className="mb-2">Change Password</h2>
              <p>Enter the current and new password below.</p>
              <Divider />

              <Form.Item
                label="Current Password"
                style={{ marginBottom: "0px" }}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Current Password"
                  allowClear
                  className="mb-4"
                  variant="filled"
                  size="large"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="New Password" style={{ marginBottom: "0px" }}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="New Password"
                  allowClear
                  className="mb-4"
                  variant="filled"
                  size="large"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                style={{ marginBottom: "15px" }}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm New Password"
                  allowClear
                  className="mb-6"
                  variant="filled"
                  size="large"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>

              <Button type="primary" block onClick={handleChangePassword}>
                Change Password
              </Button>
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
}

export default ChangePassword;
