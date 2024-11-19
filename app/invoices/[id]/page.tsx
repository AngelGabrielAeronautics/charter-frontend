"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Divider, Row, Typography } from "antd";
import dayjs from "dayjs";

import { ClientAppBar } from "@/app/components";
import AppCard from "@/app/components/AppCard";
import AppRowContainer from "@/app/components/AppRowContainer";
import {
  StyledBankAccountWrapper,
  StyledPrimaryText2,
} from "@/app/components/invoices/AddInvoice/AddInvoice/index.styled";
import InvoiceItemsTable from "@/app/components/invoices/InvoiceTable";
import {
  StyledFlexWrapper,
  StyledFlexWrapper1,
} from "@/app/components/invoices/index.styled";
import { downloadPdf } from "@/app/helpers/FileHelper";
import {
  InvoiceItemType,
  InvoiceSettingType,
} from "@/app/types/models/invoice";

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { IFlight } from "@/lib/models/flight.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { getInvoiceById } from "@/lib/state/invoices/invoices.slice";
import { getCustomerById } from "@/lib/state/users/users.slice";

const invoiceSettings: InvoiceSettingType = {
  general: {
    agencyName: "Charter Market",
    streetName: "Street Name",
    state: "State",
    zipCode: "4739",
    country: "Jersy",
  },
  accounting: {
    bankName: "FNB",
    countryOfBank: "South Africa",
    accountNumber: "123456789",
    swiftBic: "JKJGH77",
    ifsc: "839810839283",
    accountHolder: "Charter Market Limited",
  },
  invoicing: {
    email: "ruben@levaretech.com",
    logo: "/images/charter.png",
  },
};

const InvoiceDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { selectedInvoice } = useAppSelector((state) => state.invoices);
  const { selectedCustomer } = useAppSelector((state) => state.users);
  const { selectedBooking } = useAppSelector((state) => state.bookings);
  const { selectedFlight } = useAppSelector((state) => state.flights);

  useEffect(() => {
    const path = pathname.split("/");
    const id = path[path.length - 1];
    if (id) {
      dispatch(getInvoiceById(id));
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
    <main
      className="min-h-screen bg-light-siderBackground"
      style={{ background: "#f7f2ed" }}
    >
      <ClientAppBar styles={{ padding: "1rem 2rem" }} />
      <div className="h-full min-h-full p-12">
        <h3 style={{ fontWeight: 500, color: "#0b3746" }}>
          <ArrowLeftOutlined onClick={() => router.back()} /> Invoice Details
        </h3>
        <div style={{ width: "70%", margin: "auto" }}>
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
            <AppCard style={{ backgroundColor: "#ebe5df" }}>
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
                  <StyledFlexWrapper>
                    <StyledFlexWrapper1>
                      <span style={{ marginRight: 8, color: "#0b3746" }}>
                        Invoice Date:{" "}
                        {formatUCTtoISO(`${selectedInvoice?.dateIssued}`)}
                      </span>
                    </StyledFlexWrapper1>
                  </StyledFlexWrapper>
                </div>

                <InvoiceItemsTable
                  items={getInvoiceItems()}
                  taxTypeData={"VAT"}
                  taxRateData={0}
                  currency={{ currency: "USD", language: "eng" }}
                />

                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      borderRadius: 8,
                      padding: 4,
                    }}
                  ></div>
                  <Divider />
                  <Typography.Title
                    level={3}
                    style={{ marginBottom: 16, color: "#0b3746" }}
                  >
                    Bank Accounts
                  </Typography.Title>
                  <Row>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>USD Local</h4>
                          <div style={{ color: "#0b3746" }}>
                            Metropolitan Commercial Bank
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            99 Park Ave, 10016, New York, United States
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            Account Number: 253285362894
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            ACH routing number: 026013356
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            Wire routing number: 026013356
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>USD International</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            IBAN: GB31REVO00996990377506
                          </div>
                          <div style={{ color: "#0b3746" }}>BIC: REVOGB21</div>
                          <div style={{ color: "#0b3746" }}>
                            Intermediary BIC: CHASGB2L
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>GBP Local</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            Account number: 11510455
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            Sort code: 04-29-09
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>GBP International</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            IBAN: GB31REVO00996990377506
                          </div>
                          <div style={{ color: "#0b3746" }}>BIC: REVOGB21</div>
                          <div style={{ color: "#0b3746" }}>
                            Intermediary BIC: CHASGB2L
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>Euro Local</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            IBAN: GB31REVO00996990377506
                          </div>
                          <div style={{ color: "#0b3746" }}>BIC: REVOGB21</div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>Euro International</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            IBAN: GB31REVO00996990377506
                          </div>
                          <div style={{ color: "#0b3746" }}>BIC: REVOGB21</div>
                          <div style={{ color: "#0b3746" }}>
                            Intermediary BIC: CHASDEFX
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                    <Col span={6}>
                      <StyledBankAccountWrapper>
                        <StyledPrimaryText2>
                          <h4>ZAR International</h4>
                          <div style={{ color: "#0b3746" }}>Revolut Ltd</div>
                          <div style={{ color: "#0b3746" }}>
                            7 Westferry Circus, E14 4HD, London, United Kingdom
                          </div>
                          <div style={{ color: "#0b3746" }}>
                            IBAN: GB31REVO00996990377506
                          </div>
                          <div style={{ color: "#0b3746" }}>BIC: REVOGB21</div>
                          <div style={{ color: "#0b3746" }}>
                            Intermediary BIC: BARCGB22
                          </div>
                        </StyledPrimaryText2>
                      </StyledBankAccountWrapper>
                    </Col>
                  </Row>
                </div>
              </div>
              <div>
                <Row justify={"end"}>
                  <Button
                    style={{ marginLeft: "auto" }}
                    type="primary"
                    onClick={() => downloadPdf()}
                    icon={<DownloadOutlined />}
                  >
                    Download Invoice
                  </Button>
                </Row>
              </div>
            </AppCard>
          </Badge.Ribbon>
        </div>
      </div>
    </main>
  );
};

export default InvoiceDetails;
