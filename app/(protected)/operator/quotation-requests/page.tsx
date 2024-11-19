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
  Tag,
} from "antd";
import { ColumnProps } from "antd/es/table";
import short from "short-uuid";

import DataTable from "@/app/components/DataTable";
import QuotationRequestDrawer from "@/app/components/Drawers/QuotationRequestDrawer";
import { getFormattedDate } from "@/app/helpers/DateHelper";

import {
  formatUCTtoISO,
  getTimeFromDate,
} from "@/lib/helpers/formatters.helpers";
import { IUser } from "@/lib/models/IUser";
import { IAirport } from "@/lib/models/airport.model";
import { filterAssets } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  filterQuotationRequests,
  findAll,
  selectRecord,
} from "@/lib/state/quotationRequests/quotationRequests.slice";
import { filter } from "@/lib/state/quotations/quotations.slice";

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

const QuotationRequestsPage = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator } = useAppSelector((state) => state.operators);
  const { quotationRequests } = useAppSelector(
    (state) => state.quotationsRequests
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      filterQuotationRequests({
        $or: [
          { "departureAirport.countryName": currentOperator?.country },
          { "arrivalAirport.countryName": currentOperator?.country },
        ],
      })
    );
    if (authenticatedUser && authenticatedUser.operatorId) {
      dispatch(filterAssets(authenticatedUser.operatorId));
    }
    return () => {};
  }, [dispatch, authenticatedUser, currentOperator]);

  const onRowClick = (record: IQuotationRequest) => {
    dispatch(selectRecord(record));
    dispatch(filter({ quotationRequestId: record._id }));
    setShowDrawer(true);
  };

  const customColumns: TableColumnsType<IQuotationRequest> = [
    {
      title: "Date Of Departure",
      dataIndex: "dateOfDeparture",
      render: (_, record) => <p>{getFormattedDate(record.dateOfDeparture)}</p>,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quotation Requests"
        subtitle="Get an overview of all the quotation requests here"
      />
      <Divider />
      <DataTable
        customColumns={customColumns}
        canCreate={false}
        canEdit={false}
        title="Quotation Requests"
        data={quotationRequests}
        onRowClick={onRowClick}
        hiddenColumns={["customer", "dateOfDeparture"]}
      />
      <QuotationRequestDrawer open={showDrawer} setOpen={setShowDrawer} />
    </div>
  );
};

export default QuotationRequestsPage;
