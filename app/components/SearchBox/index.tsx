"use client";

import React, { useState } from "react";

import {
  ArrowLeftOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Dropdown,
  Flex,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row,
  TimePicker,
  TimePickerProps,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { IAirport } from "@/lib/models/airport.model";
import { ISearchItem } from "@/lib/models/search.model";
import {
  addFlightCriteria,
  searchFlights,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import SearchSelect from "../SearchSelect";

dayjs.extend(customParseFormat);

const inputStyle = {
  padding: "1rem",
  backgroundColor: "#FFFFFFBF",
  width: "100%",
  color: "#42454F",
  fontSize: "1rem",
  fontWeight: "600",
  height: 60,
};
const tripActionStyle = {
  height: "50px",
  padding: "1rem",
  backgroundColor: "#0B3746BF",
  width: "100%",
  color: "#F9EFE4",
  fontSize: "1rem",
  fontWeight: "600",
};

const SearchBox = () => {
  const {
    searchingFlights,
    notify,
    searchFlightCriteria,
    shouldShowSearchResults,
  } = useAppSelector((state) => state.flights);
  const dispatch = useAppDispatch();

  const [searchItem, setSearchItem] = useState<ISearchItem>({
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    departureTime: "12:00",
    numberOfPassengers: 1,
  });

  const addTripLeg = () => {
    dispatch(addFlightCriteria(searchItem));
  };

  const addReturnTripLeg = () => {
    const returnTrip = {
      departureAirport: searchItem.arrivalAirport,
      arrivalAirport: searchItem.departureAirport,
      departureDate: searchItem.departureDate,
      departureTime: searchItem.departureTime,
      numberOfPassengers: searchItem.numberOfPassengers,
    };
    dispatch(addFlightCriteria(returnTrip));
  };

  const checksPassed = () => {
    return (
      searchFlightCriteria.length == 0 &&
      searchItem.departureAirport &&
      searchItem.departureAirport.length > 0 &&
      searchItem.arrivalAirport &&
      searchItem.arrivalAirport.length > 0 &&
      searchItem.departureDate &&
      searchItem.departureDate.length > 0
    );
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setSearchItem((prev) => ({
      ...prev,
      departureDate: dateString.toString(),
    }));
  };

  const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
    setSearchItem((prev) => ({
      ...prev,
      departureTime: timeString.toString(),
    }));
  };

  const setDepartureAirport = (airport: IAirport | undefined) => {
    setSearchItem((prev) => ({
      ...prev,
      departureAirport: airport?.fullLabel ?? "",
      departureAirportObject: airport,
    }));
  };

  const setArrivalAirport = (airport: IAirport | undefined) => {
    setSearchItem((prev) => ({
      ...prev,
      arrivalAirport: airport?.fullLabel ?? "",
      arrivalAirportObject: airport,
    }));
  };

  const handleSearch = () => {
    if (searchFlightCriteria.length == 0) {
      if (!checksPassed()) {
        Modal.error({
          title: "Bad Request",
          content: "No search criteria provided. Please fill in all fields",
        });
      } else {
        dispatch(addFlightCriteria(searchItem));
        dispatch(searchFlights([searchItem]));
      }
    } else {
      dispatch(searchFlights(searchFlightCriteria));
    }
  };

  return (
    <Form layout="inline" style={{ width: "100%", margin: "0 auto" }}>
      <Row gutter={24} style={{ width: "100%", margin: "0 1rem" }}>
        {notify.shouldNotify && (
          <Alert
            message={notify.message}
            type={notify.type}
            showIcon
            style={{ marginBottom: "1rem", fontWeight: 600 }}
          />
        )}
      </Row>
      <Row gutter={24} style={{ width: "100%", margin: "0 auto" }}>
        <Col span={19}>
          <Row gutter={2} style={{ width: "100%", margin: "0 auto" }}>
            <Col span={7}>
              <SearchSelect
                placeholder={"Departure"}
                styles={inputStyle}
                onSelect={setDepartureAirport}
                defaultValue={
                  shouldShowSearchResults
                    ? searchFlightCriteria[0].departureAirport
                    : undefined
                }
              />
            </Col>
            <Col span={7}>
              <SearchSelect
                placeholder={"Arrival"}
                styles={inputStyle}
                onSelect={setArrivalAirport}
                defaultValue={
                  shouldShowSearchResults
                    ? searchFlightCriteria[0].arrivalAirport
                    : undefined
                }
              />
            </Col>
            <Col span={4}>
              <DatePicker
                // value={searchItem.departureDate.length > 0 ? dayjs(searchItem.departureDate) : undefined}
                onChange={onDateChange}
                style={{ ...inputStyle, height: "60px" }}
                // defaultValue={
                //   dayjs(searchFlightCriteria[0].departureDate) ?? undefined
                // }
              />
            </Col>
            <Col span={3}>
              <TimePicker
                // value={searchItem.departureTime.length > 0 ? dayjs(searchItem.departureTime) : undefined}
                onChange={onTimeChange}
                defaultValue={
                  shouldShowSearchResults
                    ? dayjs(searchFlightCriteria[0].departureTime, "HH:mm")
                    : dayjs("12:00", "HH:mm")
                }
                style={{ ...inputStyle, height: "60px" }}
                defaultOpenValue={dayjs("00:00", "HH:mm")}
              />
            </Col>
            <Col span={3}>
              <Input
                type="number"
                value={searchItem.numberOfPassengers}
                onChange={(e) =>
                  setSearchItem((prev) => ({
                    ...prev,
                    numberOfPassengers: +e.target.value,
                  }))
                }
                min={1}
                suffix={<TeamOutlined />}
                placeholder="Pax"
                style={{ ...inputStyle, height: "60px" }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={5}>
          <Button
            type="primary"
            block
            onClick={handleSearch}
            loading={searchingFlights}
            style={{
              ...tripActionStyle,
              height: 60,
              fontSize: "1rem",
              textTransform: "uppercase",
            }}
          >
            Search Flights
          </Button>
        </Col>
      </Row>
      <Flex gap={4} vertical style={{ width: "100%", marginTop: 4 }}>
        {searchFlightCriteria.map(
          (tripLeg: ISearchItem, index: number, array: ISearchItem[]) => {
            // if (index == 0) return

            return <TripLeg key={index} index={index} tripLeg={tripLeg} />;
          }
        )}
      </Flex>
      {checksPassed() && (
        <Row gutter={24} style={{ width: "100%", margin: ".25rem auto" }}>
          <Col span={19}>
            <Row gutter={2} style={{ width: "100%", margin: "0 auto" }}>
              <Col span={7}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                  onClick={addReturnTripLeg}
                >
                  Fly back
                </Button>
              </Col>
              <Col span={7}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                  onClick={addTripLeg}
                >
                  Add a destination
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                >
                  Add extras
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Form>
  );
};

const TripLeg = ({
  tripLeg,
  index,
}: {
  tripLeg: ISearchItem;
  index: number;
}) => {
  const dispatch = useAppDispatch();

  const { searchFlightCriteria } = useAppSelector((state) => state.flights);

  const [searchItem, setSearchItem] = useState<ISearchItem>({
    departureAirport:
      searchFlightCriteria.length == 1
        ? searchFlightCriteria[0].arrivalAirport
        : (searchFlightCriteria[index - 1]?.arrivalAirport ?? ""),
    arrivalAirport: "",
    departureDate: "",
    departureTime: "12:00",
    numberOfPassengers: 1,
  });

  const addTripLeg = () => {
    dispatch(addFlightCriteria({ ...searchItem }));
  };

  const checksPassed = () => {
    return (
      searchItem.departureAirport &&
      searchItem.departureAirport.length > 0 &&
      searchItem.arrivalAirport &&
      searchItem.arrivalAirport.length > 0 &&
      searchItem.departureDate &&
      searchItem.departureDate.length > 0
    );
  };

  const onDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    setSearchItem((prev) => ({
      ...prev,
      departureDate: dateString.toString(),
    }));
  };

  const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
    setSearchItem((prev) => ({
      ...prev,
      departureTime: timeString.toString(),
    }));
  };

  const setDepartureAirport = (airport: IAirport | undefined) => {
    setSearchItem((prev) => ({
      ...prev,
      departureAirport: airport?.fullLabel ?? "",
    }));
  };

  const setArrivalAirport = (airport: IAirport | undefined) => {
    setSearchItem((prev) => ({
      ...prev,
      arrivalAirport: airport?.fullLabel ?? "",
    }));
  };

  return (
    <>
      <Row gutter={24} style={{ width: "100%", margin: "0 auto" }}>
        <Col span={19}>
          <Row gutter={2} style={{ width: "100%" }}>
            <Col span={7}>
              <SearchSelect
                placeholder={"Departure"}
                defaultValue={searchItem.departureAirport ?? undefined}
                styles={inputStyle}
                onSelect={setDepartureAirport}
              />
            </Col>
            <Col span={7}>
              <SearchSelect
                placeholder={"Arrival"}
                styles={inputStyle}
                onSelect={setArrivalAirport}
                defaultValue={searchItem.arrivalAirport ?? undefined}
              />
            </Col>
            <Col span={4}>
              <DatePicker
                // value={searchItem.departureDate.length > 0 ? dayjs(searchItem.departureDate) : undefined}
                // minDate={searchFlightCriteria.length == 1 ? dayjs(searchFlightCriteria[0].departureDate) : dayjs(searchFlightCriteria[0].departureDate)}
                onChange={onDateChange}
                style={{ ...inputStyle, height: "60px" }}
              />
            </Col>
            <Col span={3}>
              <TimePicker
                // value={searchItem.departureTime.length > 0 ? dayjs(searchItem.departureTime) : undefined}
                // minDate={searchFlightCriteria.length == 1 ? dayjs(searchFlightCriteria[0].departureDate) : dayjs(searchFlightCriteria[0].departureDate)}
                onChange={onTimeChange}
                defaultValue={dayjs("12:00", "HH:mm")}
                style={{ ...inputStyle, height: "60px" }}
                defaultOpenValue={dayjs("12:00", "HH:mm")}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {index == searchFlightCriteria.length - 1 && checksPassed() && (
        <Row gutter={24} style={{ width: "100%", margin: ".25rem auto" }}>
          <Col span={19}>
            <Row gutter={2} style={{ width: "100%", margin: "0 auto" }}>
              <Col span={7}>
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                >
                  Fly back
                </Button>
              </Col>
              <Col span={7}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                  onClick={addTripLeg}
                >
                  Add a destination
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  block
                  style={{ ...tripActionStyle }}
                >
                  Add extras
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SearchBox;
