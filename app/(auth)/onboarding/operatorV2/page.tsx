"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  Flex,
  Row,
  Steps,
  Typography,
  message,
  theme,
} from "antd";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";
import UnauthenticatedLayout from "@/app/(layouts)/UnauthenticatedLayout";
import CertificationsSection from "@/app/components/OperatorProfileSections/CertificationsSection";
import CompanyDetailsSection from "@/app/components/OperatorProfileSections/CompanyDetailsSection";
import TermsAndConditionsSection from "@/app/components/OperatorProfileSections/TermsAndConditionsSection";
import UserDetailsSection from "@/app/components/OperatorProfileSections/UserDetailsSection";

import { useAppSelector } from "@/lib/state/hooks";

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

const CompanyDetails = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const skip = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    }
  };

  const steps = [
    {
      title: "User Details",
      content: <UserDetailsSection noButton={true} />,
    },
    {
      title: "Company Details",
      content: <CompanyDetailsSection />,
    },
    {
      title: "Certifications",
      content: <CertificationsSection />,
    },
    {
      title: "Terms and Conditions",
      content: <TermsAndConditionsSection />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    width: "100%",
    maxHeight: 530,
    overflowY: "scroll",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 24,
    flexGrow: 3,
  };

  const buttonStyle: React.CSSProperties = {
    width: 100,
    height: 45,
    margin: "0 8px",
  };

  const clearButtonStyle: React.CSSProperties = {
    width: 100,
    height: 45,
    margin: "0 8px",
    border: `1px solid ${token.colorBorder}`,
    backgroundColor: "transparent",
    color: token.colorText,
  };

  const previousButtonStyle: React.CSSProperties = {
    width: 100,
    height: 45,
    margin: "0 8px",
    border: `1px solid ${token.colorBorder}`,
    backgroundColor: "#E4DAD0",
    color: token.colorText,
  };

  return (
    <UnauthenticatedLayout>
      <Row className="h-full">
        <Col
          span={15}
          style={{ backgroundColor: themeColors.background.login }}
        >
          <div
            className="flex flex-col items-start px-24 py-8"
            style={{ minHeight: "65vh" }}
          >
            <Link href={eRoutes.homePage}>
              <AppLogo />
            </Link>
            <Flex vertical style={{ width: "100%" }}>
              <Steps current={current} items={items} />
              <div style={contentStyle}>{steps[current].content}</div>
              <div style={{ marginTop: 24 }}>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    style={buttonStyle}
                    onClick={() => next()}
                  >
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    style={buttonStyle}
                    onClick={() => {
                      message.success("Processing complete!");
                      router.push(eRoutes.operatorDashboard); // Navigate to /operator/dashboard
                    }}
                  >
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button style={previousButtonStyle} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button style={clearButtonStyle} onClick={() => skip()}>
                    Skip
                  </Button>
                )}
              </div>
            </Flex>
          </div>
        </Col>
        <Col span={9} className='bg-[url("/images/bg1.png")] bg-cover' />
      </Row>
    </UnauthenticatedLayout>
  );
};

export default CompanyDetails;
