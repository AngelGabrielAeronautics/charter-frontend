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
    color: "#ffffff",
    fontSize: pathname == "/" ? "1.1rem" : "1rem",
  };

  const iconStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: pathname == "/" ? "1.8rem" : "1.4rem",
    cursor: "pointer",
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ height: "80px", padding: "0 40px" }}
      className={`client-app-bar w-full ${pathname !== eRoutes.homePage ? "bg-light-primary" : ""} text-light-background`}
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
        <Link href={eRoutes.clientFlights} style={linkStyle}>
          Dead Legs
        </Link>
        <Link
          href={
            signed_in && authenticatedUser
              ? eRoutes.clientQuotationRequests
              : `${eRoutes.login}?returnUrl=${eRoutes.clientQuotationRequests}`
          }
          style={linkStyle}
        >
          Quotation Requests
        </Link>
        <Link
          href={
            signed_in && authenticatedUser
              ? eRoutes.clientBookings
              : `${eRoutes.login}?returnUrl=${eRoutes.clientBookings}`
          }
          style={linkStyle}
        >
          Manage Bookings
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
            <UserOutlined style={iconStyle} />
          </Link>
        ) : (
          <Link href={eRoutes.login}>
            <UserOutlined style={iconStyle} />
          </Link>
        )}
        {/* <MenuOutlined style={iconStyle} /> */}
      </Flex>
    </Flex>
  );
};

export default ClientAppBar;
