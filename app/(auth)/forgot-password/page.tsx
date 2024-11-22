"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MailOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row } from "antd";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";
import { AppLogo } from "@/app/components/CustomIcon";

import {
  resetRedirect,
  sendFirebaseResetPasswordLink,
} from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const router = useRouter();
  const {
    isAuthenticated,
    authenticatedUser,
    hasError,
    errorMessage,
    redirect,
  } = useAppSelector((state) => state.auth);

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
    if (hasError) {
      const message =
        errorMessage.length > 0
          ? errorMessage
          : "Failed to send password reset email";
      setMessage(message);
    }
  }, [hasError, errorMessage]);

  useEffect(() => {
    if (redirect.shouldRedirect == true && redirect.redirectPath) {
      router.replace(redirect.redirectPath);
      dispatch(resetRedirect());
    }
    return () => {};
  }, [redirect, router]);

  const handleSendPasswordResetLink = async () => {
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    } else {
      dispatch(sendFirebaseResetPasswordLink(email));
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
              layout="vertical"
              name="sign-in-form"
              className="w-full self-center text-start"
              onFinish={handleSendPasswordResetLink}
            >
              <Link href={eRoutes.homePage}>
                <AppLogo />
              </Link>
              <h2 className="mb-2">Send Reset Password Link</h2>
              <p>
                Enter the email associated with your account below and we will
                send a password reset link to the specified email address.
              </p>
              <Divider />
              <Form.Item label="Email Address">
                <Input
                  className="custom-field-input"
                  variant="filled"
                  size="large"
                  type="email"
                  allowClear
                  value={email}
                  placeholder="Email Address"
                  onChange={(event) => setEmail(event.target.value)}
                  prefix={<MailOutlined style={{ marginRight: ".5rem" }} />}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  loading={loading}
                >
                  Send Password Reset Link
                </Button>
              </Form.Item>
              {message && <p>{message}</p>}
            </Form>
          </div>
        </Col>
        <Col span={15} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default ForgotPassword;
