"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Modal } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import BookingDetailsDrawer from "@/app/components/Drawers/BookingDetailsDrawer";

import { IBooking } from "@/lib/models";
import { IInvoice } from "@/lib/models/IInvoices";
import {
  filterBookings,
  selectBooking,
  update,
} from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const AgencyBookings = () => {
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);

  const { bookings, selectedBooking } = useAppSelector(
    (state) => state.bookings
  );
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(filterBookings({ "customer._id": authenticatedUser?._id }));
    return () => {};
  }, [dispatch, authenticatedUser?._id]);

  const onRowView = (booking: IBooking) => {
    dispatch(selectBooking(booking));
    setShowDetailsDrawer(true);
  };

  const viewInvoice = (invoice: IInvoice) => {
    router.push(`/agency/invoices/${invoice._id}`);
  };

  const columns = [
    {
      title: "Invoice",
      dataIndex: "invoiceId",
      render: (invoice: IInvoice) => (
        <Button type="link" onClick={() => viewInvoice(invoice)}>
          <EyeOutlined /> View Invoice
        </Button>
      ),
    },
  ];

  const handleCancelBooking = (bookingId: string) => {
    const payload = { id: bookingId, payload: { status: "Cancelled" } };
    Modal.confirm({
      title: "Confirm Cancel Booking",
      content: "Are you sure you want to cancel this booking?",
      onOk: () => {
        dispatch(update(payload));
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Get an overview of all your bookings here"
      />
      <Divider />
      <DataTable
        title="Bookings"
        data={bookings}
        canCreate={false}
        canEdit={false}
        canCancel={true}
        onCancel={handleCancelBooking}
        onRowView={onRowView}
        hiddenColumns={["platformFee", "invoiceId", "customer", "currency"]}
        customColumns={columns}
      />
      {selectedBooking && (
        <BookingDetailsDrawer
          visible={showDetailsDrawer}
          onClose={() => {
            setShowDetailsDrawer(false);
            dispatch(selectBooking(undefined));
          }}
        />
      )}
    </div>
  );
};

export default AgencyBookings;
