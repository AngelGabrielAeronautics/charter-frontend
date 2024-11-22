"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Divider,
  Form,
  Input,
  List,
  Popover,
  Row,
  Typography,
  notification,
} from "antd";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";
import { AppLogo } from "@/app/components/CustomIcon";

import {
  resetActionStates,
  resetUserPassword,
} from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const ResetPassword = () => {
  const [form] = Form.useForm();

  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAuthenticated, authenticatedUser, loading, error, success } =
    useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && authenticatedUser) {
      if (authenticatedUser.role === "Client") {
        router.replace(eRoutes.clientFlights);
      } else if (authenticatedUser.role === "Agency") {
        router.replace(eRoutes.agencyDashboard);
      } else if (authenticatedUser.role === "Operator") {
        router.replace(eRoutes.operatorDashboard);
      } else if (authenticatedUser.role === "Administrator") {
        router.replace(eRoutes.adminDashboard);
      } else if (authenticatedUser.role === undefined) {
        router.replace(eRoutes.roleSelection);
      }
    }
    return () => {};
  }, [isAuthenticated, authenticatedUser]);

  useEffect(() => {
    if (success.updatePassword) {
      notification.success({
        message: "Password updated successfully",
      });
      router.replace(eRoutes.login);
      dispatch(resetActionStates());
    }
  }, [success.updatePassword, router, dispatch]);

  const checkPasswordStrength = (password: string) => {
    const minLength = password.length >= 8;
    const containsUppercase = /[A-Z]/.test(password);
    const containsLowercase = /[a-z]/.test(password);
    const containsNumber = /[0-9]/.test(password);
    const containsSpecialChar = /[!@#$%^&*]/.test(password);

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

  const handleResetPassword = async (values: any) => {
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      notification.error({
        message: "Invalid oobCode",
      });
    } else {
      const payload = {
        oobCode: oobCode,
        newPassword: values.newPassword,
      };

      dispatch(resetUserPassword(payload));
    }
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
              form={form}
              layout="vertical"
              name="sign-in-form"
              className="w-full self-center text-start"
              onFinish={handleResetPassword}
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h2 className="mb-2">Reset Password</h2>
              <p>
                Set a new{" "}
                <Popover
                  className="cursor-help"
                  placement="right"
                  content={
                    <div>
                      <h5>What is a Strong Password?</h5>
                      <p>
                        A strong password helps protect your account from
                        unauthorized access
                      </p>
                      <p>
                        To create a secure password, follow these guidelines:
                      </p>
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
                            <Typography.Text>{item}</Typography.Text>
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
                            <Typography.Text code>{item}</Typography.Text>
                          </List.Item>
                        )}
                      />
                      <Divider style={{ margin: "8px 0" }} />
                      <h5>Pro Tips:</h5>
                      <p>
                        Use a password manager to securely store and generate
                        strong passwords.
                        <br />
                        Avoid reusing passwords across multiple accounts, and
                        update your passwords regularly.
                      </p>
                    </div>
                  }
                  arrow={false}
                >
                  <b>
                    <i>strong</i>
                  </b>
                </Popover>{" "}
                password for your account
              </p>
              <Divider />

              {error.updatePassword && (
                <Alert
                  showIcon
                  type="error"
                  message={error.updatePassword}
                  style={{ margin: "0 0 1rem 0" }}
                />
              )}

              {passwordStrength && passwordStrength !== "Strong" && (
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
                name="newPassword"
                label="New Password"
                rules={passwordValidationRules}
              >
                <Input.Password
                  className="custom-field-input"
                  variant="filled"
                  size="large"
                  allowClear
                  placeholder="New Password"
                  prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                  onChange={onPasswordChange}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password.",
                  },
                  {
                    validator: (_, value) => {
                      if (
                        !value ||
                        value !== form.getFieldsValue().newPassword
                      ) {
                        return Promise.reject("Passwords do not match");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Password
                  className="custom-field-input"
                  variant="filled"
                  size="large"
                  allowClear
                  placeholder="Confirm Password"
                  prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Button
                className="mt-2"
                type="primary"
                block
                htmlType="submit"
                loading={loading.updatePassword}
              >
                Reset Password
              </Button>
              {error.updatePassword && (
                <Link href="/forgot-password">
                  <p className="mt-4 text-center" style={{ color: "#0c3747" }}>
                    Resend Password Reset Link
                  </p>
                </Link>
              )}
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default ResetPassword;
