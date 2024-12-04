"use client";

import { useEffect, useState } from "react";

import { Divider, TableColumnsType } from "antd";
import dayjs from "dayjs";

import DataTable from "@/app/components/DataTable";
import QuotationRequestDrawer from "@/app/components/Drawers/QuotationRequestDrawer";

import { filterAssets } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  findByCountry,
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
    dispatch(findByCountry({ country: currentOperator?.country }));
    if (authenticatedUser && authenticatedUser.operatorId) {
      dispatch(filterAssets(authenticatedUser.operatorId));
    }
    return () => {};
  }, [dispatch, authenticatedUser, currentOperator]);

  const customColumns: TableColumnsType<IQuotationRequest> = [
    {
      title: "Number of Trip Legs",
      dataIndex: "trip",
      render: (trip) => <p>{trip.length} Legs</p>,
    },
    {
      title: "Leg 1 Departure Date",
      dataIndex: "trip",
      render: (trip) => (
        <p>{dayjs(trip[0].dateOfDeparture).format("DD MMM YYYY")}</p>
      ),
    },
    {
      title: "Number of Passengers",
      dataIndex: "numberOfPassengers",
      render: (value) => <p>{value.total} Passengers</p>,
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
        onRowClick={(record) => {
          dispatch(selectRecord(record));
          dispatch(filter({ quotationRequestId: record._id }));
          setShowDrawer(true);
        }}
        hiddenColumns={[
          "auditFields",
          "customer",
          "customerId",
          "dateOfDeparture",
          "trip",
          "numberOfPassengers",
        ]}
      />
      <QuotationRequestDrawer open={showDrawer} setOpen={setShowDrawer} />
    </div>
  );
};

export default QuotationRequestsPage;
