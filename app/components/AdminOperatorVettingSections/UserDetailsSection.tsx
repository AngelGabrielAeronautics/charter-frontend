import React, { useEffect, useState } from "react";

import type { DescriptionsProps, UploadFile, UploadProps } from "antd";
import {
  Badge,
  Button,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Upload,
} from "antd";

import { IOperator } from "@/lib/models/IOperators";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

interface IProps {
  noButton?: boolean;
  record: IOperator;
}

const CompanyDetailsSection = ({
  noButton = false,
  record: operator,
}: IProps) => {
  const [form] = Form.useForm();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Company Logo",
      children: <Image src={operator?.logo?.data} />,
    },
    {
      key: "2",
      label: "Company Name",
      children: <span>{operator?.airline}</span>,
    },
    {
      key: "3",
      label: "Company Registration",
      children: <span>{operator?.registrationNumber}</span>,
    },
    {
      key: "4",
      label: "Operator Code",
      children: <span>{operator?.operatorCode}</span>,
    },
    {
      key: "5",
      label: "Email Address",
      children: <span>{operator?.email}</span>,
    },
    {
      key: "6",
      label: "VAT Number",
      children: <span>{operator?.vatNumber}</span>,
    },
    {
      key: "7",
      label: "Phone Number",
      children: <span>{operator?.phone}</span>,
    },
    {
      key: "8",
      label: "AOC Number",
      children: <span>{operator?.aocNumber}</span>,
      span: 2,
    },
    {
      key: "9",
      label: "Street Name",
      children: <span>{operator?.address?.street}</span>,
      span: 1,
    },
    {
      key: "9",
      label: "City",
      children: <span>{operator?.address?.city}</span>,
      span: 1,
    },
    {
      key: "9",
      label: "Country",
      children: <span>{operator?.address?.country}</span>,
      span: 1,
    },
    {
      key: "10",
      label: "Bank Confirmation",
      children: (
        <span>{operator?.bankingDetails?.accountConfirmationLetter?.data}</span>
      ),
      span: 1,
    },
    {
      key: "11",
      label: "Company Docs",
      children: <span>{operator?.termsAndConditions?.data}</span>,
      span: 2,
    },
  ];

  return <Descriptions layout="vertical" bordered items={items} />;
};

export default CompanyDetailsSection;
