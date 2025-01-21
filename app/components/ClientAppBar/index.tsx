"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";

import { eRoutes } from "@/app/(config)/routes";

import {
  resetFlightCriteria,
  setShouldShowSearchResults,
} from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

import { AppLogo } from "../CustomIcon";

interface IProps {
  styles?: React.CSSProperties;
}

const ClientAppBar = ({ styles }: IProps) => {
  const { isAuthenticated: signed_in, authenticatedUser } = useAppSelector(
    (state) => state.auth
  );

  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const linkStyle: React.CSSProperties = {
    color: "#F9EFE4",
    fontSize: pathname == "/" ? "1.1rem" : "1rem",
  };

  const iconStyle: React.CSSProperties = {
    color: "#F9EFE4",
    fontSize: pathname == "/" ? "1.8rem" : "1.4rem",
    cursor: "pointer",
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ height: "80px", padding: "0 40px" }}
      className={`client-app-bar w-full ${pathname !== eRoutes.homePage ? "bg-light-primary" : ""} `}
    >
      <Link
        href={eRoutes.homePage}
        onClick={() => {
          dispatch(resetFlightCriteria());
          dispatch(setShouldShowSearchResults(false));
        }}
      >
        <div
          style={{
            width: pathname == "/" ? 400 : 240,
            height: pathname == "/" ? 79 : 120,
            display: "flex",
            alignItems: "center",
          }}
        >
          <AppLogo src="/images/charterV2.svg" />
        </div>
      </Link>
      <Flex justify="end" align="center" gap={44}>
        <Link
          href={
            signed_in && authenticatedUser
              ? authenticatedUser.role === "Administrator"
                ? eRoutes.adminFlights
                : authenticatedUser.role === "Operator"
                  ? eRoutes.operatorFlights
                  : eRoutes.clientFlights
              : eRoutes.clientFlights
          }
          style={{ ...linkStyle, color: "#F9EFE4" }}
        >
          <p style={{ color: "#F9EFE4" }}>Dead Legs</p>
        </Link>
        <Link
          href={
            signed_in && authenticatedUser
              ? authenticatedUser.role === "Administrator"
                ? eRoutes.adminQuotationRequests
                : authenticatedUser.role === "Operator"
                  ? eRoutes.operatorQuotationRequests
                  : eRoutes.clientQuotationRequests
              : `${eRoutes.login}?returnUrl=${eRoutes.clientQuotationRequests}`
          }
          style={linkStyle}
        >
          <p style={{ color: "#F9EFE4" }}>Quotation Requests</p>
        </Link>
        <Link
          href={
            signed_in && authenticatedUser
              ? authenticatedUser.role === "Administrator"
                ? eRoutes.adminDashboard
                : authenticatedUser.role === "Operator"
                  ? eRoutes.operatorFlights
                  : eRoutes.clientBookings
              : `${eRoutes.login}?returnUrl=${eRoutes.clientBookings}`
          }
          style={{ ...linkStyle, color: "#F9EFE4" }}
        >
          <p style={{ color: "#F9EFE4" }}>Manage Bookings</p>
        </Link>
        {signed_in && authenticatedUser ? (
          <Link
            href={
              authenticatedUser.role === "Administrator"
                ? eRoutes.adminDashboard
                : authenticatedUser.role === "Operator"
                  ? eRoutes.operatorDashboard
                  : eRoutes.clientProfile
            }
          >
            <UserOutlined style={{ ...iconStyle, color: "#F9EFE4" }} />
          </Link>
        ) : (
          <Link href={eRoutes.login}>
            <UserOutlined style={{ ...iconStyle, color: "#F9EFE4" }} />
          </Link>
        )}
        {/* <MenuOutlined style={iconStyle} /> */}
      </Flex>
    </Flex>
  );
};

export default ClientAppBar;
