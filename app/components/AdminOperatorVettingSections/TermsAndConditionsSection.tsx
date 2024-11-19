"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Descriptions } from "antd";
import form from "antd/es/form";

import { useAppSelector } from "@/lib/state/hooks";

interface IProps {}

const AdminVettingTermsAndConditionsSection = ({}: IProps) => {
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator, drawers } = useAppSelector(
    (state) => state.operators
  );

  useEffect(() => {
    if (authenticatedUser && currentOperator) {
      // Pre-populate the user details form with user data from the authenticated user
    }
  }, [authenticatedUser, currentOperator, form]);

  return (
    <Descriptions
      layout="vertical"
      bordered
      column={1}
      items={[
        {
          key: "1",
          label: "Cancellation Terms",
          children: drawers.operatorDetails.operator?.cancellationPolicy || "",
        },
        {
          key: "2",
          label: "Refund Policy",
          children: drawers.operatorDetails.operator?.refundPolicy || "",
        },
        {
          key: "3",
          label: "Terms and Conditions",
          children: (
            <>
              {drawers.operatorDetails.operator?.termsAndConditions?.data && (
                <Link
                  style={{ color: "#0c3747" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`data:application/pdf;base64,${drawers.operatorDetails.operator.termsAndConditions.data}`}
                  download={
                    drawers.operatorDetails.operator.termsAndConditions.name ||
                    "TermsAndConditions.pdf"
                  }
                >
                  {drawers.operatorDetails.operator.termsAndConditions.name ||
                    "Terms and Conditions"}
                </Link>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default AdminVettingTermsAndConditionsSection;
