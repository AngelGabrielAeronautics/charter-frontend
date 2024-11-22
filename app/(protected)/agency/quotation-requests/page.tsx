"use client";

import React, { useEffect, useState } from "react";

import {
  Divider,
  Modal,
  TableColumnsType,
} from "antd";

import DataTable from "@/app/components/DataTable";
import QuotationRequestDrawer from "@/app/components/Drawers/QuotationRequestDrawer";
import { getFormattedDate } from "@/app/helpers/DateHelper";

import { IQuotationRequestUpdateDTO } from "@/lib/models/IQuotationRequest";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  filterQuotationRequests,
  selectRecord,
  updateQuotationRequest,
} from "@/lib/state/quotationRequests/quotationRequests.slice";

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

const AgencyQuotationRequests = () => {
  const [showRecordDetails, setShowRecordDetails] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { quotationRequests, selectedQuotationRequest } = useAppSelector(
    (state) => state.quotationsRequests
  );

  useEffect(() => {
    dispatch(
      filterQuotationRequests({ "customer._id": authenticatedUser?._id })
    );
    return () => {};
  }, [dispatch, authenticatedUser?._id]);

  const handleCancelRequest = (quotationRequestId: string) => {
    const payload: IQuotationRequestUpdateDTO = { status: "Cancelled" };
    const data = { id: quotationRequestId, payload };
    Modal.confirm({
      title: "Confirm Cancel Request",
      content: "Are you sure you want to cancel this quotation request?",
      onOk: () => {
        dispatch(updateQuotationRequest(data));
      },
    });
  };

  const handleViewRequest = (quotationRequest: IQuotationRequest) => {
    dispatch(selectRecord(quotationRequest));
  };

  useEffect(() => {
    if (selectedQuotationRequest) {
      setShowRecordDetails(true);
    }
    return () => {};
  }, [selectedQuotationRequest]);

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
        subtitle="Get an overview of all your quotation requests here"
      />
      <Divider />
      <DataTable
        customColumns={customColumns}
        hiddenColumns={["dateOfDeparture"]}
        title="Quotation Requests"
        data={quotationRequests}
        canCreate={false}
        canEdit={false}
        canCancel={true}
        onRowView={handleViewRequest}
        onCancel={handleCancelRequest}
      />
      <QuotationRequestDrawer
        open={showRecordDetails}
        setOpen={(value: boolean) => setShowRecordDetails(value)}
      />
    </div>
  );
};

export default AgencyQuotationRequests;
