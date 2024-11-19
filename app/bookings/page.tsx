"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  CardProps,
  Col,
  Divider,
  Empty,
  Flex,
  Row,
  Space,
  Spin,
  Tag,
} from "antd";
import { IoAirplane } from "react-icons/io5";

import ClientAppBar from "@/app/components/ClientAppBar";

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { IBooking } from "@/lib/models/IBooking";
import { IFlight } from "@/lib/models/flight.model";
import {
  fetchBookings,
  filterBookings,
  getBookingById,
  selectBooking,
} from "@/lib/state/bookings/bookings.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators } from "@/lib/state/operators/operators.slice";
import { filter } from "@/lib/state/tickets/slice";

import { eRoutes } from "../(config)/routes";
import {
  negativeStatuses,
  neutralStatuses,
  positiveStatuses,
  warningStatuses,
} from "../components/DataTable/utilities";
import BookingDetailsDrawer from "../components/Drawers/BookingDetailsDrawer";
import { OperatorBanner } from "../components/Flights/OperatorBanner";
import StatusTag from "../components/StatusTag";

const Bookings = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { bookings, selectedBooking, isFetchingBookings } = useAppSelector(
    (state) => state.bookings
  );
  const { operators } = useAppSelector((state) => state.operators);
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.role! == "Operator") {
      router.replace(eRoutes.operatorDashboard);
      return;
    }
    if (authenticatedUser && authenticatedUser.role! == "Administrator") {
      router.replace(eRoutes.adminInvoices);
      return;
    }
  }, [router, authenticatedUser]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    if (authenticatedUser) {
      const payload = { "customer._id": authenticatedUser._id };
      dispatch(fetchOperators());
      dispatch(filterBookings(payload));
    }
    return () => {};
  }, [dispatch, authenticatedUser]);

  const cardStyle: CardProps["styles"] = {
    body: {
      padding: 0,
    },
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#E9E2DB" }}>
      <ClientAppBar styles={{ padding: "1rem 2rem" }} />
      <div className="h-full min-h-full p-12">
        <h2 style={{ fontWeight: 500 }}>Bookings</h2>
        <Spin spinning={isFetchingBookings}>
          <Divider style={{ margin: "1rem 0" }} />
          <Row gutter={16}>
            {bookings.length > 0 ? (
              bookings.map((booking: IBooking, index: number) => {
                if (typeof booking.flightId === "object") {
                  const flight = booking.flightId;
                  const flag = flight?.arrivalAirport.flag || "";
                  return (
                    <Col key={index} span={6}>
                      <Card
                        hoverable
                        styles={cardStyle}
                        style={{
                          marginBottom: "1rem",
                          backgroundColor: "#f9efe4",
                        }}
                      >
                        <OperatorBanner
                          id={
                            typeof booking.operatorId == "object"
                              ? booking.operatorId._id!
                              : booking.operatorId
                          }
                          operator={operators[0]}
                          flag={flag}
                        />
                        <div style={{ padding: "0.5rem 1rem" }}>
                          <Flex justify="space-between">
                            <strong>
                              {flight?.departureAirport.shortLabel}
                            </strong>
                            <IoAirplane />{" "}
                            <strong>{flight?.arrivalAirport.shortLabel}</strong>
                          </Flex>
                          <Divider style={{ margin: "0.5rem" }} />
                          <Row className="pb-2">
                            <Col span={12}>
                              <Space direction="vertical">
                                <p>
                                  {flight &&
                                    formatUCTtoISO(flight.departure.toString())}
                                </p>
                                <p>
                                  Booked Seats:{" "}
                                  {booking.items[0].totalNumberOfPassengers}
                                </p>
                                <StatusTag status={booking.status} />
                              </Space>
                            </Col>
                            <Col span={12}>
                              <Flex
                                vertical
                                justify="end"
                                align="end"
                                className="h-full"
                              >
                                <Button
                                  className="justify-self-end"
                                  style={{
                                    width: "10rem",
                                    marginTop: "0.25rem",
                                    backgroundColor: "#736764",
                                  }}
                                  type="primary"
                                  onClick={() => {
                                    dispatch(selectBooking(booking));
                                    dispatch(
                                      filter({ bookingId: booking._id })
                                    );
                                    showDrawer();
                                  }}
                                >
                                  Manage Booking
                                </Button>
                              </Flex>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    </Col>
                  );
                }
              })
            ) : (
              <Flex justify="center" className="w-full">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </Flex>
            )}
          </Row>
        </Spin>
      </div>
      {selectedBooking && (
        <BookingDetailsDrawer visible={drawerVisible} onClose={closeDrawer} />
      )}
    </main>
  );
};

export default Bookings;
