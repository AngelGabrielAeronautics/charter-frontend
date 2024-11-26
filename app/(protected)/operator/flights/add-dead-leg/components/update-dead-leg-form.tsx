"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  DatePickerProps,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  TimePicker,
  TimePickerProps,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import moment from "moment";

import SearchSelectAirport from "@/app/components/SearchSelectAirport";

import { IAsset } from "@/lib/models/IAssets";
import { IAirport } from "@/lib/models/airport.model";
import { IFlight } from "@/lib/models/flight.model";
import { filter } from "@/lib/state/assets/assets.slice";
import {
  resetActionStates,
  updateFlightThunk,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const formItemStyle = { width: "100%" };

const inputStyle = {
  padding: "0",
  backgroundColor: "#FFFFFFBF",
  width: "100%",
  color: "#42454F",
  fontSize: "1rem",
  fontWeight: "600",
};

interface IProps {
  selectedFlight: IFlight;
  onClose: () => void;
}

const UpdateDeadLegForm = ({ selectedFlight, onClose }: IProps) => {
  const [form] = useForm();

  const [flight, setFlight] = useState<any>({
    departure: new Date(),
    duration: 0,
    durationMinutes: 0,
  });

  const arrivalDate = Form.useWatch((values) => {
    if (values.duration && values.durationMinutes && values.departureDate) {
      const _arrivalDate = dayjs(values.departureDate)
        .add(values.duration, "hours")
        .add(values.duration, "minutes");
      return _arrivalDate;
    }
  }, form);

  const dispatch = useAppDispatch();

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { assets } = useAppSelector((state) => state.assets);
  const { loading, success } = useAppSelector(
    (state) => state.flights
  );

  const [flexibleRouting, setIsFlexibleRouting] = useState<boolean>(false);
  const [dateFlexible, setIsDateFlexible] = useState<boolean>(
    selectedFlight.flexibleDate
  );
  const [flexibleDepartureTime, setFlexibleDepartureTime] = useState<boolean>(
    selectedFlight.flexibleDepartureTime
  );
  const [registrationNumber, setRegistrationNumber] = useState<String>("");
  const [weight, setWeight] = useState<String>("");
  const [selectedAsset, setSelectedAsset] = useState<IAsset>();

  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (loading.updateRecord == false && success.updateRecord) {
      notification.success({
        message: "Flight update successfully",
      });
      form.resetFields();
      onClose();
      dispatch(resetActionStates());
    }
    return () => {};
  }, [loading, success, dispatch]);

  useEffect(() => {
    if (arrivalDate) {
      setFlight((prev: any) => ({ ...prev, arrivalDate: arrivalDate }));
      form.setFieldValue("arrivalDate", arrivalDate);
    }
    return () => {};
  }, [arrivalDate]);

  useEffect(() => {
    if (selectedFlight && selectedFlight.departureAirport!.airportName) {
      const departureDate = moment(selectedFlight.departure);
      const arrivalMeetingTIme = moment(selectedFlight.arrivalMeetingTime);
      const departureMeetingTime = moment(selectedFlight.meetingTime);
      setDepartureAirport(selectedFlight.departureAirport);
      setArrivalAirport(selectedFlight.arrivalAirport);
      form.setFieldsValue({
        registrationNumber: selectedFlight.aircraftRegistrationNumber,
        manufacturer: selectedFlight.aircraftManufacturer,
        model: selectedFlight.aircraftModel,
        departure: selectedFlight.departureAirport.airportName,
        meetingArea: selectedFlight.meetingArea,
        duration: selectedFlight.duration,
        durationMinutes: selectedFlight.durationMinutes,
        arrivalMeetingTime: arrivalMeetingTIme,
        offerExpiryHoursPriorToFlight:
          selectedFlight.offerExpiryHoursPriorToFlight,
        departureDate: departureDate,
        maxSeatsAvailable: selectedFlight.maxSeatsAvailable,
        maxLuggagePerPerson: selectedFlight.maxLuggagePerPerson,
        arrivalMeetingArea: selectedFlight.arrivalMeetingArea,
        pricePerSeat: selectedFlight.pricePerSeat,
        meetingTime: departureMeetingTime,
      });
    }
  }, [selectedFlight, form]);

  const handleUpdateDeadLeg = () => {
    form.validateFields().then((values: any) => {
      const selectedAsset: IAsset | undefined = assets.find(
        (asset) => asset.registrationNumber === values.registrationNumber
      );
      if (selectedAsset) {
        const deadLegObject: IFlight = {
          airline: selectedAsset.airline,
          capacity: values.maxSeatsAvailable,
          departure: flight.departureDate,
          duration: parseInt(values.duration.toString()),
          petsAllowed: selectedAsset.petsAllowed,
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          status: "Offered",
          aircraftId: selectedAsset._id!,
          aircraftManufacturer: selectedAsset.manufacturer,
          aircraftModel: selectedAsset.model,
          aircraftRegistrationNumber: selectedAsset.registrationNumber,
          arrivalDate: values.arrivalDate,
          arrivalMeetingArea: values.arrivalMeetingArea,
          arrivalMeetingTime: values.arrivalMeetingTime,
          durationMinutes: parseInt(values.durationMinutes.toString()),
          flexibleDate: dateFlexible,
          flexibleDepartureTime: flexibleDepartureTime,
          flexibleRouting: flexibleRouting,
          notes: [],
          luggageWeightUnits: values.luggageWeightUnits ?? "kgs",
          maxLuggagePerPerson: parseInt(values.maxLuggagePerPerson.toString()),

          maxSeatsAvailable: selectedAsset.seatingCapacity,
          meetingArea: values.meetingArea,
          meetingTime: values.meetingTime,
          offerExpiryHoursPriorToFlight: parseInt(
            values.offerExpiryHoursPriorToFlight.toString()
          ),
          operatorId: authenticatedUser?.operatorId!,
          passengers: [],
          pricePerSeat: parseFloat(values.pricePerSeat.toString()),
          auditFields: {
            createdBy: authenticatedUser?.displayName!,
            createdById: authenticatedUser?._id!,
            dateCreated: new Date(),
          },
        };

        dispatch(
          updateFlightThunk({ id: selectedFlight._id!, data: deadLegObject })
        );
      }
    });
  };

  const setDepartureAirport = (departureAirport?: IAirport) => {
    setFlight((prev: any) => ({ ...prev, departureAirport }));
  };

  const setArrivalAirport = (arrivalAirport?: IAirport) => {
    setFlight((prev: any) => ({ ...prev, arrivalAirport }));
  };

  const onDepartureDateChange: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setFlight((prev: any) => ({
      ...prev,
      departureDate: date.toDate(),
    }));
  };

  const onCalculatedArrivalDate: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    setFlight((prev: any) => ({
      ...prev,
      arrivalDate: dateString.toString(),
    }));
  };

  const onTimeChange: TimePickerProps["onChange"] = (time, timeString) => {
    setFlight((prev: any) => ({
      ...prev,
      departureTime: timeString.toString(),
    }));
  };

  const setDepartureMeetingTime: TimePickerProps["onChange"] = (
    time,
    timeString
  ) => {
    setFlight((prev: any) => ({
      ...prev,
      departureMeetingTime: timeString.toLocaleString(),
    }));
  };

  const setArrivalMeetingTime: TimePickerProps["onChange"] = (
    time,
    timeString
  ) => {
    setFlight((prev: any) => ({
      ...prev,
      arrivalMeetingTime: timeString.toLocaleString(),
    }));
  };

  useEffect(() => {
    dispatch(filter({ operatorId: authenticatedUser?.operatorId }));
  }, [dispatch]);

  const handleRegistrationSelect = (value: string) => {
    setRegistrationNumber(value);
  };

  useEffect(() => {
    if (registrationNumber) {
      // Find selected asset code...
      const selectedAsset: IAsset | undefined = assets.find(
        (asset) => asset.registrationNumber === registrationNumber
      );
      form.setFieldValue("manufacturer", selectedAsset?.manufacturer);
      form.setFieldValue("model", selectedAsset?.model);
      form.setFieldValue("maxSeatsAvailable", selectedAsset?.seatingCapacity);
      form.setFieldValue("capacity", selectedAsset?.seatingCapacity);
      setSelectedAsset(selectedAsset);
      return () => {};
    }
  }, [registrationNumber]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleUpdateDeadLeg}>
        <h5>Aircraft Details</h5>
        <Form.Item
          name="registrationNumber"
          style={formItemStyle}
          label="Enter Registration Number"
          required={true}
        >
          <Select
            onSelect={handleRegistrationSelect}
            size="middle"
            style={{ backgroundColor: "#ffffff" }}
            placeholder="Select Registration Number"
            options={assets.map((asset: IAsset) => ({
              value: asset.registrationNumber,
              label: asset.registrationNumber,
            }))}
          />
        </Form.Item>

        <Flex gap={16} className="items-end">
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            style={formItemStyle}
          >
            <Input
              disabled
              type="text"
              value={selectedAsset?.manufacturer ?? ""}
            />
          </Form.Item>

          <Form.Item name="model" label="Model" style={formItemStyle}>
            <Input disabled type="text" value={selectedAsset?.model ?? ""} />
          </Form.Item>
        </Flex>
        <Divider />
        <h5>Routing Details</h5>
        <FormItem
          required
          name="departure"
          label="Search Flight From"
          style={formItemStyle}
        >
          <SearchSelectAirport
            defaultAirport={selectedFlight.departureAirport}
            placeholder=""
            onSelect={setDepartureAirport}
            styles={{ ...inputStyle, height: 35 }}
          />
        </FormItem>
        <FormItem
          required
          name="Destination"
          label="Search Flight To"
          style={formItemStyle}
        >
          <SearchSelectAirport
            defaultAirport={selectedFlight.arrivalAirport}
            placeholder=""
            onSelect={setArrivalAirport}
            styles={{ ...inputStyle, height: 35 }}
          />
        </FormItem>
        <Form.Item
          name="flexibleRouting"
          label="Flexible Routing"
          valuePropName="checked"
          style={formItemStyle}
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
        <Divider />
        <h5>Timing</h5>
        <Flex gap={16} className="items-end">
          <Form.Item
            style={formItemStyle}
            label="Departure Date"
            name="departureDate"
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime
              showHour
              showMinute
              onChange={onDepartureDateChange}
            />
          </Form.Item>
          <FormItem
            label="Duration Hours"
            name="duration"
            style={formItemStyle}
          >
            <Input type="number" />
          </FormItem>
          <FormItem
            name="durationMinutes"
            label="Duration Minutes"
            style={formItemStyle}
          >
            <Input type="number" />
          </FormItem>
          <Form.Item
            style={formItemStyle}
            label="Calculated Arrival Date"
            name="arrivalDate"
          >
            <DatePicker
              disabled
              style={{ width: "100%" }}
              showTime
              showHour
              showMinute
              value={arrivalDate ? dayjs(arrivalDate) : undefined}
              onChange={onCalculatedArrivalDate}
            />
          </Form.Item>
        </Flex>
        <Flex gap={16} className="items-end">
          <Form.Item name="date_flexible" style={formItemStyle}>
            <Space
              style={{ width: "100%", backgroundColor: "white" }}
              className="flex justify-between px-2"
            >
              <p>Date Flexible</p>{" "}
              <Checkbox
                defaultChecked={false}
                checked={dateFlexible}
                onChange={(e) => setIsDateFlexible(e.target.checked)}
              />
            </Space>
          </Form.Item>
          <Form.Item name="departure_time_flexible" style={formItemStyle}>
            <Space
              style={{ width: "100%", backgroundColor: "white" }}
              className="flex justify-between px-2"
            >
              <p>Departure Time Flexible</p>{" "}
              <Checkbox
                defaultChecked={false}
                checked={flexibleDepartureTime}
                onChange={(e) => setFlexibleDepartureTime(e.target.checked)}
              />
            </Space>
          </Form.Item>
          <Form.Item
            name="offerExpiryHoursPriorToFlight"
            label="Offer expiry prior to flight"
            style={formItemStyle}
          >
            <Input type="number" />
          </Form.Item>
        </Flex>
        <Divider />
        <h4>Loading</h4>
        <Flex gap={16} className="items-end">
          <Form.Item
            name="maxSeatsAvailable"
            label="Maximum seats available"
            style={formItemStyle}
          >
            <Input disabled type="number" />
          </Form.Item>
          <Form.Item style={formItemStyle} label="Max Baggage Weight">
            <Space
              style={{ width: "100%", backgroundColor: "white" }}
              className="flex justify-between"
            >
              <Form.Item
                noStyle
                name="maxLuggagePerPerson"
                style={formItemStyle}
                label="Max Baggage Weight"
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Max Baggage Weight"
                  type="number"
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="luggageWeightUnits"
                style={formItemStyle}
                label="Max Baggage Weight Unit"
              >
                <Select
                  onSelect={(value) => setWeight(value)}
                  size="middle"
                  placeholder="Weight"
                  defaultValue="kgs"
                >
                  <Select.Option value="kgs">kgs</Select.Option>
                  <Select.Option value="lbs">lbs</Select.Option>
                </Select>
              </Form.Item>
            </Space>
          </Form.Item>
        </Flex>
        <Divider />
        <h4>Boarding</h4>
        <Flex gap={16}>
          <Form.Item
            label="Departure Meeting Area"
            name="meetingArea"
            style={formItemStyle}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            style={formItemStyle}
            label="Departure Meeting Time"
            name="meetingTime"
          >
            <TimePicker
              showHour
              showMinute
              style={{ width: "100%" }}
              onChange={setDepartureMeetingTime}
            />
          </Form.Item>
        </Flex>
        <Flex gap={16}>
          <Form.Item
            label="Arrival Meeting Area"
            style={formItemStyle}
            name="arrivalMeetingArea"
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            style={formItemStyle}
            label="Arrival Meeting Time"
            name="arrivalMeetingTime"
          >
            <TimePicker
              showHour
              showMinute
              style={{ width: "100%" }}
              onChange={setArrivalMeetingTime}
            />
          </Form.Item>
        </Flex>
        <Divider />
        <h4>Pricing</h4>
        <Flex gap={16}>
          <Form.Item
            label="USD 0.0"
            style={{ width: "50%" }}
            name="pricePerSeat"
          >
            <Input type="number" />
          </Form.Item>
        </Flex>
        <Divider />
        <FormItem style={{ width: "50%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Button
                type="primary"
                danger
                block
                onClick={() => handleCancel()}
              >
                CANCEL
              </Button>
            </Col>
            <Col span={12}>
              <Button type="primary" block htmlType="submit">
                {loading.updateRecord === true ? <Spin /> : "SAVE CHANGES"}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </>
  );
};

export default UpdateDeadLegForm;
