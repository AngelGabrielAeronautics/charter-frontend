"use client";

import React, { useState } from "react";

import {
  ArrowUpOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Divider, Input, Space, Table, TableProps, Tag } from "antd";

import PageHeader from "../../../components/PageHeader";

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Quotation Number",
    dataIndex: "quotation_number",
    key: "quotation_number",
  },
  {
    title: "Date of Flight",
    dataIndex: "date_of_flight",
    key: "date_of_flight",
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "No. of issued Quotes",
    dataIndex: "number_of_issued_quotes",
    key: "number_of_issued_quotes",
  },
  {
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>
          <DeleteOutlined color="red" />
        </a>
        <a>
          <EyeOutlined />
        </a>
      </Space>
    ),
  },
];

interface DataType {
  key: string;
  country: string;
  quotation_number: string;
  date_of_flight: string;
  from: string;
  to: string;
  number_of_issued_quotes: number;
  customer: string;
  status: string;
}

const dummyData: DataType[] = [
  {
    key: "1",
    country: "United States",
    quotation_number: "QTN-001",
    date_of_flight: "2024-09-10",
    from: "JFK",
    to: "LAX",
    number_of_issued_quotes: 5,
    customer: "John Doe",
    status: "Pending",
  },
  {
    key: "2",
    country: "Canada",
    quotation_number: "QTN-002",
    date_of_flight: "2024-09-15",
    from: "YVR",
    to: "YYZ",
    number_of_issued_quotes: 3,
    customer: "Jane Smith",
    status: "Confirmed",
  },
];

interface IProps {}
const Quotations = ({}: IProps) => {
  const [tableData, setTableData] = useState(dummyData);
  return (
    <>
      <PageHeader
        title="Quotations"
        subtitle="Get an overview of all the quotations here"
      />
      <Divider />
      {/* filters */}
      <div className="mb-5 flex justify-between">
        <div>
          <Input
            placeholder="Search Assets..."
            size="large"
            prefix={<SearchOutlined />}
          />
        </div>
        <div className="space-x-2">
          <Button type="primary" icon={<FilterFilled />}>
            Filter
          </Button>
          <Button type="primary" icon={<ArrowUpOutlined />}>
            Sort By
          </Button>{" "}
        </div>
      </div>
      <Table columns={columns} dataSource={tableData} />
    </>
  );
};

export default Quotations;
