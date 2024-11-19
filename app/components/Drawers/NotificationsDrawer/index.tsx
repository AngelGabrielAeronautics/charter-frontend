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
  notification,
} from "antd";
import VirtualList from "rc-virtual-list";
import { GrTask } from "react-icons/gr";

import themeColors from "@/app/(config)/colors";

interface NotificationProps {
  open: boolean;
  onClose: () => void;
}

interface NotificationsItem {
  icon: React.ReactNode;
  title: React.ReactNode;
  notificationMessage: string;
  id: string;
}

const ContainerHeight = 200;

const NotificationDrawer: React.FC<NotificationProps> = ({ open, onClose }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
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

  const notificationData = [
    {
      icon: <></>,
      title: (
        <Row justify={"space-between"} align="middle">
          <Flex justify="space-between" align="center">
            <Avatar
              style={{
                backgroundColor: "#b1a7f2",
                marginRight: 15,
              }}
              icon={<BellOutlined />}
            />
            <p style={{ marginRight: 50 }}>Quotation Request</p>
            <Button type="link" size="small">
              <span>Mark As Read</span>
            </Button>
          </Flex>
        </Row>
      ),
      notificationMessage:
        "You have a new quotation request. - 26/08/2024 08:54",
      id: "1",
    },
  ];

  return (
    <Drawer
      title="Notifications"
      width={450}
      closable={true}
      onClose={closeDrawer}
      open={open}
      style={{ backgroundColor: "#f7f2ed" }}
    >
      <List
        itemLayout="horizontal"
        dataSource={notificationData}
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
        There is a new quotation request for OR - JHB to CT - Cape Town for you
        to quote on.
      </Drawer>
    </Drawer>
  );
};

export default NotificationDrawer;
