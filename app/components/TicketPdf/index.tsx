"use client";

import React, { useEffect } from "react";

import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";

import { downloadPdf } from "@/lib/helpers/file.helper";
import { IAsset } from "@/lib/models/IAssets";
import { ITicket } from "@/lib/models/ITicket";
import { findOne } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import PageHeader from "../PageHeader";

const TicketPDF = ({ ticket }: { ticket: ITicket }) => {
  const departureDate =
    typeof ticket?.flightId == "object" &&
    dayjs(ticket.flightId.departure).format("llll");

  const dispatch = useAppDispatch();

  const { selectedAsset } = useAppSelector((state) => state.assets);

  useEffect(() => {
    if (ticket && ticket.flightId && typeof ticket?.flightId == "object") {
      dispatch(findOne(ticket.flightId.aircraftId));
    }
    return () => {};
  }, [ticket, dispatch]);

  return (
    <>
      <PageHeader
        title=""
        actions={[
          <Button
            style={{ marginLeft: "auto", marginBottom: "1rem" }}
            type="primary"
            onClick={() => downloadPdf()}
          >
            Download PDF
          </Button>,
        ]}
      />
      <Card style={{ width: "100%", margin: "auto" }}>
        <div id="pdfdiv">
          <div style={{ padding: "40px 16px", height: "150px" }}>
            <Row gutter={5} style={{ flexDirection: "row" }}>
              <Col span={8}>
                <img src="/images/charter.png" alt="charter_logo" />
              </Col>

              <Col span={8}>
                {/* <img src="/images/logo_blue.svg" alt="charter_logo" /> */}
              </Col>

              <Col span={8}></Col>
            </Row>
          </div>

          <Row
            gutter={5}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Col span={12}></Col>
            <Col
              span={12}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  {ticket.ticketNumber}
                </Typography.Title>
                <div style={{ marginBottom: 12 }}>
                  <div>
                    Flight Number:{" "}
                    {typeof ticket.flightId == "object" &&
                      ticket.flightId.flightNumber}
                  </div>
                  <div>Ticket Number: {ticket.ticketNumber}</div>
                  <div>
                    {typeof ticket.flightId == "object" &&
                      ticket.flightId.aircraftRegistrationNumber}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={12}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: 6 }}>
                  {ticket.passengerDetails?.firstNames}{" "}
                  {ticket.passengerDetails?.lastName}
                </Typography.Title>
                {/* <Typography.Title level={5} style={{ marginBottom: 6 }}>
									{ticket.passengerDetails?.passportNumber}
								</Typography.Title> */}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 6, textAlign: "end" }}
                >
                  Boarding Pass
                </Typography.Title>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={12}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Departure
                </Typography.Title>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: "60%", marginBottom: 12 }}>
                    <p>
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.departureAirport.fullLabel}
                    </p>
                  </div>

                  <Typography.Title level={5}>
                    {typeof ticket.flightId == "object" &&
                      new Date(ticket.flightId.departure).toDateString()}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    <strong>
                      {typeof ticket.flightId == "object" &&
                        new Date(ticket.flightId.departure).toTimeString()}
                    </strong>
                  </Typography.Title>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 12, textAlign: "end" }}
                >
                  Arrival
                </Typography.Title>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: "100%", marginBottom: 12 }}>
                    <p>
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.arrivalAirport.fullLabel}
                    </p>
                  </div>
                  <Typography.Title level={5}>
                    {typeof ticket.flightId == "object" &&
                      new Date(ticket.flightId.departure).toDateString()}
                  </Typography.Title>
                  <Typography.Title level={5}>
                    <strong>
                      {typeof ticket.flightId == "object" &&
                        new Date(ticket.flightId.departure).toTimeString()}
                    </strong>
                  </Typography.Title>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={12}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Boarding
                </Typography.Title>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 12, textAlign: "end" }}
                >
                  Baggage
                </Typography.Title>
              </div>
            </Col>
          </Row>

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={6}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <strong>Meeting Area</strong>
                  <div style={{ width: "60%", marginBottom: 6 }}>
                    <p>
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.meetingArea}
                    </p>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Arrival Meeting Area</strong>
                  <div style={{ width: "60%", marginBottom: 6 }}>
                    <p>
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.arrivalMeetingArea}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              span={6}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-start",
                textAlign: "start",
              }}
            >
              <div style={{ width: "100%" }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Meeting Time</strong>
                  <div
                    style={{
                      width: "100%",
                      marginBottom: 6,
                      marginLeft: "auto",
                    }}
                  >
                    <p>
                      {typeof ticket.flightId == "object" &&
                        new Date(ticket.flightId.meetingTime).toTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              span={6}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Baggage Type</strong>
                  <div
                    style={{
                      width: "100%",
                      marginBottom: 6,
                      marginLeft: "auto",
                    }}
                  >
                    <p> Not Specified </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              span={6}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Baggage Weight</strong>
                  <div
                    style={{
                      width: "60%",
                      marginBottom: 6,
                      marginLeft: "auto",
                      textAlign: "end",
                    }}
                  >
                    <p>
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.maxLuggagePerPerson}{" "}
                      {typeof ticket.flightId == "object" &&
                        ticket.flightId.luggageWeightUnits}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={12}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Operator
                </Typography.Title>
                <div style={{ marginBottom: 12 }}>
                  <strong> Airline </strong>
                  <p>
                    {typeof ticket.flightId == "object" &&
                      ticket.flightId.airline}
                  </p>
                  {/* <strong> Airline </strong>
                    <p>{ticket.flightId.}</p> */}
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          {selectedAsset && typeof selectedAsset == "object" && (
            <div className="ml-3">
              <Descriptions
                title="Aircraft Details"
                layout="horizontal"
                items={[
                  {
                    key: "selectedAsset.manufacturer",
                    label: "Aircraft Manufacturer",
                    children: selectedAsset.manufacturer,
                  },
                  {
                    key: "selectedAsset.model",
                    label: "Aircraft Model",
                    children: selectedAsset.model,
                  },
                  {
                    key: "selectedAsset.registrationNumber",
                    label: "Aircraft Registration Number",
                    children: selectedAsset.registrationNumber,
                  },
                  {
                    key: "selectedAsset.powerPlant",
                    label: "Power Plant",
                    children: selectedAsset.powerPlant,
                  },
                  {
                    key: "selectedAsset.minimumCockpitCrew",
                    label: "Minimum Crew",
                    children: selectedAsset.minimumCockpitCrew,
                  },
                  {
                    key: "selectedAsset.minimumCockpitCrew",
                    label: "Pressurized",
                    children: selectedAsset.pressurized ? "Yes" : "No",
                  },
                  {
                    key: "selectedAsset.hasWashCloset",
                    label: "Wash Closet",
                    children: selectedAsset.hasWashCloset ? "Yes" : "No",
                  },
                  {
                    key: "selectedAsset.inflightServicePersonnel",
                    label: "Cabin Service",
                    children: selectedAsset.inflightServicePersonnel,
                  },
                  {
                    key: "selectedAsset.airConAvailable",
                    label: "Air Conditioning",
                    children: selectedAsset.airConAvailable ? "Yes" : "No",
                  },
                  {
                    key: "selectedAsset.heated",
                    label: "Heated",
                    children: selectedAsset.heated ? "Yes" : "No",
                  },
                  {
                    key: "selectedAsset.apu",
                    label: "APU",
                    children: selectedAsset.apu ? "Yes" : "No",
                  },
                ]}
              />
            </div>
          )}

          <Divider />

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col span={24}>
              <div
                style={{
                  position: "relative",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Important Information
                </Typography.Title>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Title level={5}>
                    Cancellation Terms
                  </Typography.Title>
                  <div style={{ width: "60%", marginBottom: 12 }}>
                    <p>Concellation Terms</p>
                  </div>

                  <Typography.Title level={5}>Refund Policy</Typography.Title>
                  <div style={{ width: "60%", marginBottom: 6 }}>
                    <p>Concellation Terms</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row
            gutter={5}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Col
              span={6}
              style={{
                position: "relative",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Operator Contact
                </Typography.Title>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: "60%", marginBottom: 12 }}>
                    <p>630411836</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              span={6}
              style={{
                position: "relative",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title level={4} style={{ marginBottom: 12 }}>
                  Charter Emergency
                </Typography.Title>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: "60%", marginBottom: 12 }}>
                    <p>+447797724386</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              span={6}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 12, textAlign: "end" }}
                >
                  Email Address
                </Typography.Title>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: "100%", marginBottom: 12 }}>
                    <p>info@jet.com</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              span={6}
              style={{
                padding: 12,
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                textAlign: "end",
              }}
            >
              <div style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ marginBottom: 12, textAlign: "end" }}
                >
                  WhatsApp
                </Typography.Title>

                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      width: "100%",
                      marginBottom: 12,
                      marginLeft: "auto",
                    }}
                  >
                    <p>+447797724386</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default TicketPDF;
