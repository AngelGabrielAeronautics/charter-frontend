"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { BellOutlined, ContainerOutlined } from "@ant-design/icons";
import { Avatar, Flex, Layout, Popover } from "antd";

import themeColors from "@/app/(config)/colors";
import { SideNavigation } from "@/app/components";

import { useAppSelector } from "@/lib/state/hooks";

import { eRoutes } from "../(config)/routes";
import AccountDialog from "../components/AccountDialog";
import NotificationDrawer from "../components/Drawers/NotificationsDrawer";
import ViewTaskDrawer from "../components/Drawers/ViewTaskDrawer";
import { contentStyle, headerStyle, layoutStyle, siderStyle } from "./styles";

const { Header, Sider, Content } = Layout;

const AuthenticatedLayout = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [viewTasks, setViewTasks] = useState(false);

  const { isAuthenticated, authenticatedUser } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();

  const openNotifications = () => {
    setOpen(true);
  };

  const openTasks = () => {
    setViewTasks(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onCloseTasks = () => {
    setViewTasks(false);
  };

  const userInitials = () => {
    const user = authenticatedUser;
    if (!user) return null;

    // Get the first letter of each name from authenticatedUser.displayName
    const names = user.displayName.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  };

  // useLayoutEffect(() => {
  //   if (!isAuthenticated) router.replace(eRoutes.login);
  //   return () => {};
  // }, [isAuthenticated]);

  return (
    <Layout style={layoutStyle} className="authenticated-layout">
      <Header style={headerStyle}>
        <Image
          alt="logo"
          src="/images/logo_ivory.svg"
          width={120}
          height={120}
          style={{ height: "100%" }}
        />
        <Flex justify="end" align="center">
          <Flex justify="end" align="center" gap={8}>
            <Avatar
              onClick={openTasks}
              style={{
                backgroundColor: "#fffffd",
                color: "#0b3746",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              shape="circle"
            >
              <ContainerOutlined />
            </Avatar>
            <Avatar
              onClick={openNotifications}
              style={{
                backgroundColor: "#fffffd",
                color: "#0b3746",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              shape="circle"
            >
              <BellOutlined />
            </Avatar>
            <Popover
              placement="bottomRight"
              content={<AccountDialog />}
              trigger="click"
            >
              <Avatar
                style={{
                  backgroundColor: themeColors.sandstone[40],
                  color: themeColors.light.primary,
                  verticalAlign: "middle",
                  cursor: "pointer",
                }}
                src={
                  authenticatedUser?.photoUrl
                    ? `data:${authenticatedUser.photoUrl.mimetype};base64,${authenticatedUser.photoUrl.data}`
                    : undefined
                }
                shape="circle"
              >
                {userInitials()}
              </Avatar>
            </Popover>
          </Flex>
        </Flex>
      </Header>
      <Layout
        style={{
          background: "#EFEFEFF0",
        }}
      >
        <Sider style={siderStyle}>
          <SideNavigation />
        </Sider>
        <Content style={contentStyle}>{children}</Content>
      </Layout>
      <NotificationDrawer open={open} onClose={onClose} />
      <ViewTaskDrawer open={viewTasks} onClose={onCloseTasks} />
    </Layout>
  );
};

interface Props {
  children: React.ReactNode;
}

export default AuthenticatedLayout;
