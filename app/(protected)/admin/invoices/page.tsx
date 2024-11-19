"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Divider } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";

import { IInvoice } from "@/lib/models/IInvoices";
import { fetchFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchInvoices } from "@/lib/state/invoices/invoices.slice";

const AdminInvoices = () => {
  const { invoices } = useAppSelector((state) => state.invoices);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchInvoices());
    return () => {};
  }, []);

  const onRowClick = (invoice: IInvoice) => {
    router.push(`/admin/invoices/${invoice._id}`);
  };

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Get an overview of all the invoices here"
      />
      <Divider />
      <DataTable
        title="Invoices"
        data={invoices}
        canCreate={false}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default AdminInvoices;
