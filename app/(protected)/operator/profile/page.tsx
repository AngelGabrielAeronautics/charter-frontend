"use client";

import React, { useEffect, useState } from "react";

import { Col, Divider, Progress, Row, Tabs } from "antd";

import themeColors from "@/app/(config)/colors";
import CertificationsSection from "@/app/components/OperatorProfileSections/CertificationsSection";
import CompanyDetailsSection from "@/app/components/OperatorProfileSections/CompanyDetailsSection";
import TermsAndConditionsSection from "@/app/components/OperatorProfileSections/TermsAndConditionsSection";
import UserDetailsSection from "@/app/components/OperatorProfileSections/UserDetailsSection";
import PageHeader from "@/app/components/PageHeader";

import { useAppSelector } from "@/lib/state/hooks";

const OperatorProfilePage = () => {
  const { currentOperator } = useAppSelector((state) => state.operators);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);

  useEffect(() => {
    if (currentOperator) {
      setProfileCompletion(currentOperator.profileCompletePercentage);
    }
    return () => {};
  }, [currentOperator?.profileCompletePercentage]);

  const pageActions = [
    <Row key={1} align="middle">
      <Col>
        <Progress
          type="circle"
          percent={profileCompletion}
          size={60}
          strokeColor={
            profileCompletion === 100 ? "#4CAF50" : themeColors.light.primary
          } // Will be green if 100%, otherwise Charter's blue
        />
      </Col>
      <Col style={{ marginLeft: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <h4 style={{ margin: 1 }}>Profile Completeness: </h4>
          <p style={{ margin: 1 }}>
            {profileCompletion! < 100
              ? "Profile Incomplete"
              : "Profile Complete!"}
          </p>
        </div>
      </Col>
    </Row>,
  ];

  return (
    <div id="operator-profile" className="space-y-5">
      <PageHeader
        title="Operator Profile"
        subtitle="Edit your profile here"
        actions={pageActions}
      />
      <Divider />
      <Tabs
        type="card"
        items={[
          { label: "User Details", key: "1", children: <UserDetailsSection /> },
          {
            label: "Company Details",
            key: "2",
            children: <CompanyDetailsSection />,
          },
          {
            label: "Certifications",
            key: "3",
            children: <CertificationsSection />,
          },
          {
            label: "Terms and Conditions",
            key: "4",
            children: <TermsAndConditionsSection />,
          },
        ]}
      />
    </div>
  );
};

export default OperatorProfilePage;
