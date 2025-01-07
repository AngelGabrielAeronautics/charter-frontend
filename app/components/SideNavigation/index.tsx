"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import type { MenuProps } from "antd";
import { Menu } from "antd";

import { getRoutes } from "@/app/(config)/routes";

import { resetActionStates, signOut } from "@/lib/state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

type MenuItem = Required<MenuProps>["items"][number];

const SideNavigation: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([""]);

  const { authenticatedUser, isAuthenticated, success, loading, error } = useAppSelector((state) => state.auth);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const getMenuItems = (): MenuItem[] => {
    if (authenticatedUser) {
      const routes = getRoutes(authenticatedUser.role) ?? [];
      return routes;
    }
    return [];
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      dispatch(signOut());
    }
  };

  useEffect(() => {
    // Get the current path segments
    const pathSegments = pathname.split("/");
    const pathSuffix = pathSegments[2]?.toLowerCase() || "";

    setSelectedKeys([pathSuffix]);
  }, [pathname]);

  useEffect(() => {
    if (success.signOut && !loading.signOut && !error.signOut && !isAuthenticated && !authenticatedUser && router) {
      router.replace("/login")
      dispatch(resetActionStates())
    }
  }, [success, loading, error, router]);

  return (
    <Menu
      onClick={onClick}
      selectedKeys={selectedKeys}
      mode="inline"
      items={getMenuItems()}
    />
  );
};

export default SideNavigation;
