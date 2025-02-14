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
import { Button, Divider, Form, Skeleton, Space, notification } from "antd";
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
    form.setFieldValue("seats", infantCount + childCount + 1);
  };

  const handleInfantDecrement = () => {
    if (infantCount > 0) setInfantCount(infantCount - 1);
    form.setFieldValue("seats", infantCount + childCount + 1);
  };

  const handleChildIncrement = () => {
    setChildCount(childCount + 1);
    form.setFieldValue("seats", infantCount + childCount + 1);
  };

  const handleChildDecrement = () => {
    if (childCount > 0) setChildCount(childCount - 1);
    form.setFieldValue("seats", infantCount + childCount + 1);
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
      } else if (authenticatedUser && authenticatedUser.role == "Operator") {
        router.push(`/operator/flights`);
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
    // Add validation before processing
    const firstLeg = values.departure === values.arrival;
    const additionalLegsHaveSameAirports = values.legs?.some(
      (leg: any) => leg.departure === leg.arrival
    );

    if (firstLeg || additionalLegsHaveSameAirports) {
      form.setFields([
        {
          name: firstLeg
            ? ["arrival"]
            : [
                "legs",
                values.legs.findIndex(
                  (leg: any) => leg.departure === leg.arrival
                ),
                "arrival",
              ],
          errors: ["Departure and arrival airports cannot be the same"],
        },
      ]);
      return;
    }

    const firstLegItem: ISearchItem = {
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
      departureTime: values.time
        ? values.time.format("HH:mm")
        : dayjs().format("HH:mm"),
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
        departureTime: leg.time
          ? leg.time.format("HH:mm")
          : dayjs().format("HH:mm"),
        numberOfPassengers: values.seats,
      })) || [];

    const searchItems = [firstLegItem, ...additionalLegs];
    console.log("searchItems =====>", searchItems);

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
    const airport = airports.find((airport: IAirport) => airport._id === selection);
    
    // Get current form values
    const values = form.getFieldsValue();
    
    // Check if this is for a leg or main search
    if (key !== undefined) {
      const legs = values.legs || [];
      const currentLeg = legs[key] || {};
      
      // For legs, filter out the current departure/arrival
      const otherValue = type === 'departure' ? currentLeg.arrival : currentLeg.departure;
      
      if (airport?.fullLabel === otherValue) {
        notification.error({
          message: 'Invalid Selection',
          description: 'Departure and arrival airports cannot be the same'
        });
        return;
      }
    } else {
      // For main search, filter out the current departure/arrival
      const otherValue = type === 'departure' ? values.arrival : values.departure;
      
      if (airport?.fullLabel === otherValue) {
        notification.error({
          message: 'Invalid Selection',
          description: 'Departure and arrival airports cannot be the same'
        });
        return;
      }
    }

    // If validation passes, update the form
    if (key !== undefined) {
      form.setFieldValue(`legs[${key}][${type}]`, airport?.fullLabel);
      form.setFieldValue(`legs[${key}][${type}AirportObject]`, airport);
    } else {
      form.setFieldValue(type, airport?.fullLabel);
      form.setFieldValue(`${type}AirportObject`, airport);
    }

    const uniqueAirports = airports.filter(
      (airport: IAirport) =>
        !airportResults.some((result: IAirport) => result._id === airport._id)
    );
    setAirportResults([...airportResults, ...uniqueAirports]);
    runChecks();
  };

  const clearSelectedAirport = (type: string, key?: number) => {
    runChecks();
  };

  const firstLegChecksPassed = () => {
    const departure = form.getFieldValue("departure");
    const arrival = form.getFieldValue("arrival");
    const date = form.getFieldValue("date");
    const time = form.getFieldValue("time");
    const seats = form.getFieldValue("seats");

    if (departure && arrival && date && seats) {
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
      legs.some((leg: any) => !leg?.departure || !leg?.arrival || !leg?.date)
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
      // initialValues={{
      //   time: dayjs("12:00", "HH:mm"),
      // }}
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
              options={(airports || [])
                .filter(airport => {
                  const values = form.getFieldsValue();
                  return airport.fullLabel !== values.arrival;
                })
                .map((airport: IAirport) => ({
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
              onClear={() => {
                clearSelectedAirport("arrival");
                form.setFieldValue("arrival", null);
                form.setFields([
                  {
                    name: "arrival",
                    errors: [],
                  },
                ]);
              }}
              options={(airports || [])
                .filter(airport => {
                  const values = form.getFieldsValue();
                  return airport.fullLabel !== values.departure;
                })
                .map((airport: IAirport) => ({
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
            {
              required: true,
              message: "Please input your departure date",
            },
          ]}
          style={{ width: "16%" }}
        >
          <InputLabel>Date</InputLabel>
          <Form.Item name="date" initialValue={dayjs()} noStyle>
            <AntDatePicker
              onChange={runChecks}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
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
              defaultValue={0}
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
                    <LeftAntFormItem
                      rules={[
                        {
                          required: true,
                          message: "Please input your departure city",
                        },
                      ]}
                      style={{ width: "16%" }}
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
                          onSelect={(value: any) => {
                            selectAirport(value, "departure", key);
                          }}
                          allowClear
                          onClear={() => clearSelectedAirport("departure")}
                          options={(airports || [])
                            .filter(airport => {
                              const legs = form.getFieldValue('legs') || [];
                              const currentLeg = legs[name] || {};
                              return airport.fullLabel !== currentLeg.arrival;
                            })
                            .map((airport: IAirport) => ({
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
                        {
                          required: true,
                          message: "Please input your arrival city",
                        },
                      ]}
                      style={{ width: "16%" }}
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
                          onSelect={(value: any) => {
                            selectAirport(value, "arrival", key);
                          }}
                          allowClear
                          onClear={() => clearSelectedAirport("arrival")}
                          options={(airports || [])
                            .filter(airport => {
                              const legs = form.getFieldValue('legs') || [];
                              const currentLeg = legs[name] || {};
                              return airport.fullLabel !== currentLeg.departure;
                            })
                            .map((airport: IAirport) => ({
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
                        {
                          required: true,
                          message: "Please input your departure date",
                        },
                      ]}
                      style={{ width: "16%" }}
                    >
                      <InputLabel>Date</InputLabel>
                      <Form.Item {...restField} name={[name, "date"]} noStyle>
                        <AntDatePicker
                          disabledDate={(current) => {
                            const legs = form.getFieldValue("legs") || [];
                            // Get the first leg date (from the main form)
                            const firstLegDate = form.getFieldValue("date");
                            
                            // Find the current leg's index
                            const currentLegIndex = legs.findIndex((_: any, idx: any) => idx === name);
                            
                            // Get previous leg's date (either from legs array or first leg)
                            const previousLegDate = currentLegIndex > 0 
                              ? legs[currentLegIndex - 1]?.date 
                              : firstLegDate;
                            
                            // Get next leg's date
                            const nextLegDate = legs[currentLegIndex + 1]?.date;

                            return (
                              (previousLegDate && current < dayjs(previousLegDate)) ||
                              (nextLegDate && current > dayjs(nextLegDate)) ||
                              current < dayjs().startOf("day")
                            );
                          }}
                          onChange={(date) => {
                            form.setFields([
                              {
                                name: [`legs`, name, "date"],
                                errors: [],
                              },
                            ]);
                            runChecks();
                          }}
                          defaultValue={form.getFieldValue("date")}
                        />
                      </Form.Item>
                    </InnerAntFormItem>
                    <InnerAntFormItem
                      // initialValue={dayjs("12:00", "HH:mm")}
                      rules={[
                        {
                          required: true,
                          message: "Please input your departure time",
                        },
                      ]}
                      style={{ width: "16%" }}
                    >
                      <InputLabel>Time</InputLabel>
                      <Form.Item {...restField} name={[name, "time"]} noStyle>
                        <AntTimePicker
                          showSecond={false}
                          onChange={runChecks}
                        />
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
                      <Form.Item name={[name, "seats"]} noStyle>
                        <AntInput
                          type="number"
                          min={1}
                          defaultValue={1}
                          suffix={<TeamOutlined />}
                          onChange={runChecks}
                        />
                      </Form.Item>
                    </RightAntFormItem>
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
                      const arrivalAirport = airportResults.find(
                        (airport: IAirport) =>
                          airport._id === form.getFieldValue("departure") ||
                          airport.fullLabel === form.getFieldValue("departure")
                      );
                      const departureAirport = lastLeg?.arrival
                        ? (airportResults.find(
                            (airport: IAirport) =>
                              airport._id === lastLeg.arrival ||
                              airport.fullLabel === lastLeg.arrival
                          )?.fullLabel ?? lastLeg.arrival)
                        : form.getFieldValue("arrival");

                      const newLeg = {
                        departure: departureAirport,
                        arrival:
                          arrivalAirport?.fullLabel ??
                          form.getFieldValue("departure"),
                        date: lastLeg?.date ?? form.getFieldValue("date"),
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
                      const legs = form.getFieldValue("legs") || [];
                      const lastLeg =
                        legs?.length > 0 ? legs[legs.length - 1] : null;
                      const departureAirport = lastLeg?.arrival
                        ? (airportResults.find(
                            (airport: IAirport) =>
                              airport._id === lastLeg.arrival ||
                              airport.fullLabel === lastLeg.arrival
                          )?.fullLabel ?? lastLeg.arrival)
                        : form.getFieldValue("arrival");

                      const newLeg = {
                        departure: departureAirport,
                        date: lastLeg?.date ?? form.getFieldValue("date"),
                      };

                      add(newLeg);
                      runChecks();
                    }}
                  >
                    Add a destination
                  </Button>
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
