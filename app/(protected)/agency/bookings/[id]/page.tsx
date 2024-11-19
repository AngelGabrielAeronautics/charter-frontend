"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Badge, Button, Col, Divider, Flex, Typography } from "antd";
import dayjs from "dayjs";

import AppCard from "@/app/components/AppCard";
import AppRowContainer from "@/app/components/AppRowContainer";
import InvoiceItemsTable from "@/app/components/invoices/InvoiceTable";
import { invoiceSettings } from "@/app/components/invoices/constants";
import {
  StyledFlexWrapper,
  StyledFlexWrapper1,
} from "@/app/components/invoices/index.styled";
import { downloadPdf } from "@/app/helpers/FileHelper";
import { InvoiceItemType } from "@/app/types/models/invoice";

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { IInvoice } from "@/lib/models/IInvoices";
import { IFlight } from "@/lib/models/flight.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  getInvoiceById,
  resetActionStates,
  updateInvoiceStatus,
} from "@/lib/state/invoices/invoices.slice";
import { getCustomerById } from "@/lib/state/users/users.slice";

const AgencyBookingDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { selectedInvoice, loading, success } = useAppSelector(
    (state) => state.invoices
  );
  const { selectedBooking } = useAppSelector((state) => state.bookings);
  const { selectedFlight } = useAppSelector((state) => state.flights);
  const { selectedCustomer } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (pathname) {
      const path = pathname.split("/");
      const id = path[path.length - 1];

      if (id) {
        dispatch(getInvoiceById(id));
      }
    }
    return () => {};
  }, [dispatch, pathname]);

  useEffect(() => {
    if (
      selectedBooking &&
      selectedBooking.customer &&
      selectedBooking.customer._id
    ) {
      dispatch(getCustomerById(selectedBooking.customer._id));
    }
    return () => {};
  }, [selectedBooking]);

  useEffect(() => {
    if (loading.updateRecord == false && success.updateRecord == true) {
      router.refresh();
      dispatch(resetActionStates());
    }
    return () => {};
  }, [loading, success, router]);

  const getInvoiceItems = () => {
    if (selectedBooking && selectedFlight && selectedBooking.items) {
      const flight = selectedBooking.flightId as IFlight;
      return selectedBooking.items.map((item, index) => {
        const invoiceItem: InvoiceItemType = {
          id: index + 1,
          age: 0,
          duration: {
            from: dayjs(selectedBooking.auditFields.dateCreated).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            to: dayjs(flight.departure).format("YYYY-MM-DD HH:mm:ss"),
          },
          description: `${flight.departureAirport?.airportName} to ${flight.arrivalAirport?.airportName}`,
          name: `${flight.departureAirport?.airportName} to ${flight.arrivalAirport?.airportName}`,
          quantity: {
            value: item.totalNumberOfPassengers,
            type: "seat",
          },
          unitPrice: flight.pricePerSeat,
          total: item.totalPrice,
        };
        return invoiceItem;
      });
    }
    return [];
  };

  return (
    <>
      <h3 style={{ fontWeight: 500, color: "#0b3746" }}>
        <ArrowLeftOutlined onClick={() => router.back()} /> Invoice Details
      </h3>
      <Badge.Ribbon
        text={`Invoice ${selectedInvoice?.status ?? ""}`}
        color={
          selectedInvoice?.status == "Paid"
            ? "#50c31d"
            : selectedInvoice?.status == "Cancelled"
              ? "#fc474c"
              : "#efaf30"
        }
      >
        <AppCard style={{ width: "100%", backgroundColor: "#ebe5df" }}>
          <div id="pdfdiv">
            <div style={{ padding: "40px 16px" }}>
              <AppRowContainer gutter={5}>
                <Col xs={24} md={10}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 8,
                    }}
                  >
                    <Typography.Title style={{ color: "#0b3746" }}>
                      {selectedCustomer?.displayName}
                    </Typography.Title>
                    <div style={{ marginBottom: 8 }}>
                      <div className="textColor">
                        {selectedCustomer?.address?.street}
                      </div>
                      <div className="textColor">
                        {selectedCustomer?.address?.city}
                      </div>
                      <div className="textColor">
                        {selectedCustomer?.address?.state}
                      </div>
                      <div className="textColor">
                        {selectedCustomer?.address?.country}
                      </div>
                      <div className="textColor">
                        {selectedCustomer?.address?.postalCode}
                      </div>
                    </div>
                  </div>
                </Col>
                {invoiceSettings?.general && (
                  <Col
                    xs={24}
                    md={12}
                    style={{
                      marginLeft: "auto",
                      display: "grid",
                      justifyContent: "end",
                    }}
                  >
                    {invoiceSettings?.invoicing && (
                      <div style={{ fontSize: 100, marginBottom: 8 }}>
                        {invoiceSettings.invoicing.logo && (
                          <Image
                            src={`${invoiceSettings.invoicing.logo}`}
                            alt="logo"
                            width={200}
                            height={200}
                          />
                        )}
                      </div>
                    )}
                    <div className="textColor">
                      {invoiceSettings.general.streetName}
                    </div>
                    <div className="textColor">
                      {invoiceSettings.general.state}
                    </div>
                    <div className="textColor">
                      {invoiceSettings.general.zipCode}{" "}
                    </div>
                    <div className="textColor">
                      {invoiceSettings.general.country}
                    </div>
                    <div className="textColor">
                      {invoiceSettings.general.phoneNumber}
                    </div>
                    <div className="textColor">
                      {invoiceSettings.invoicing.email}
                    </div>
                  </Col>
                )}
              </AppRowContainer>
              <Typography.Title
                level={3}
                style={{ marginBottom: 12, color: "#0b3746" }}
              >
                Invoice {selectedInvoice?.invoiceNumber}
              </Typography.Title>
              <span style={{ marginRight: 8, color: "#0b3746" }}>
                Invoice Date: {formatUCTtoISO(`${selectedInvoice?.dateIssued}`)}
              </span>
            </div>

            <InvoiceItemsTable
              items={getInvoiceItems()}
              taxTypeData={"VAT"}
              taxRateData={0}
              currency={{ currency: "USD", language: "eng" }}
            />
          </div>
          <Divider />
          <Flex justify="end" gap={24}>
            <Button onClick={() => downloadPdf()} icon={<DownloadOutlined />}>
              Download Invoice
            </Button>
            {selectedInvoice?.status == "Due" && (
              <>
                <Button
                  type="primary"
                  danger
                  onClick={() =>
                    dispatch(
                      updateInvoiceStatus({
                        id: `${selectedInvoice?._id}`,
                        status: "Cancelled",
                      })
                    )
                  }
                  icon={<CloseCircleOutlined />}
                >
                  Mark as Cancelled
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    dispatch(
                      updateInvoiceStatus({
                        id: `${selectedInvoice?._id}`,
                        status: "Paid",
                      })
                    )
                  }
                  icon={<CheckOutlined />}
                >
                  Mark as Paid
                </Button>
              </>
            )}
          </Flex>
        </AppCard>
      </Badge.Ribbon>
    </>
  );
};

export default AgencyBookingDetails;
