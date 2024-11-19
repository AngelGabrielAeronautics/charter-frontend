"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
} from "antd";

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

  const handleSignUp = () => {
    if (email && password && firstNames && lastName) {
      const data: ISignUpPayload = { email, firstNames, lastName, password };
      dispatch(createAccount(data));
    }
  };

  const checkboxOnChange: CheckboxProps["onChange"] = (e) => {
    setRememberMe(e.target.checked);
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
              name="sign-up-form"
              className="auth-form w-full self-center text-start"
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h2 className="mb-2">Sign up</h2>
              {/* <p>Welcome! Select method to sign up</p> */}
              {/* <Flex className='mt-4' gap={16}>
								<Button icon={<GoogleIcon />} size='large' ghost style={socialButtonStyle}>
									Google
								</Button>
								<Button icon={<FacebookIcon />} size='large' ghost style={socialButtonStyle}>
									Facebook
								</Button>
							</Flex>
							<Divider>or continue with email</Divider> */}
              {hasError && (
                <Alert
                  message={errorMessage}
                  type="error"
                  showIcon
                  style={{ marginBottom: "1rem", fontWeight: 600 }}
                />
              )}
              <Flex gap={16}>
                <Form.Item style={formItemStyle} label="First Names">
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
                <Form.Item style={formItemStyle} label="Last Name">
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
              <Form.Item style={formItemStyle} label="Email Address">
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
                <Form.Item style={formItemStyle} label="Password">
                  <Input.Password
                    variant="filled"
                    size="large"
                    className="custom-field-input"
                    placeholder="Password"
                    autoComplete=""
                    value={password}
                    style={inputStyle}
                    onChange={(event) => setPassword(event.target.value)}
                    prefix={<LockOutlined style={{ marginRight: ".5rem" }} />}
                  />
                </Form.Item>
                <Form.Item style={formItemStyle} label="Confirm Password">
                  <Input.Password
                    variant="filled"
                    size="large"
                    className="custom-field-input"
                    placeholder="Confirm Password"
                    autoComplete=""
                    onPressEnter={handleSignUp}
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
                <Button type="primary" block onClick={handleSignUp}>
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
