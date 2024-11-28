"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  ContainerOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  CalendarProps,
  Card,
  Col,
  Empty,
  Flex,
  FloatButton,
  List,
  Row,
  Spin,
  Tooltip,
} from "antd";
import type { Dayjs } from "dayjs";
import VirtualList from "rc-virtual-list";
import { GiAirplaneDeparture } from "react-icons/gi";
import { HiOutlineCash } from "react-icons/hi";
import {
  MdAirplanemodeActive,
  MdFlight,
  MdFlightTakeoff,
} from "react-icons/md";

import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import TaskDrawer from "@/app/components/Drawers/TaskDrawer";

import { getOperatorDashboard } from "@/lib/state/dashboard/slice";
import { getOperatorFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import FlightCalendar from "../../admin/dashboard/flight-calendar";
import FullCalendar from "../../admin/dashboard/full-calendar";

const notificationContainerHeight = 523;

export interface FlightsItem {
  key: string;
  id: string;
  flightReady: boolean;
  departureTime: string;
  name: string;
  icon: React.ReactNode;
}

export interface NotificationsItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

export interface TasksItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

const OperatorDashboard = () => {
  const [tasksData, setTaskData] = useState<TasksItem[]>([]);
  const [notificationData, setNotificationData] = useState<NotificationsItem[]>(
    []
  );
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAsset, setOpenAsset] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { stats, loading } = useAppSelector((state) => state.dashboard);
  const { loadingFlights } = useAppSelector((state) => ({
    loadingFlights: state.flights.loading.listRecords,
    flights: state.flights.flights,
  }));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getOperatorDashboard(authenticatedUser?.operatorId!));
    dispatch(getOperatorFlights(authenticatedUser?.operatorId!));
  }, [dispatch]);

  return (
    <div>
       {!showFullCalendar && <div className="dashboard-view">
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
                  <Link href="/operator/assets">
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
                  <Link href="/operator/flights">
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
                        {stats?.deadLegs.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Dead Legs</p>
                    </Flex>
                  </Col>
                  <Link href="/operator/quotation-requests">
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
                        {stats?.quotations.total}
                      </p>
                      <p style={{ marginLeft: 10, fontSize: 16 }}>Quotations</p>
                    </Flex>
                  </Col>
                  <Link href="/operator/quotation-requests">
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
                        {stats?.quotationRequests.total}
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
                <FlightCalendar showFullCalendar={() => setShowFullCalendar(true)} />
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
      </div>}
      {showFullCalendar && <FullCalendar hideFullCalendar={() => setShowFullCalendar(false)} />}
      <FloatButton.Group
        type="primary"
        shape="square"
        onClick={() => {
          setVisible(!visible);
        }}
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
            onClick={() => {
              setOpen(true); // Open the flight drawer
              setOpenAsset(false); // Ensure asset drawer is closed
              setOpenTask(false);
            }}
            type="primary"
            icon={<MdFlightTakeoff />}
          />
        </Tooltip>
        <Tooltip placement="left" title="Add Asset">
          <FloatButton
            onClick={() => {
              setOpenAsset(true); // Open the asset drawer
              setOpen(false); // Ensure flight drawer is closed
              setOpenTask(false);
            }}
            type="primary"
            icon={<MdFlight />}
          />
        </Tooltip>
        {/* <Tooltip placement='left' title='Create Quote'>
					<FloatButton type='primary' icon={<UploadOutlined />} />
				</Tooltip> */}
        <Tooltip placement="left" title="Add Task">
          <FloatButton
            onClick={() => {
              setOpenAsset(false); // Open the asset drawer
              setOpen(false); // Ensure flight drawer is closed
              setOpenTask(true);
            }}
            type="primary"
            icon={<ContainerOutlined />}
          />
        </Tooltip>
      </FloatButton.Group>
      {open && <CreateFlightDrawer onClose={() => setOpen(false)} open={open} />}
      {openAsset && (
        <CreateAssetsDrawer
        onClose={() => setOpenAsset(false)} visible={openAsset} />
      )}
      {openTask && <TaskDrawer onClose={() => setOpenTask(false)} open={openTask} />}
    </div>
  );
};

export default OperatorDashboard;
