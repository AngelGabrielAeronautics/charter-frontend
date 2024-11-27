"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import {
  ContainerOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Calendar,
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
  theme,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import VirtualList from "rc-virtual-list";
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

import CreateAssetsDrawer from "@/app/components/Drawers/CreateAssetDrawer";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import TaskDrawer from "@/app/components/Drawers/TaskDrawer";

import { IFlight } from "@/lib/models/flight.model";
import { getAdminDashboard } from "@/lib/state/dashboard/slice";
import { fetchFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import FlightCalendar from "./flight-calendar";
import FullCalendar from "./full-calendar";

const notificationContainerHeight = 523;

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

const AdminDashboard = () => {
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
    dispatch(getAdminDashboard());
    dispatch(fetchFlights());
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
                    <Link href="/admin/operators">
                      <Avatar
                        style={{ backgroundColor: "#6CB2DDFF" }}
                        shape="square"
                        size={44}
                        icon={<GoCopilot />}
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
                          {stats?.operators.total}
                        </p>
                        <p style={{ marginLeft: 10, fontSize: 16 }}>
                          Operators
                        </p>
                      </Flex>
                    </Col>
                    <Link href="/admin/assets">
                      <Avatar
                        style={{ marginLeft: 50, backgroundColor: "#B1A7F2" }}
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
                        <p style={{ marginLeft: 10, fontSize: 16 }}>
                          Dead Legs
                        </p>
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
                        <p style={{ marginLeft: 10, fontSize: 16 }}>
                          Quotations
                        </p>
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
      <CreateFlightDrawer onClose={() => setOpen(false)} open={open} />
      <CreateAssetsDrawer
        onClose={() => setOpenAsset(false)}
        visible={openAsset}
      />
      <TaskDrawer onClose={() => setOpenTask(false)} open={openTask} />
    </div>
  );
};

export default AdminDashboard;
