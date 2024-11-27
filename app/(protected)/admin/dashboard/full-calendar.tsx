import React, { useState } from "react";

import { ExpandAltOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  BadgeProps,
  Calendar,
  CalendarProps,
  Empty,
  Flex,
  List,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import VirtualList from "rc-virtual-list";
import { BiSolidPlane } from "react-icons/bi";

import AdminFlightDetailsDrawer from "@/app/components/Drawers/AdminFlightDetailsDrawer";

import { IFlight } from "@/lib/models/flight.model";
import { selectFlight } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import { FlightsItem } from "../../operator/dashboard/page";

const ContainerHeight = 200;
const notificationContainerHeight = 523;

const FullCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [visibleFlights, setVisibleFlights] = useState<IFlight[]>([]);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const { selectedFlight, flights } = useAppSelector((state) => state.flights);
  const dispatch = useAppDispatch();

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);

    // Set visibleFlights from flights on selected date
    const filteredFlights = flights.filter((flight) =>
      dayjs(flight.departure).isAfter(date)
    );

    setVisibleFlights(filteredFlights);
  };

  const onPanelChange = (
    value: Dayjs,
    mode: CalendarProps<Dayjs>["mode"]
  ) => {};

  const isFlightReady = (flight: IFlight) => {
    const {
      aircraftBooked = false,
      airportHandler = false,
      allPaymentsReceived = false,
      arrivalAndIndemnity = false,
      catering = false,
      crewAccommodation = false,
      issuedAllTickets = false,
      roadShuttle = false,
      supplierPaid = false,
    } = flight.checklist!;
    return (
      aircraftBooked &&
      airportHandler &&
      allPaymentsReceived &&
      arrivalAndIndemnity &&
      catering &&
      crewAccommodation &&
      issuedAllTickets &&
      roadShuttle &&
      supplierPaid
    );
  };

  const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = []; // Specify the type of listData
    switch (value.date()) {
      case 8:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
        ];
        break;
      case 10:
        listData = [
          { type: "warning", content: "This is warning event." },
          { type: "success", content: "This is usual event." },
          { type: "error", content: "This is error event." },
        ];
        break;
      case 15:
        listData = [
          { type: "warning", content: "This is warning event" },
          { type: "success", content: "This is very long usual event......" },
          { type: "error", content: "This is error event 1." },
          { type: "error", content: "This is error event 2." },
          { type: "error", content: "This is error event 3." },
          { type: "error", content: "This is error event 4." },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div>
      <Flex justify="space-between">
        <h4>Flight Calendar</h4>
        <ExpandAltOutlined
          onClick={() => {
            setIsFullScreen(false);
          }}
        />
      </Flex>
      <Calendar
        fullscreen={isFullScreen}
        value={selectedDate}
        onSelect={onDateSelect}
        onPanelChange={onPanelChange}
      />
      <List>
        {visibleFlights.length > 0 ? (
          <VirtualList
            data={visibleFlights.map((flight) => ({
              id: flight._id!,
              key: flight._id!,
              name: `${flight.flightNumber}`,
              flightReady: isFlightReady(flight),
              departureTime: dayjs(flight.departure).format("HH:mm"),
              icon: <BiSolidPlane />,
            }))}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="id"
          >
            {(item: FlightsItem) => (
              <List.Item
                key={item.name}
                className={`flight-calendar-list-item cursor-pointer hover:bg-light-primary ${item.id == selectedFlight?._id ? "selected" : ""}`}
                onClick={() => {
                  const flight = flights.find((e) => e._id == item.id);
                  if (flight) {
                    dispatch(selectFlight(flight));
                    setFlightDetailsOpen(true);
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: item.flightReady
                          ? "#CCE0AC"
                          : "#FF8A8A",
                      }}
                      icon={item.icon}
                    />
                  }
                  title={item.name}
                  description={item.departureTime}
                />
              </List.Item>
            )}
          </VirtualList>
        ) : (
          <Empty
            description="No flights"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </List>
      <AdminFlightDetailsDrawer
        visible={flightDetailsOpen}
        onClose={() => {
          setFlightDetailsOpen(false);
        }}
      />
    </div>
  );
};

export default FullCalendar;
