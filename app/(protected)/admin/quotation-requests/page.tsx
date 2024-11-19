"use client";

import React, { useEffect, useState } from "react";

import {
  ArrowUpOutlined,
  DownCircleFilled,
  EditFilled,
  FilterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
} from "antd";

import DataTable from "@/app/components/DataTable";
import { getFormattedDate } from "@/app/helpers/DateHelper";

import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchQuotationRequests } from "@/lib/state/quotationRequests/quotationRequests.slice";

import PageHeader from "../../../components/PageHeader";

interface IQuotationRequest {
  _id?: string;
  country: string;
  quotation_number: string;
  date_of_flight: string;
  From: number;
  To: string;
  number_of_quotes: string;
  customer: string;
  dateOfDeparture: string;
  status: string;
}

const Quotations = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { quotationRequests, isFetchingQuotationRequests } = useAppSelector(
    (state) => state.quotationsRequests
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const customColumns: TableColumnsType<IQuotationRequest> = [
    {
      title: "Date of Departure",
      dataIndex: "dateOfDeparture",
      key: "dateOfDeparture",
      render: (_, record) => <p>{getFormattedDate(record.dateOfDeparture)}</p>,
    },
  ];

  useEffect(() => {
    dispatch(fetchQuotationRequests());
    return () => {};
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quotation Requests"
        subtitle="Get an overview of all the quotation requests here"
      />
      <Divider />
      <DataTable
        customColumns={customColumns}
        hiddenColumns={["dateOfDeparture"]}
        title="Quotation Requests"
        data={quotationRequests}
        canCreate={false}
        canEdit={false}
      />
    </div>
  );
};

export default Quotations;
