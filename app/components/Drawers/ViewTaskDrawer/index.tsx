import React, { useEffect, useState } from "react";

import { BellOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
} from "antd";
import VirtualList from "rc-virtual-list";
import { GrTask } from "react-icons/gr";

import themeColors from "@/app/(config)/colors";

interface ViewTaskProps {
  open: boolean;
  onClose: () => void;
}

interface ViewTasksItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

const ContainerHeight = 200;

const ViewTaskDrawer: React.FC<ViewTaskProps> = ({ open, onClose }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationData, setNotificationData] = useState<ViewTasksItem[]>([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  useEffect(() => {
    if (open) {
    }
  }, [open]);

  const closeDrawer = () => {
    onClose();
    setDrawerVisible(false);
  };

  const taskData = [
    {
      icon: <></>,
      title: (
        <Row justify={"space-between"} align="middle">
          <Flex justify="space-between" align="center">
            <Avatar
              style={{
                backgroundColor: "#c0b1a9",
                marginRight: 15,
              }}
              icon={<GrTask />}
            />
            <p style={{ marginRight: 50 }}>Create Quote</p>
            <Button type="link" size="small">
              <span>Mark As Done</span>
            </Button>
          </Flex>
        </Row>
      ),
      notificationMessage:
        "You have a quotation request that needs to be quoted on. - 26/08/2024 08:54",
      id: "1",
    },
  ];
  return (
    <Drawer
      title="Tasks"
      width={450}
      closable={true}
      onClose={closeDrawer}
      open={open}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <List
        itemLayout="horizontal"
        dataSource={taskData}
        renderItem={(item, index) => (
          <List.Item style={{ cursor: "pointer" }} onClick={showChildrenDrawer}>
            <List.Item.Meta
              avatar={item.icon}
              title={item.title}
              description={item.notificationMessage}
            />
          </List.Item>
        )}
      ></List>
      <Drawer
        title="Quotation Request"
        width={320}
        closable={true}
        onClose={onChildrenDrawerClose}
        open={childrenDrawer}
      >
        You have a quotation request that needs to be quoted on
      </Drawer>
    </Drawer>
  );
};

export default ViewTaskDrawer;
