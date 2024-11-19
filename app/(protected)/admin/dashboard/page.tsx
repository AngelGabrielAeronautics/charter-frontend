"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import {
  AudioOutlined,
  BellOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ContainerOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Calendar,
  CalendarProps,
  Card,
  Col,
  Drawer,
  Empty,
  Flex,
  FloatButton,
  Image,
  List,
  Row,
  Space,
  Spin,
  Tooltip,
  theme,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import VirtualList from "rc-virtual-list";
import { BiSolidPlane } from "react-icons/bi";
import { GiAirplaneDeparture } from "react-icons/gi";
import { GoCopilot } from "react-icons/go";
import { GrTask } from "react-icons/gr";
import { HiOutlineCash } from "react-icons/hi";
import {
  MdAirplanemodeActive,
  MdFlight,
  MdFlightTakeoff,
} from "react-icons/md";
import { PiSquareHalfLight } from "react-icons/pi";

import { formatTimeString } from "@/app/components/DataTable/utilities";
import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import TaskDrawer from "@/app/components/Drawers/TaskDrawer";

import { IFlight } from "@/lib/models/flight.model";
import {
  getAdminDashboard,
  getOperatorDashboard,
} from "@/lib/state/dashboard/slice";
import {
  fetchFlights,
  getOperatorFlights,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

interface Props {}

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {};

const ContainerHeight = 200;
const notificationContainerHeight = 523;

interface FlightsItem {
  key: string;
  id: string;
  flightReady: boolean;
  departureTime: string;
  name: string;
  icon: React.ReactNode;
}

interface NotificationsItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

interface TasksItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

// const notificationsData: NotificationsItem[] = [
// 	{
// 		icon: <BellOutlined />,
// 		title: (
// 			<Row justify={"space-between"} align='middle'>
// 				<Flex justify='space-between' align='center'>
// 					<Avatar style={{ backgroundColor: "#b1a7f2", marginRight: 15 }} icon={<BellOutlined />} />
// 					<span>
// 						<p style={{ marginRight: 50 }}>Quotation Request</p>
// 					</span>
// 					<Button type='link' size='small'>
// 						<span>Mark As Read</span>
// 					</Button>
// 				</Flex>
// 			</Row>
// 		),
// 		notificationMessage: "You have a new quotation request",
// 		id: "1",
// 	},
// 	{
// 		icon: <BellOutlined />,
// 		title: (
// 			<Row justify={"space-between"} align='middle'>
// 				<Flex justify='space-between' align='center'>
// 					<Avatar style={{ backgroundColor: "#b1a7f2", marginRight: 15 }} icon={<BellOutlined />} />
// 					<p style={{ marginRight: 50 }}>Flight Booked</p>
// 					<Button type='link' size='small'>
// 						<span>Mark As Read</span>
// 					</Button>
// 				</Flex>
// 			</Row>
// 		),
// 		notificationMessage: "Flight JAZ-JV8989-001 has a new booking",
// 		id: "2",
// 	},
// 	{
// 		icon: <BellOutlined />,
// 		title: (
// 			<Row justify={"space-between"} align='middle'>
// 				<Flex justify='space-between' align='center'>
// 					<Avatar style={{ backgroundColor: "#b1a7f2", marginRight: 15 }} icon={<BellOutlined />} />
// 					<p style={{ marginRight: 50 }}>Quotation Accepted</p>
// 					<Button type='link' size='small'>
// 						<span>Mark As Read</span>
// 					</Button>
// 				</Flex>
// 			</Row>
// 		),
// 		notificationMessage: "Your quotation for flight JAZ-JV8989-003 has been accepted",
// 		id: "3",
// 	},
// ]

const taskData: TasksItem[] = [
  {
    icon: <GrTask />,
    title: (
      <Row justify={"space-between"} align="middle">
        <Flex justify="space-between" align="center">
          <Avatar
            style={{ backgroundColor: "#b8a89f", marginRight: 15 }}
            icon={<GrTask />}
          />
          <span>
            <p style={{ marginRight: 50 }}>Create Quote</p>
          </span>
          <Button type="link" size="small">
            <span>Mark As Done</span>
          </Button>
        </Flex>
      </Row>
    ),
    notificationMessage:
      "You have a quotation request that needs to be quoted on.",
    id: "1",
  },
  {
    icon: <GrTask />,
    title: (
      <Row justify={"space-between"} align="middle">
        <Flex justify="space-between" align="center">
          <Avatar
            style={{ backgroundColor: "#b8a89f", marginRight: 15 }}
            icon={<GrTask />}
          />
          <p style={{ marginRight: 50 }}>Update Asset</p>
          <Button type="link" size="small">
            <span>Mark As Done</span>
          </Button>
        </Flex>
      </Row>
    ),
    notificationMessage:
      "You need to complete the information for your asset called Jet One",
    id: "2",
  },
];

const AdminDashboard = ({}: Props) => {
  const {} = useAppSelector((state) => state.operators);
  const { loadingFlights, flights } = useAppSelector((state) => ({
    loadingFlights: state.flights.loading.listRecords,
    flights: state.flights.flights,
  }));
  const {} = useAppSelector((state) => state.quotationsRequests);
  const {} = useAppSelector((state) => state.quotations);
  const { stats, loading, success } = useAppSelector(
    (state) => state.dashboard
  );
  const { authenticatedUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const { token } = theme.useToken();
  const [tasksData, setTaskData] = useState<TasksItem[]>([]);
  const [notificationData, setNotificationData] = useState<NotificationsItem[]>(
    []
  );
  const eventsCardRef = useRef<HTMLDivElement>(null);
  const notificationsCardRef = useRef<HTMLDivElement>(null);
  const [notificationCardHeight, setNotificationCardHeight] =
    useState<number>(0);
  const [visible, setVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [open, setOpen] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>("");
  const [isTaskDrawerVisible, setIsTaskDrawerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [visibleFlights, setVisibleFlights] = useState<IFlight[]>([]);

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);

    // Set visibleFlights from flights on selected date
    const filteredFlights = flights.filter((flight) =>
      dayjs(flight.departure).isAfter(date)
    );

    setVisibleFlights(filteredFlights);
  };

  const createDeadLegClick = () => {
    setOpen(true); // Open the flight drawer
    setOpenAsset(false); // Ensure asset drawer is closed
    setOpenTask(false);
  };

  const createAssetClick = () => {
    setOpenAsset(true); // Open the asset drawer
    setOpen(false); // Ensure flight drawer is closed
    setOpenTask(false);
  };

  const createTaskClick = () => {
    setOpenAsset(false); // Open the asset drawer
    setOpen(false); // Ensure flight drawer is closed
    setOpenTask(true);
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (eventsCardRef.current && notificationsCardRef.current) {
      const eventsCardHeight = eventsCardRef.current.offsetHeight;
      setNotificationCardHeight(eventsCardHeight);
      notificationsCardRef.current.style.height = `${eventsCardHeight}px`;
    }
  }, [notificationData]);

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Handle scroll events here
  };

  useEffect(() => {
    dispatch(getAdminDashboard());
    dispatch(fetchFlights());
    setTaskData([]);
    setNotificationData([]);
  }, [dispatch]);

  const onClose = () => {
    setOpen(false);
  };

  const toggleTaskDrawer = () => {
    setIsTaskDrawerVisible(!isTaskDrawerVisible);
  };

  const onCloseFlightDrawer = () => {
    setOpen(false); // Close the flight drawer
  };

  const onCloseAssetDrawer = () => {
    setOpenAsset(false); // Close the asset drawer
  };

  const onCloseTaskDrawer = () => {
    setOpenTask(false); // Close the asset drawer
  };

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

  return (
    <div>
      <Spin
        size="large"
        tip={
          <>
            <h3 className="font-bold">Please wait</h3>
            <h4 className="font-medium">
              Loading the latest stats and current events.
            </h4>
          </>
        }
        spinning={loading && loadingFlights}
        indicator={<LoadingOutlined spin />}
      >
        <Row>
          <Card style={{ width: "100%", backgroundColor: "#ebe5df" }}>
            <Row>
              <Col span={20}>
                <Flex vertical>
                  <p>Welcome</p>
                  <h4>{authenticatedUser?.displayName}</h4>
                </Flex>
                <Row className="mt-5">
                  {/* <Link href='/admin/operators'>
										<Avatar style={{ backgroundColor: "#6CB2DDFF" }} shape='square' size={44} icon={<GoCopilot />} />
									</Link>
									<Col>
										<Flex vertical>
											<p style={{ marginLeft: 10, marginTop: 2, fontWeight: "bold", fontSize: 14 }}>{stats?.operators.total}</p>
											<p style={{ marginLeft: 10, fontSize: 16 }}>Operators</p>
										</Flex>
									</Col> */}
                  <Link href="/admin/assets">
                    <Avatar
                      style={{ backgroundColor: "#B1A7F2" }}
                      shape="square"
                      size={44}
                      icon={<MdAirplanemodeActive />}
                    />
                  </Link>
                  <Col>
                    <Flex vertical>
                      <p
                        style={{
                          marginLeft: 10,
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {stats?.assets.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Assets</p>
                    </Flex>
                  </Col>
                  <Link href="/admin/flights">
                    <Avatar
                      style={{ marginLeft: 50, backgroundColor: "#8A8480FF" }}
                      shape="square"
                      size={44}
                      icon={<GiAirplaneDeparture />}
                    />
                  </Link>
                  <Col>
                    <Flex vertical>
                      <p
                        style={{
                          marginLeft: 10,
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {stats?.deadLegs.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Dead Legs</p>
                    </Flex>
                  </Col>
                  <Link href="/admin/quotation-requests">
                    <Avatar
                      style={{ marginLeft: 50, backgroundColor: "#FFBF6BFF" }}
                      shape="square"
                      size={44}
                      icon={<HiOutlineCash />}
                    />
                  </Link>
                  <Col>
                    <Flex vertical>
                      <p
                        style={{
                          marginLeft: 10,
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {stats?.quotations.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Quotations</p>
                    </Flex>
                  </Col>
                  <Link href="/admin/quotation-requests">
                    <Avatar
                      style={{ marginLeft: 50, backgroundColor: "#FF6B6B" }}
                      shape="square"
                      size={44}
                      icon={<HiOutlineCash />}
                    />
                  </Link>
                  <Col>
                    <Flex vertical>
                      <p
                        style={{
                          marginLeft: 10,
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {stats?.quotationRequests.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Requests</p>
                    </Flex>
                  </Col>
                  <Link href="/admin/invoices">
                    <Avatar
                      style={{ marginLeft: 50, backgroundColor: "#FFD662" }}
                      shape="square"
                      size={44}
                      icon={<PiSquareHalfLight />}
                    />
                  </Link>
                  <Col>
                    <Flex vertical>
                      <p
                        style={{
                          marginLeft: 10,
                          marginTop: 2,
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        {stats?.bookings.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Bookings</p>
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row style={{ marginTop: 30 }} gutter={10}>
          <Col span={8}>
            <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
              <h4 style={{ marginBottom: 10 }}>Flight Calendar</h4>
              <div style={wrapperStyle}>
                <Calendar
                  fullscreen={false}
                  value={selectedDate}
                  onSelect={onDateSelect}
                  onPanelChange={onPanelChange}
                />
              </div>
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
                    onScroll={onScroll}
                  >
                    {(item: FlightsItem) => (
                      <List.Item key={item.name}>
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
            </Card>
          </Col>
          <Col span={8}>
            <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
              <h4 style={{ marginBottom: 10 }}>Notifications</h4>
              <List>
                {notificationData.length > 0 ? (
                  <VirtualList
                    data={notificationData}
                    height={notificationContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                  >
                    {(item: NotificationsItem) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          title={item.title}
                          description={item.notificationMessage}
                        />
                      </List.Item>
                    )}
                  </VirtualList>
                ) : (
                  <Empty
                    description="No notifications"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </List>
            </Card>
          </Col>
          <Col span={8}>
            <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
              <h4 style={{ marginBottom: 10 }}>Tasks</h4>
              <List>
                {tasksData.length > 0 ? (
                  <VirtualList
                    data={tasksData}
                    height={notificationContainerHeight}
                    itemHeight={47}
                    itemKey="email"
                    onScroll={onScroll}
                  >
                    {(item: NotificationsItem) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          title={item.title}
                          description={item.notificationMessage}
                        />
                      </List.Item>
                    )}
                  </VirtualList>
                ) : (
                  <Empty
                    description="No tasks"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </List>
            </Card>
          </Col>
        </Row>
      </Spin>
      <FloatButton.Group
        type="primary"
        shape="square"
        onClick={toggleVisibility}
        trigger="click"
        style={{
          insetInlineEnd: 0,
          transition: "ease-in-out ",
          position: "fixed",
          top: 250,
        }}
        icon={<PlusCircleOutlined />}
      >
        <Tooltip placement="left" title="Create Dead Leg">
          <FloatButton
            onClick={createDeadLegClick}
            type="primary"
            icon={<MdFlightTakeoff />}
          />
        </Tooltip>
        <Tooltip placement="left" title="Add Asset">
          <FloatButton
            onClick={createAssetClick}
            type="primary"
            icon={<MdFlight />}
          />
        </Tooltip>
        {/* <Tooltip placement='left' title='Create Quote'>
					<FloatButton type='primary' icon={<UploadOutlined />} />
				</Tooltip> */}
        <Tooltip placement="left" title="Add Task">
          <FloatButton
            onClick={createTaskClick}
            type="primary"
            icon={<ContainerOutlined />}
          />
        </Tooltip>
      </FloatButton.Group>
      <CreateFlightDrawer onClose={onCloseFlightDrawer} open={open} />
      <CreateAssetsDrawer onClose={onCloseAssetDrawer} visible={openAsset} />
      <TaskDrawer onClose={onCloseTaskDrawer} open={openTask} />
    </div>
  );
};

export default AdminDashboard;
