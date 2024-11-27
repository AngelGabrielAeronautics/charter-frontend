import { useState } from "react";



import { ShrinkOutlined } from "@ant-design/icons";
import { Avatar, Badge, BadgeProps, Calendar, CalendarProps, Card, Col, Divider, Empty, Flex, List, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import VirtualList from "rc-virtual-list";
import { BiSolidPlane } from "react-icons/bi";



import AdminFlightDetailsDrawer from "@/app/components/Drawers/AdminFlightDetailsDrawer";



import { IFlight } from "@/lib/models/flight.model";
import { selectFlight } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";



import { FlightsItem } from "../../operator/dashboard/page";


const FullCalendar = ({
  hideFullCalendar,
}: {
  hideFullCalendar: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [visibleFlights, setVisibleFlights] = useState<IFlight[]>([]);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState<boolean>(false);

  const { selectedFlight, flights } = useAppSelector((state) => state.flights);
  const dispatch = useAppDispatch();

  const onDateSelect = (date: Dayjs, info: { source: string }) => {
    setSelectedDate(date);

    let filteredFlights: IFlight[] = [];

    if (info.source === "month") {
      // Filter flights in the selected month
      filteredFlights = flights.filter((flight) =>
        dayjs(flight.departure).isSame(date, "month")
      );
    } else if (info.source === "date") {
      // Filter flights on the selected date
      filteredFlights = flights.filter((flight) =>
        dayjs(flight.departure).isSame(date, "day")
      );
    }

    setVisibleFlights(filteredFlights);
    console.log("Filtered Flights:", filteredFlights);
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
    return flights
      .filter((flight) => dayjs(flight.departure).isSame(value, "day"))
      .map((flight: IFlight) => ({
        type: "success",
        content: `${flight.flightNumber}`,
      }));
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
    const listData = getListData(value) || [];
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
    <div className="max-h-full overflow-hidden">
      <Row gutter={16}>
        <Col span={18}>
          <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
            <Flex justify="space-between">
              <h4 className="mb-0">Flight Calendar</h4>
              <div
                className="h-fit cursor-pointer rounded-md bg-sandstone-40 px-[4px] hover:bg-light-primary hover:text-white"
                onClick={() => {
                  hideFullCalendar();
                }}
              >
                <ShrinkOutlined />
              </div>
            </Flex>
            <Divider />
            <Calendar
              fullscreen={true}
              value={selectedDate}
              onSelect={onDateSelect}
              onPanelChange={onPanelChange}
              cellRender={cellRender}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
            <h4>Flight List</h4>
            <Divider />
            <List>
              {visibleFlights.length > 0 ? (
                <VirtualList
                  data={visibleFlights.map((flight) => ({
                    id: flight._id!,
                    key: flight._id!,
                    name: `${flight.flightNumber}`,
                    flightReady: isFlightReady(flight),
                    departureTime: dayjs(flight.departure).format("HH:mm"),
                    departureDate: dayjs(flight.departure).format("DD/MM/YYYY"),
                    icon: <BiSolidPlane />,
                  }))}
                  itemHeight={47}
                  itemKey="id"
                >
                  {(item: any) => (
                    <List.Item
                      key={item.name}
                      className={`flight-calendar-list-item cursor-pointer rounded-md hover:bg-light-primary ${item.id == selectedFlight?._id ? "selected" : ""}`}
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
                        description={`${item.departureDate} - ${item.departureTime}`}
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
          </Card>
        </Col>
      </Row>
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