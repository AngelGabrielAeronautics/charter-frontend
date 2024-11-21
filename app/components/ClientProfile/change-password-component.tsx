"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Flex,
  Form,
  Input,
  List,
  Popover,
  Row,
  Typography,
  notification,
} from "antd";

import { eRoutes } from "@/app/(config)/routes";
import { PageHeader } from "@/app/components";

import { updatePassword } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const { Text } = Typography;

const ClientChangePassword = () => {
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);
  const [passwordRequirementsStatus, setPasswordRequirementsStatus] = useState({
    minLength: false,
    containsNumber: false,
    containsSpecialChar: false,
    containsUppercase: false,
    containsLowercase: false,
  });

  const { loading, error, success } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleUpdatePassword = (values: any) => {
    const { currentPassword, newPassword } = values;

    const payload = { currentPassword, newPassword };

    dispatch(updatePassword(payload));
  };

  const checkPasswordStrength = (password: string) => {
    const minLength = password.length >= 8;
    const containsUppercase = /[A-Z]/.test(password);
    const containsLowercase = /[a-z]/.test(password);
    const containsNumber = /[0-9]/.test(password);
    const containsSpecialChar = /[!@#$%^&*]/.test(password);

    setPasswordRequirementsStatus({
      minLength,
      containsUppercase,
      containsLowercase,
      containsNumber,
      containsSpecialChar,
    });

    if (
      minLength &&
      containsUppercase &&
      containsLowercase &&
      containsNumber &&
      containsSpecialChar
    )
      return "Strong";
    if (
      minLength &&
      (containsUppercase || containsLowercase) &&
      (containsNumber || containsSpecialChar)
    )
      return "Medium";
    return "Weak";
  };

  const passwordValidationRules = [
    { required: true, message: "Please input your new password!" },
    {
      validator: (_: any, value: any) => {
        if (!value) {
          return Promise.reject("Password is required.");
        }
        if (value.length < 8) {
          return Promise.reject("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(value)) {
          return Promise.reject(
            "Password must include at least one uppercase letter."
          );
        }
        if (!/[a-z]/.test(value)) {
          return Promise.reject(
            "Password must include at least one lowercase letter."
          );
        }
        if (!/[0-9]/.test(value)) {
          return Promise.reject("Password must include at least one number.");
        }
        if (!/[!@#$%^&*]/.test(value)) {
          return Promise.reject(
            "Password must include at least one special character (!@#$%^&*)."
          );
        }
        return Promise.resolve();
      },
    },
  ];

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(password ? checkPasswordStrength(password) : null);
  };

  useEffect(() => {
    if (success.updatePassword && !loading.updatePassword) {
      notification.success({ message: "Password updated successfully" });
      form.resetFields();
      setPasswordStrength(null);
      router.replace(eRoutes.clientFlights);
    }

    if (error.updatePassword) {
      notification.error({ message: error.updatePassword });
    }
  }, [
    loading.updatePassword,
    success.updatePassword,
    error.updatePassword,
    router,
  ]);

  return (
    <div>
      <PageHeader
        title="Update Password"
        subtitle="Set a new password for your account"
        actions={[
          <Popover
            placement="left"
            content={
              <div>
                <h5>What is a Strong Password?</h5>
                <p>
                  A strong password helps protect your account from unauthorized
                  access
                </p>
                <p>To create a secure password, follow these guidelines:</p>
                <Divider />
                <h5>Guidelines</h5>
                <List
                  size="small"
                  dataSource={[
                    "Use at least 8 characters.",
                    "Include uppercase and lowercase letters (A-Z, a-z).",
                    "Include at least one number (0-9).",
                    "Include at least one special character (!@#$%^&*, etc.).",
                    "Avoid using common passwords like '123456' or 'password'.",
                    "Do not use personal information such as your name or birthday.",
                    "Create unique passwords for each account.",
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: "8px 0" }} />
                <p>
                  <b>Examples of Strong Passwords:</b>
                </p>
                <List
                  size="small"
                  dataSource={[
                    "R3dP@nda!42",
                    "MysTr0nG&SecuR3!",
                    "P@ssw0rd2023#",
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text code>{item}</Text>
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: "8px 0" }} />
                <h5>Pro Tips:</h5>
                <p>
                  Use a password manager to securely store and generate strong
                  passwords.
                  <br />
                  Avoid reusing passwords across multiple accounts, and update
                  your passwords regularly.
                </p>
              </div>
            }
            arrow={false}
          >
            <p className="flex cursor-pointer gap-2 font-bold">
              <QuestionCircleOutlined /> What is a strong password?
            </p>
          </Popover>,
        ]}
      />
      <Divider />
      <Row className="" style={{ borderRadius: 16, maxWidth: "50vw" }}>
        <Form
          form={form}
          onFinish={handleUpdatePassword}
          layout="vertical"
          style={{ width: "35%" }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please input your current password!",
              },
            ]}
          >
            <Input.Password
              size="large"
              className="custom-field-input"
              placeholder="Current Password"
              autoComplete="current-password"
              allowClear
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {passwordStrength && (
            <Alert
              showIcon
              type={
                passwordStrength === "Strong"
                  ? "success"
                  : passwordStrength === "Medium"
                    ? "warning"
                    : "error"
              }
              message={`Password Strength: ${passwordStrength}`}
              style={{ margin: "0 0 1rem 0" }}
            />
          )}

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={passwordValidationRules}
          >
            <Input.Password
              size="large"
              className="custom-field-input"
              placeholder="New Password"
              autoComplete="new-password"
              allowClear
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
              onChange={onPasswordChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") !== value) {
                    return Promise.reject(
                      "The two passwords that you enter must be identical"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              className="custom-field-input"
              placeholder="Confirm Password"
              autoComplete="new-password"
              prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Flex gap={16}>
            <Button
              style={{ width: "8rem" }}
              type="primary"
              htmlType="submit"
              disabled={
                loading.updatePassword ||
                Object.values(passwordRequirementsStatus).includes(false)
              }
            >
              SAVE CHANGES
            </Button>
            <Button
              style={{ width: "8rem" }}
              type="default"
              onClick={() => {
                form.resetFields();
              }}
            >
              CANCEL
            </Button>
          </Flex>
        </Form>
      </Row>
    </div>
  );
};

export default ClientChangePassword;
