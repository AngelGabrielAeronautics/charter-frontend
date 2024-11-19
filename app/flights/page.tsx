"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Empty, Flex, Modal, Result, Row, Spin, notification } from "antd";
import { IoAirplane } from "react-icons/io5";
import short from "short-uuid";

import { eRoutes } from "@/app/(config)/routes";
import ClientAppBar from "@/app/components/ClientAppBar";

import { formatToMoneyWithCurrency, formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { IQuotationRequest } from "@/lib/models/IQuotationRequest";
import { IUser } from "@/lib/models/IUser";
import { IAirport } from "@/lib/models/airport.model";
import { IAntCardStyle } from "@/lib/models/ant-card-style.interface";
import { IFlight } from "@/lib/models/flight.model";
import { clearFlightSelection, filterFlights, resetFlightCriteria, selectFlight } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators, setCurrentOperator } from "@/lib/state/operators/operators.slice";
import { create, resetActionStates } from "@/lib/state/quotationRequests/quotationRequests.slice";

import FlightDetailsDrawer from "../components/Drawers/FlightDetailsDrawer";
import { OperatorBanner } from "../components/Flights/OperatorBanner";
import FlightSearch from "../components/SearchBox/FlightSearch";

const Flights = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    flights,
    shouldShowSearchResults,
    isFetchingFlights,
    searchFlightCriteria,
    searchingFlights,
  } = useAppSelector((state) => state.flights);
  const { operators } = useAppSelector((state) => state.operators);
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { loading, success, error } = useAppSelector(
    (state) => state.quotationsRequests
  );

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.role! == "Operator") {
      router.replace(eRoutes.operatorFlights);
      return;
    }
    if (authenticatedUser && authenticatedUser.role! == "Administrator") {
      router.replace(eRoutes.adminFlights);
      return;
    }
  }, [router, authenticatedUser]);

  const closeDrawer = () => {
    setDrawerVisible(false);
    dispatch(clearFlightSelection());
  };

  useEffect(() => {
    // if (flights.length > 0 && !searchingFlights) dispatch(fetchOperators());

    if (!shouldShowSearchResults && !searchingFlights) {
      dispatch(filterFlights({ departure: { $gte: new Date() } }));
    }

    return () => {};
  }, [dispatch, shouldShowSearchResults, searchingFlights]);

  const styles: IAntCardStyle = {
    body: {
      padding: 0,
    },
  };

  const clearSearch = () => {
    dispatch(resetFlightCriteria());
    dispatch(filterFlights({ departure: { $gte: new Date() } }));
  };

  const submitQuotationRequest = () => {
    const translator = short();
    const uid = translator.new();

    const payload: IQuotationRequest = {
      quotationRequestNumber: `QR-${uid}`,
      departureAirport: searchFlightCriteria[0]
        .departureAirportObject as IAirport,
      arrivalAirport: searchFlightCriteria[0].arrivalAirportObject as IAirport,
      dateOfDeparture: new Date(searchFlightCriteria[0].departureDate),
      timeOfDeparture: searchFlightCriteria[0].departureTime,
      customer: authenticatedUser as IUser,
      numberOfPassengers: parseInt(
        searchFlightCriteria[0].numberOfPassengers.toString()
      ),
      numberOfAdults: parseInt(
        searchFlightCriteria[0].numberOfPassengers.toString()
      ),
      numberOfChildren: 0,
      numberOfInfants: 0,
      petsAllowed: false,
      smokingAllowed: false,
      status: "Pending",
      auditFields: {
        createdBy: authenticatedUser?.displayName as string,
        createdById: authenticatedUser?._id as string,
        dateCreated: new Date(),
      },
    };

    dispatch(create(payload));
  };

  useEffect(() => {
    if (loading.createRecord == false && success.createRecord == true) {
      notification.success({
        message: "Quotation Request Created Successfully",
      })
      router.push('/quotation-requests')
      dispatch(resetActionStates());
      dispatch(resetFlightCriteria());
    }
    return () => {};
  }, [loading, success]);

  useEffect(() => {
    if (loading.createRecord == false && error.createRecord == true) {
      notification.error({
        message: "Quotation Request Failed",
        description: "It seems that something has gone wrong while attempting to create a quotation request that matches your search criteria. Please run the search and submit the quotation request again",
      });
      dispatch(resetActionStates());
    }
    return () => {};
  }, [loading, error]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#E9E2DB" }}>
      <ClientAppBar styles={{ padding: "1rem 2rem" }} />
      <div className="h-full min-h-full p-12">
        <h2 style={{ fontWeight: 500 }}>Flights</h2>

        <Spin spinning={isFetchingFlights}>
          <FlightSearch />
          <Divider style={{ margin: "1rem 0" }} />

          {shouldShowSearchResults &&
            !searchingFlights &&
            flights.length > 0 && (
              <p className="mb-4 italic">
                Showing {flights.length} flight{flights.length != 1 && "s"}{" "}
                found.
              </p>
            )}
          <Row gutter={16}>
            {flights.length > 0 ? (
              flights.map(
                (flight: IFlight, index: number, _array: IFlight[]) => (
                  <Col span={6} key={flight._id}>
                    <Card
                      key={flight._id}
                      hoverable
                      styles={styles}
                      style={{
                        marginBottom: "1rem",
                        backgroundColor: "#f9efe4",
                      }}
                      onClick={() => {
                        dispatch(selectFlight(flight));
                        dispatch(setCurrentOperator(flight.operator!))
                        setDrawerVisible(true);
                      }}
                    >
                      <OperatorBanner
                        id={flight.operatorId}
                        operator={flight.operator!}
                        flag={flight.arrivalAirport.flag}
                      />
                      <div style={{ padding: "0.5rem 1rem" }}>
                        <Flex justify="space-between">
                          <strong>{flight.departureAirport.shortLabel}</strong>
                          <IoAirplane />{" "}
                          <strong>{flight.arrivalAirport.shortLabel}</strong>
                        </Flex>
                        <Divider style={{ margin: "0.5rem" }} />
                        <Row>
                          <Col span={12}>
                            <p>{formatUCTtoISO(flight.departure.toString())}</p>
                            <p>
                              <UserOutlined style={{ fontSize: "1.35rem" }} />{" "}
                              max{" "}
                              <span
                                style={{
                                  fontSize: "1.25rem",
                                  fontWeight: "700",
                                }}
                              >
                                {flight.maxSeatsAvailable}
                              </span>
                            </p>
                          </Col>
                          <Col
                            span={12}
                            className="flex flex-col items-end text-end"
                          >
                            <p>
                              Flight:{" "}
                              <span
                                style={{
                                  fontSize: "1.25rem",
                                  fontWeight: "700",
                                }}
                              >
                                {formatToMoneyWithCurrency(flight.pricePerSeat)}
                              </span>
                            </p>
                            <p>
                              Seat:{" "}
                              <span
                                style={{
                                  fontSize: "1.25rem",
                                  fontWeight: "700",
                                }}
                              >
                                {formatToMoneyWithCurrency(flight.pricePerSeat)}
                              </span>
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  </Col>
                )
              )
            ) : shouldShowSearchResults && flights.length == 0 ? (
              <Flex justify="center" className="w-full">
                <Result
                  status="info"
                  title="No flights found matching your search criteria"
                  subTitle="Would you like to automatically submit a quotation request based on your search criteria?"
                  extra={[
                    <Button danger key={2} onClick={clearSearch}>
                      Clear Search
                    </Button>,
                    <Button
                      type="primary"
                      key={1}
                      onClick={() => {
                        if (authenticatedUser) {
                          submitQuotationRequest();
                        } else {
                          Modal.info({
                            title: "Unauthenticated",
                            content:
                              "You must be signed in to request a quotation",
                            okText: "Sign in now",
                            onOk: () => {
                              router.push(
                                `/login?returnUrl=${eRoutes.clientQuotationRequests}&beforeReturn=createQuotationRequest`
                              );
                            },
                          });
                        }
                      }}
                    >
                      Request a quotation
                    </Button>,
                  ]}
                />
              </Flex>
            ) : (
              <Empty
                description="No upcoming flights"
                className="w-full"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Row>
        </Spin>
      </div>
      <FlightDetailsDrawer visible={drawerVisible} onClose={closeDrawer} />
    </main>
  );
};

export default Flights;