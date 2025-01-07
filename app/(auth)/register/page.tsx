"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



import { InfoCircleOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, CheckboxProps, Col, Flex, Form, Input, List, Popover, Row, Space } from "antd";
import { Rule } from "antd/es/form";



import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";



import { ISignUpPayload } from "@/lib/firebase/auth.service";
import { createAccount } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";


const GoogleIcon = () => (
  <Image
    alt="Google Logo"
    src="/images/google_logo.svg"
    width={16}
    height={16}
  />
);
const FacebookIcon = () => (
  <Image
    alt="Facebook Logo"
    src="/images/facebook_logo.svg"
    width={16}
    height={16}
  />
);
const AppLogo = () => (
  <Image
    alt="logo"
    src="/images/logo_blue.svg"
    width={100}
    height={145}
    className="mb-8"
    style={{ width: "20rem", height: "auto" }}
  />
);

const formItemStyle = {};
const socialButtonStyle = {
  width: "100%",
};

const inputStyle = { width: "100%" };

const Register = () => {
  const [rememberMe, setRememberMe] = React.useState(false);
  const [firstNames, setFirstNames] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isAuthenticated, authenticatedUser, hasError, errorMessage } =
    useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && authenticatedUser) {
      if (!authenticatedUser.role) {
        router.replace(eRoutes.roleSelection);
      } else {
        switch (authenticatedUser.role) {
          case "Client":
            router.replace(eRoutes.clientFlights);
            break;
          case "Agency":
            router.replace(eRoutes.agencyDashboard);
            break;
          case "Operator":
            router.replace(eRoutes.operatorDashboard);
            break;
          case "Administrator":
            router.replace(eRoutes.adminDashboard);
            break;
          default:
            router.replace(eRoutes.roleSelection);
            break;
        }
      }
    }
    return () => {};
  }, [isAuthenticated, authenticatedUser]);

  const handleFormSubmit = async (values: ISignUpPayload) => {
    console.log("Form values", values);
    dispatch(createAccount(values));
  };

  const checkboxOnChange: CheckboxProps["onChange"] = (e) => {
    setRememberMe(e.target.checked);
  };

  const firstNameRules: Rule[] = [{ required: true, message: "Required" }];

  const lastNameRules: Rule[] = [{ required: true, message: "Required" }];

  const emailRules: Rule[] = [
    { required: true, message: "Required" },
    { type: "email", message: "Please provide a valid email" },
  ];

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\[\]{}:;'",.<>?/`~])(?=.{8,})/;

  const passwordRules: Rule[] = [
    { required: true, message: "Required" },
    {
      pattern: passwordRegex,
      message: "Password is too weak",
    },
  ];

  const confirmPasswordRules: Rule[] = [
    { required: true, message: "Required" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Passwords do not match"));
      },
    }),
  ];

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
              onFinish={handleFormSubmit}
              layout="vertical"
              name="sign-up-form"
              className="auth-form w-full self-center text-start"
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h2 className="mb-2">Sign up</h2>
              {hasError && (
                <Alert
                  message={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginBottom: "1rem", fontWeight: 600 }}
                />
              )}
              <Flex gap={16}>
                <Form.Item
                  style={formItemStyle}
                  label="First Names"
                  name="firstNames"
                  rules={firstNameRules}
                >
                  <Input
                    variant="filled"
                    size="large"
                    type="name"
                    className="custom-field-input"
                    placeholder="First Names"
                    autoComplete=""
                    allowClear
                    value={firstNames}
                    // style={inputStyle}
                    onChange={(event) => setFirstNames(event.target.value)}
                    prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
                  />
                </Form.Item>
                <Form.Item
                  style={formItemStyle}
                  label="Last Name"
                  name="lastName"
                  rules={lastNameRules}
                >
                  <Input
                    variant="filled"
                    size="large"
                    type="name"
                    className="custom-field-input"
                    placeholder="Last Name"
                    autoComplete=""
                    value={lastName}
                    style={inputStyle}
                    onChange={(event) => setLastName(event.target.value)}
                    prefix={<UserOutlined style={{ marginRight: ".5rem" }} />}
                  />
                </Form.Item>
              </Flex>
              <Form.Item
                style={formItemStyle}
                label="Email Address"
                name="email"
                rules={emailRules}
              >
                <Input
                  variant="filled"
                  size="large"
                  type="email"
                  className="custom-field-input"
                  placeholder="Email Address"
                  autoComplete=""
                  value={email}
                  style={inputStyle}
                  onChange={(event) => setEmail(event.target.value)}
                  prefix={<MailOutlined style={{ marginRight: ".5rem" }} />}
                />
              </Form.Item>
              <Flex gap={16}>
                <Form.Item
                  name="password"
                  style={formItemStyle}
                  label={
                    <Popover
                      placement="right"
                      content={
                        <List
                          className="w-[360px]"
                          dataSource={[
                            {
                              id: "1",
                              title:
                                "Password must be at least 8 characters long",
                              description:
                                "Password must be at least 8 characters long",
                            },
                            {
                              id: "2",
                              title:
                                "Password must contain at least one uppercase letter",
                              description:
                                "Password must contain at least one uppercase letter",
                            },
                            {
                              id: "3",
                              title:
                                "Password must contain at least one number",
                              description:
                                "Password must contain at least one number",
                            },
                            {
                              id: "4",
                              title:
                                "Password must contain at least one special character",
                              description:
                                "Password must contain at least one special character",
                            },
                          ]}
                          renderItem={(item) => (
                            <List.Item key={item.id}>
                              <List.Item.Meta description={item.description} />
                            </List.Item>
                          )}
                        />
                      }
                      title='What is a "Strong" password?'
                    >
                      Password <InfoCircleOutlined />
                    </Popover>
                  }
                  rules={passwordRules}
                >
                  <Input.Password
                    variant="filled"
                    size="large"
                    className="custom-field-input"
                    placeholder="Password"
                    value={password}
                    style={inputStyle}
                    onChange={(event) => setPassword(event.target.value)}
                    prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  style={formItemStyle}
                  label="Confirm Password"
                  rules={confirmPasswordRules}
                >
                  <Input.Password
                    variant="filled"
                    size="large"
                    className="custom-field-input"
                    placeholder="Confirm Password"
                    onPressEnter={() => form.submit()}
                    value={confirmPassword}
                    style={inputStyle}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                  />
                </Form.Item>
              </Flex>
              <Flex justify="space-between" align="center" className="mb-2">
                <Checkbox checked={rememberMe} onChange={checkboxOnChange}>
                  Remember me
                </Checkbox>
              </Flex>
              <Form.Item style={formItemStyle}>
                <Button type="primary" block htmlType="submit">
                  SIGN UP
                </Button>
              </Form.Item>
              <p>
                Already have an account? <Link href="/login"> Login</Link>
              </p>
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default Register;