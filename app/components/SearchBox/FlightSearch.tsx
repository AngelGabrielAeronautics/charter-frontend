"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Divider, Dropdown, Form, Skeleton, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";

import { API_BASE_URL } from "@/app/(config)/constants";

import { IAirport } from "@/lib/models/airport.model";
import { ISearchItem } from "@/lib/models/search.model";
import {
  searchFlights,
  setSearchFlightCriteria,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import {
  AntButton,
  AntDatePicker,
  AntForm,
  AntFormItem,
  AntInput,
  AntSelect,
  AntTimePicker,
  FormControl,
  InnerAntFormItem,
  InputLabel,
  LeftAntFormItem,
  RightAntFormItem,
} from "./components.styled";

const tripActionStyle = {
  height: "65px",
  padding: "1rem",
  backgroundColor: "#0B3746BF",
  width: "100%",
  color: "#F9EFE4",
  fontSize: "1rem",
  fontWeight: "500",
};

const FlightSearch = () => {
  const [form] = Form.useForm();
  const [airports, setAirports] = useState<IAirport[]>([]);
  const [airportResults, setAirportResults] = useState<IAirport[]>([]);
  const [checksPassed, setChecksPassed] = useState({
    firstLeg: false,
    additionalLegs: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const {
    searchFlightCriteria,
    searchingFlights,
    shouldShowSearchResults,
    flights,
  } = useAppSelector((state: any) => state.flights);
  const [infantCount, setInfantCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  const handleInfantIncrement = () => {
    setInfantCount(infantCount + 1);
  };

  const handleInfantDecrement = () => {
    if (infantCount > 0) setInfantCount(infantCount - 1);
  };

  const handleChildIncrement = () => {
    setChildCount(childCount + 1);
  };

  const handleChildDecrement = () => {
    if (childCount > 0) setChildCount(childCount - 1);
  };

  const menu = (
    <div
      style={{
        backgroundColor: "#f9efe4",
        borderRadius: "8px",
        padding: "10px",
        border: "1px solid #f9efe4",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "90%" }}>
          <span>Infants</span>
          <Space size={30}>
            <MinusOutlined
              style={{ color: "#736764" }}
              onClick={handleInfantDecrement}
            />
            <span>{infantCount}</span>
            <PlusOutlined
              style={{ color: "#736764" }}
              onClick={handleInfantIncrement}
            />
          </Space>
        </Space>

        <Divider style={{ margin: "5px 0" }} />

        <Space style={{ justifyContent: "space-between", width: "90%" }}>
          <span>Children</span>
          <Space size={30}>
            <MinusOutlined
              style={{ color: "#736764" }}
              onClick={handleChildDecrement}
            />
            <span>{childCount}</span>
            <PlusOutlined
              style={{ color: "#736764" }}
              onClick={handleChildIncrement}
            />
          </Space>
        </Space>
      </Space>
    </div>
  );

  useEffect(() => {
    if (
      !searchingFlights &&
      shouldShowSearchResults &&
      pathname !== "/flights"
    ) {
      if (authenticatedUser && authenticatedUser.role == "Agency") {
        // Agency should not be redirected
      } else {
        router.push(`/flights`);
      }
    }
  }, [searchingFlights, shouldShowSearchResults, pathname, authenticatedUser]);

  useEffect(() => {
    if (searchFlightCriteria.length > 0) {
      form.setFieldsValue({
        departure: searchFlightCriteria[0].departureAirport,
        arrival: searchFlightCriteria[0].arrivalAirport,
        date: dayjs(searchFlightCriteria[0].departureDate),
        time: dayjs(searchFlightCriteria[0].departureTime, "HH:mm"),
        seats: searchFlightCriteria[0].numberOfPassengers,
      });
      if (searchFlightCriteria.length > 1) {
        const legs: {
          departure: string;
          arrival: string;
          date: dayjs.Dayjs;
          time: dayjs.Dayjs;
        }[] = [];
        searchFlightCriteria
          .slice(1)
          .forEach((leg: ISearchItem, index: number) => {
            legs.push({
              departure: leg.departureAirport,
              arrival: leg.arrivalAirport,
              date: dayjs(leg.departureDate),
              time: dayjs(leg.departureTime, "HH:mm"),
            });
          });
        form.setFieldsValue({
          legs: legs,
        });
        runChecks();
      }
    }
  }, [searchFlightCriteria]);

  const onFinish = (values: any) => {
    const firstLeg: ISearchItem = {
      departureAirport:
        airportResults.find(
          (airport: IAirport) =>
            airport._id === values.departure ||
            airport.fullLabel === values.departure
        )?.fullLabel ?? values.departure,
      departureAirportObject: airportResults.find(
        (airport: IAirport) =>
          airport._id === values.departure ||
          airport.fullLabel === values.departure
      ),
      arrivalAirport:
        airportResults.find(
          (airport: IAirport) =>
            airport._id === values.arrival ||
            airport.fullLabel === values.arrival
        )?.fullLabel ?? values.arrival,
      arrivalAirportObject: airportResults.find(
        (airport: IAirport) =>
          airport._id === values.arrival || airport.fullLabel === values.arrival
      ),
      departureDate: values.date.format("YYYY-MM-DD"),
      // Make sure the time is in the correct format
      departureTime: values.time.format("HH:mm"),
      numberOfPassengers: values.seats,
    };

    const additionalLegs =
      values.legs?.map((leg: any) => ({
        departureAirport:
          airportResults.find(
            (airport: IAirport) =>
              airport._id === leg.departure ||
              airport.fullLabel === leg.departure
          )?.fullLabel ?? leg.departure,
        departureAirportObject: airportResults.find(
          (airport: IAirport) =>
            airport._id === leg.departure || airport.fullLabel === leg.departure
        ),
        arrivalAirport:
          airportResults.find(
            (airport: IAirport) =>
              airport._id === leg.arrival || airport.fullLabel === leg.arrival
          )?.fullLabel ?? leg.arrival,
        arrivalAirportObject: airportResults.find(
          (airport: IAirport) =>
            airport._id === leg.arrival || airport.fullLabel === leg.arrival
        ),
        departureDate: leg.date.format("YYYY-MM-DD"),
        departureTime: leg.time.format("HH:mm"),
        numberOfPassengers: values.seats,
      })) || [];

    const searchItems = [firstLeg, ...additionalLegs];

    dispatch(setSearchFlightCriteria(searchItems));
    dispatch(searchFlights(searchItems));
  };

  const searchAirports = (value: any) => {
    if (value.length > 0) {
      axios(`${API_BASE_URL}/airports/search/${value}`)
        .then((response: any) => {
          return response.data;
        })
        .then((data: IAirport[]) => {
          setAirports(data);
        });
    }
  };

  const selectAirport = (selection: any, type: string, key?: number) => {
    const airport = airports.find(
      (airport: IAirport) => airport._id === selection
    );
    if (key) {
      form.setFieldValue(`legs[${key}][${type}AirportObject]`, airport);
      form.setFieldValue(`legs[${key}][${type}]`, airport?.fullLabel);
    } else {
      form.setFieldValue(`${type}AirportObject`, airport);
      form.setFieldValue(`${type}`, airport?.fullLabel);
    }
    const uniqueAirports = airports.filter(
      (airport: IAirport) =>
        !airportResults.some((result: IAirport) => result._id === airport._id)
    );
    setAirportResults([...airportResults, ...uniqueAirports]);
    runChecks();
  };

  const clearSelectedAirport = (type: string) => {
    form.setFieldValue(`${type}`, null);
    form.setFieldValue(`${type}AirportObject`, null);
    runChecks();
  };

  const firstLegChecksPassed = () => {
    const departure = form.getFieldValue("departure");
    const arrival = form.getFieldValue("arrival");
    const date = form.getFieldValue("date");
    const time = form.getFieldValue("time");
    const seats = form.getFieldValue("seats");

    if (departure && arrival && date && time && seats) {
      return true;
    }

    return false;
  };

  const additionalLegsPassed = () => {
    const legs = form.getFieldValue("legs");
    // Return false if there are legs but the legs are not valid or undefined
    if (
      legs &&
      legs.length > 0 &&
      legs.some(
        (leg: any) =>
          !leg?.departure || !leg?.arrival || !leg?.date || !leg?.time
      )
    ) {
      return false;
    }
    // Return true if there are no legs
    if (!legs || legs.length === 0) {
      return true;
    }
    // Return true if all legs are valid
    return true;
  };

  const runChecks = () => {
    const formValues = form.getFieldsValue();

    setChecksPassed({
      firstLeg: firstLegChecksPassed(),
      additionalLegs: additionalLegsPassed(),
    });
  };

  useEffect(() => {
    runChecks();
  }, [form]);

  useEffect(() => {
    // Increased timeout to ensure styles are fully loaded
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton.Input active block style={{ height: 65, marginBottom: 16 }} />
        <Skeleton.Input active block style={{ height: 65 }} />
      </div>
    );
  }

  return (
    <AntForm
      layout="inline"
      form={form}
      onFinish={onFinish}
      id="flight-search-form"
      style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.2s" }}
      initialValues={{
        time: dayjs("12:00", "HH:mm"),
      }}
    >
      <FormControl>
        <LeftAntFormItem
          rules={[
            { required: true, message: "Please input your departure city" },
          ]}
          style={{ width: "16%" }}
        >
          <InputLabel>Departure</InputLabel>
          <Form.Item name="departure" noStyle>
            <AntSelect
              showSearch
              onSearch={(value: string) => searchAirports(value)}
              onSelect={(value: any) => selectAirport(value, "departure")}
              allowClear
              onClear={() => clearSelectedAirport("departure")}
              options={(airports || []).map((airport: IAirport) => ({
                value: airport._id,
                label: airport.fullLabel,
              }))}
              suffixIcon={null}
              filterOption={false}
              notFoundContent={null}
            />
          </Form.Item>
        </LeftAntFormItem>
        <InnerAntFormItem
          rules={[
            { required: true, message: "Please input your arrival city" },
          ]}
          style={{ width: "16%" }}
        >
          <InputLabel>Arrival</InputLabel>
          <Form.Item name="arrival" noStyle>
            <AntSelect
              showSearch
              onSearch={(value: string) => searchAirports(value)}
              onSelect={(value: any) => selectAirport(value, "arrival")}
              allowClear
              onClear={() => clearSelectedAirport("arrival")}
              options={(airports || []).map((airport: IAirport) => ({
                value: airport._id,
                label: airport.fullLabel,
              }))}
              suffixIcon={null}
              filterOption={false}
              notFoundContent={null}
            />
          </Form.Item>
        </InnerAntFormItem>
        <InnerAntFormItem
          rules={[
            { required: true, message: "Please input your departure date" },
          ]}
          style={{ width: "16%" }}
        >
          <InputLabel>Date</InputLabel>
          <Form.Item name="date" noStyle>
            <AntDatePicker onChange={runChecks} />
          </Form.Item>
        </InnerAntFormItem>
        <InnerAntFormItem
          initialValue={dayjs("12:00", "HH:mm")}
          rules={[
            { required: true, message: "Please input your departure time" },
          ]}
          style={{ width: "16%" }}
        >
          <InputLabel>Time</InputLabel>
          <Form.Item name="time" noStyle>
            <AntTimePicker showSecond={false} onChange={runChecks} />
          </Form.Item>
        </InnerAntFormItem>
        <RightAntFormItem
          rules={[
            {
              required: true,
              message: "Please input your number of passengers",
            },
          ]}
          style={{ width: "7.5%" }}
        >
          <InputLabel>Seats</InputLabel>
          <Form.Item name="seats" noStyle>
            <AntInput
              type="number"
              min={1}
              suffix={<TeamOutlined />}
              onChange={runChecks}
            />
          </Form.Item>
        </RightAntFormItem>
        <AntButton
          type="primary"
          htmlType="submit"
          block
          style={{ ...tripActionStyle }}
        >
          Search Flights
        </AntButton>
      </FormControl>
      {checksPassed.firstLeg && (
        <Form.List name="legs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <FormControl key={key}>
                    <AntFormItem
                      rules={[
                        {
                          required: true,
                          message: "Please input your departure city",
                        },
                      ]}
                      style={{ width: "25%" }}
                    >
                      <InputLabel>Departure</InputLabel>
                      <Form.Item
                        {...restField}
                        name={[name, "departure"]}
                        noStyle
                      >
                        <AntSelect
                          showSearch
                          onSearch={(value: string) => searchAirports(value)}
                          onSelect={(value: any) =>
                            selectAirport(value, "departure", key)
                          }
                          allowClear
                          onClear={() => clearSelectedAirport("departure")}
                          options={(airports || []).map(
                            (airport: IAirport) => ({
                              value: airport._id,
                              label: airport.fullLabel,
                            })
                          )}
                          suffixIcon={null}
                          filterOption={false}
                          notFoundContent={null}
                        />
                      </Form.Item>
                    </AntFormItem>
                    <AntFormItem
                      rules={[
                        {
                          required: true,
                          message: "Please input your arrival city",
                        },
                      ]}
                      style={{ width: "25%" }}
                    >
                      <InputLabel>Arrival</InputLabel>
                      <Form.Item
                        {...restField}
                        name={[name, "arrival"]}
                        noStyle
                      >
                        <AntSelect
                          showSearch
                          onSearch={(value: string) => searchAirports(value)}
                          onSelect={(value: any) =>
                            selectAirport(value, "arrival", key)
                          }
                          allowClear
                          onClear={() => clearSelectedAirport("arrival")}
                          options={(airports || []).map(
                            (airport: IAirport) => ({
                              value: airport._id,
                              label: airport.fullLabel,
                            })
                          )}
                          suffixIcon={null}
                          filterOption={false}
                          notFoundContent={null}
                        />
                      </Form.Item>
                    </AntFormItem>
                    <AntFormItem
                      rules={[
                        {
                          required: true,
                          message: "Please input your departure date",
                        },
                      ]}
                      style={{ width: "10%" }}
                    >
                      <InputLabel>Date</InputLabel>
                      <Form.Item {...restField} name={[name, "date"]} noStyle>
                        <AntDatePicker onChange={runChecks} />
                      </Form.Item>
                    </AntFormItem>
                    <AntFormItem
                      initialValue={dayjs("12:00", "HH:mm")}
                      rules={[
                        {
                          required: true,
                          message: "Please input your departure time",
                        },
                      ]}
                      style={{ width: "7.5%" }}
                    >
                      <InputLabel>Time</InputLabel>
                      <Form.Item {...restField} name={[name, "time"]} noStyle>
                        <AntTimePicker
                          showSecond={false}
                          onChange={runChecks}
                        />
                      </Form.Item>
                    </AntFormItem>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name);
                        runChecks();
                      }}
                    />
                  </FormControl>
                );
              })}
              {checksPassed.additionalLegs && (
                <FormControl id="trip-modifiers">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    type="primary"
                    block
                    style={{
                      ...tripActionStyle,
                      width: "25%",
                      marginRight: "1rem",
                    }}
                    onClick={() => {
                      const legs = form.getFieldValue("legs") || [];
                      const lastLeg =
                        legs?.length > 0 ? legs[legs.length - 1] : null;
                      const newLeg = {
                        departure:
                          lastLeg?.arrival ?? form.getFieldValue("arrival"),
                        arrival: form.getFieldValue("departure"),
                        time: dayjs("12:00", "HH:mm"),
                      };

                      add(newLeg);
                      runChecks();
                    }}
                  >
                    Fly back
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    block
                    style={{
                      ...tripActionStyle,
                      width: "25%",
                      marginRight: "1rem",
                    }}
                    onClick={() => {
                      const legs = form.getFieldValue("legs");
                      const lastLeg =
                        legs?.length > 0 ? legs[legs.length - 1] : null;
                      const newLeg = {
                        departure:
                          lastLeg?.arrival ?? form.getFieldValue("arrival"),
                        time: dayjs("12:00", "HH:mm"),
                      };

                      add(newLeg);
                      runChecks();
                    }}
                  >
                    Add a destination
                  </Button>
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <Button
                      icon={<PlusOutlined />}
                      type="primary"
                      block
                      style={{ ...tripActionStyle, width: "18.5%" }}
                    >
                      Add extras
                    </Button>
                  </Dropdown>
                </FormControl>
              )}
            </>
          )}
        </Form.List>
      )}
    </AntForm>
  );
};

export default FlightSearch;
