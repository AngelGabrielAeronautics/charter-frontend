"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Calendar,
  CalendarProps,
  Card,
  Col,
  Empty,
  Flex,
  List,
  Row,
  Spin,
  theme,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import VirtualList from "rc-virtual-list";
import { BiSolidPlane } from "react-icons/bi";
import { GiAirplaneDeparture } from "react-icons/gi";
import { HiOutlineCash } from "react-icons/hi";
import { MdAirplanemodeActive } from "react-icons/md";

import { eRoutes } from "@/app/(config)/routes";
import PageHeader from "@/app/components/PageHeader";

import { IFlight } from "@/lib/models/flight.model";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import { FlightsItem } from "../../operator/dashboard/page";

interface Props {}

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {};

const ContainerHeight = 200;

const AgentDashboard = ({}: Props) => {
  const { stats, loading } = useAppSelector((state) => state.dashboard);
  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { loadingFlights, flights } = useAppSelector((state) => ({
    loadingFlights: state.flights.loading,
    flights: state.flights.flights,
  }));

  const dispatch = useAppDispatch();
  const { token } = theme.useToken();

  const [visibleReports, setVisibleReports] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [visibleFlights, setVisibleFlights] = useState<IFlight[]>([]);

  // useEffect(() => {
  // 	if (authenticatedUser) {
  // 		dispatch(getAgentDashboard(authenticatedUser.agencyId))
  // 	}
  // }, [dispatch, authenticatedUser])

  // useEffect(() => {
  // 	setVisibleReports(reports)
  // }, [reports])

  const pageActions = [
    <Button type="primary" ghost icon={<DownloadOutlined />} key="1">
      Download Report
    </Button>,
  ];

  const notificationData = [
    {
      id: 1,
      title: "Notification 1",
      notificationMessage: "This is the first notification",
    },
    {
      id: 2,
      title: "Notification 2",
      notificationMessage: "This is the second notification",
    },
    {
      id: 3,
      title: "Notification 3",
      notificationMessage: "This is the third notification",
    },
  ];

  const notificationContainerHeight = 200;

  const tasksData = [
    {
      id: 1,
      title: "Task 1",
      taskMessage: "This is the first task",
    },
    {
      id: 2,
      title: "Task 2",
      taskMessage: "This is the second task",
    },
    {
      id: 3,
      title: "Task 3",
      taskMessage: "This is the third task",
    },
  ];

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Handle scroll events here
  };

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onDateSelect = (date: Dayjs) => {
    setSelectedDate(date);

    // Set visibleFlights from flights on selected date
    const filteredFlights = flights.filter((flight) =>
      dayjs(flight.departure).isAfter(date)
    );

    setVisibleFlights(filteredFlights);
  };

  return (
    <Spin
      size="large"
      tip={
        <>
          <h3 className="font-bold">Please wait</h3>
          <h4 className="font-medium">Loading the latest reports and data.</h4>
        </>
      }
      spinning={loading}
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
                <Link href={eRoutes.agencyFlights}>
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
                      {stats?.assets.total || 0}
                    </p>
                    <p style={{ marginLeft: 10, fontSize: 16 }}>Flights</p>
                  </Flex>
                </Col>
                <Link href={eRoutes.agencyBookings}>
                  <Avatar
                    style={{ marginLeft: 50, backgroundColor: "#B8A89F" }}
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
                      {stats?.deadLegs.total || 0}
                    </p>
                    <p style={{ marginLeft: 10, fontSize: 16 }}>Bookings</p>
                  </Flex>
                </Col>
                <Link href={eRoutes.agencyQuotationRequests}>
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
                      {stats?.quotations.total || 0}
                    </p>
                    <p style={{ marginLeft: 10, fontSize: 16 }}>Quotations</p>
                  </Flex>
                </Col>
                <Link href={eRoutes.agencyQuotationRequests}>
                  <Avatar
                    style={{ marginLeft: 50, backgroundColor: "#FFD662" }}
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
                      {stats?.quotationRequests.total || 0}
                    </p>
                    <p style={{ marginLeft: 10, fontSize: 16 }}>Requests</p>
                  </Flex>
                </Col>
                {/* <Link href='/operator/quotation-requests'>
										<Avatar style={{ marginLeft: 50, backgroundColor: "#FFD662" }} shape='square' size={44} icon={<PiSquareHalfLight />} />
									</Link>
									<Col>
										<Flex vertical>
											<p style={{ marginLeft: 10, marginTop: 2, fontWeight: "bold", fontSize: 14 }}>{stats?.bookings.total}</p>
											<p style={{ marginLeft: 10, fontSize: 16 }}>Bookings</p>
										</Flex>
									</Col> */}
              </Row>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row style={{ marginTop: 30 }} gutter={10}>
        <Col span={8}>
          <Card className="card" style={{ backgroundColor: "#ebe5df" }}>
            <h4 style={{ marginBottom: 10 }}>Upcoming Trips</h4>
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
                    flightReady: true,
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
                  {(item: any) => (
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
                  {(item: any) => (
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
  );
};

export default AgentDashboard;
