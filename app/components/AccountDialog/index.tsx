"use client";

import { useRouter } from "next/navigation";

import {
  EditOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Flex, Menu, MenuProps } from "antd";

import themeColors from "@/app/(config)/colors";
import { eRoutes } from "@/app/(config)/routes";

import { signOut } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const AccountDialog = () => {
  type MenuItem = Required<MenuProps>["items"][number];

  const items: MenuItem[] = [
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: "Change Password",
    },
    {
      key: "company-profile",
      icon: <UserOutlined />,
      label: "Company Profile",
    },
    {
      key: "support",
      icon: <MailOutlined />,
      label: "Support",
    },
  ];

  const { authenticatedUser } = useAppSelector((state) => state.auth);
  const { currentOperator } = useAppSelector((state) => state.operators);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleClick: MenuProps["onClick"] = (e) => {
    if (authenticatedUser) {
      // Company Profile clicked ~ Navigate to appropriate profile based on user's role
      if (e.key === "company-profile") {
        if (authenticatedUser.role == "Operator") {
          router.push(eRoutes.operatorProfile);
        }
      } else if (e.key == "change-password") {
        if (authenticatedUser.role === "Agency") {
          router.push(eRoutes.agencyChangePassword);
        }
        if (authenticatedUser.role === "Operator") {
          router.push(eRoutes.operatorChangePassword);
        }
      }
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div style={{ padding: ".5rem" }}>
      <Flex gap={16}>
        <div>
          <Avatar
            size="large"
            style={{ backgroundColor: themeColors.light.primary }}
            icon={<UserOutlined />}
            src={
              authenticatedUser?.photoUrl
                ? `data:${authenticatedUser.photoUrl.mimetype};base64,${authenticatedUser.photoUrl.data}`
                : undefined
            }
          />
        </div>
        <div style={{ width: "100%" }}>
          <p style={{ fontWeight: "bold" }}>{authenticatedUser?.displayName}</p>
          <p>{authenticatedUser?.email}</p>
          {currentOperator && <p>{currentOperator?.airline}</p>}
        </div>
      </Flex>
      <Divider style={{ margin: "12px 0" }} />
      <Menu
        onClick={handleClick}
        style={{
          width: 256,
          borderRight: "none",
          background: "unset",
          color: themeColors.light.text,
        }}
        mode="vertical"
        items={items}
      />
      <Button
        type="primary"
        onClick={handleSignOut}
        style={{
          backgroundColor: themeColors.light.primary,
          color: themeColors.white,
          marginTop: "1rem",
        }}
        block
      >
        SIGN OUT
      </Button>
    </div>
  );
};

export default AccountDialog;
