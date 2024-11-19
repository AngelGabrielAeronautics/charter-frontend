"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Modal,
  Result,
  Row,
  Skeleton,
  Spin,
} from "antd";
import { IoAirplane } from "react-icons/io5";
import short from "short-uuid";

import { eRoutes } from "@/app/(config)/routes";
import { PageHeader, SearchBox } from "@/app/components";
import ClientAppBar from "@/app/components/ClientAppBar";
import FlightDetailsDrawer from "@/app/components/Drawers/FlightDetailsDrawer";
import { OperatorBanner } from "@/app/components/Flights/OperatorBanner";
import FlightSearch from "@/app/components/SearchBox/FlightSearch";

import {
  formatToMoneyWithCurrency,
  formatUCTtoISO,
} from "@/lib/helpers/formatters.helpers";
import { IQuotationRequest } from "@/lib/models/IQuotationRequest";
import { IUser } from "@/lib/models/IUser";
import { IAirport } from "@/lib/models/airport.model";
import { IAntCardStyle } from "@/lib/models/ant-card-style.interface";
import { IFlight } from "@/lib/models/flight.model";
import {
  clearFlightSelection,
  fetchFlights,
  filterFlights,
  resetFlightCriteria,
  selectFlight,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchOperators } from "@/lib/state/operators/operators.slice";
import {
  create,
  resetActionStates,
} from "@/lib/state/quotationRequests/quotationRequests.slice";

const AgencyFlights = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    flights,
    shouldShowSearchResults,
    isFetchingFlights,
    searchFlightCriteria,
  } = useAppSelector((state) => state.flights);
  const { operators } = useAppSelector((state) => state.operators);
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { loading, success } = useAppSelector(
    (state) => state.quotationsRequests
  );

  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    dispatch(clearFlightSelection());
  };

  useEffect(() => {
    dispatch(fetchOperators());

    if (!shouldShowSearchResults) {
      dispatch(filterFlights({ departure: { $gte: new Date() } }));
    }

    return () => {};
  }, [dispatch, shouldShowSearchResults]);

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
      numberOfChildren: 0,
      numberOfInfants: 0,
      numberOfPassengers: parseInt(
        searchFlightCriteria[0].numberOfPassengers.toString()
      ),
      numberOfAdults: parseInt(
        searchFlightCriteria[0].numberOfPassengers.toString()
      ),
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
      router.push(eRoutes.agencyQuotationRequests);
      dispatch(resetActionStates());
      dispatch(resetFlightCriteria());
    }
    return () => {};
  }, [loading, success]);

  return (
    <>
      <PageHeader
        title="Flights"
        subtitle="Get an overview of all your flights here"
      />
      <br />
      <FlightSearch />
      <Divider />
      <Spin spinning={isFetchingFlights}>
        {shouldShowSearchResults && (
          <p className="mb-4 italic">
            Showing {flights.length} flight{flights.length != 1 && "s"} found.
          </p>
        )}
        <Row gutter={16}>
          {!shouldShowSearchResults && flights.length > 0 ? (
            flights.map((flight: IFlight, index: number, _array: IFlight[]) => (
              <Col span={8} key={flight._id}>
                <Card
                  key={flight._id}
                  hoverable
                  styles={styles}
                  style={{ marginBottom: "1rem", backgroundColor: "#f9efe4" }}
                  onClick={() => {
                    dispatch(selectFlight(flight));
                    setDrawerVisible(true);
                  }}
                >
                  <OperatorBanner
                    id={flight.operatorId}
                    operator={operators[0]}
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
                          <UserOutlined style={{ fontSize: "1.35rem" }} /> max{" "}
                          <span
                            style={{ fontSize: "1.25rem", fontWeight: "700" }}
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
                            style={{ fontSize: "1.25rem", fontWeight: "700" }}
                          >
                            {formatToMoneyWithCurrency(flight.pricePerSeat)}
                          </span>
                        </p>
                        <p>
                          Seat:{" "}
                          <span
                            style={{ fontSize: "1.25rem", fontWeight: "700" }}
                          >
                            {formatToMoneyWithCurrency(flight.pricePerSeat)}
                          </span>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Empty
              description="No upcoming flights"
              className="w-full"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          {shouldShowSearchResults && flights.length == 0 && (
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
                              `/login?returnUrl=${eRoutes.agencyQuotationRequests}&beforeReturn=createQuotationRequest`
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
          )}
        </Row>
      </Spin>
      <FlightDetailsDrawer visible={drawerVisible} onClose={closeDrawer} />
    </>
  );
};

export default AgencyFlights;
