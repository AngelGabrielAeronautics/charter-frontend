import Link from "next/link";

import {
  AuditOutlined,
  DingdingOutlined,
  FileAddOutlined,
  HomeOutlined,
  LogoutOutlined,
  PullRequestOutlined,
  SettingOutlined,
  TeamOutlined,
  UpOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { BiSolidPlane } from "react-icons/bi";
import { MdFlightTakeoff } from "react-icons/md";

import themeColors from "./colors";

type MenuItem = Required<MenuProps>["items"][number];

export const getRoutes = (
  userType:
    | "Client"
    | "Agency"
    | "Operator"
    | "Administrator"
    | "Super User"
    | undefined
) => {
  if (userType == "Administrator") return adminRoutes;
  if (userType == "Agency") return agencyRoutes;
  if (userType == "Operator") return operatorRoutes;
  return [
    {
      key: "logout",
      label: <Link href="#">Sign Out</Link>,
      icon: <LogoutOutlined />,
    },
  ];
};

// Define navigation routes, with labels and icons
const operatorRoutes: MenuItem[] = [
  {
    key: "dashboard",
    label: <Link href="/operator/dashboard">Dashboard</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "assets",
    label: <Link href="/operator/assets">Assets</Link>,
    icon: <BiSolidPlane />,
  },
  {
    key: "flights",
    label: <Link href="/operator/flights">Flights</Link>,
    icon: <MdFlightTakeoff />,
  },
  {
    key: "quotation-requests",
    label: <Link href="/operator/quotation-requests">Quotations</Link>,
    icon: <PullRequestOutlined />,
  },
  {
    label: "Team",
    key: "Team",
    icon: <TeamOutlined />,
    children: [
      {
        label: <Link href="/operator/team/members">Members</Link>,
        key: "team-members",
        icon: <TeamOutlined />,
      },
      {
        label: <Link href="/operator/team/roles/">Roles</Link>,
        key: "team-roles",
        icon: <TeamOutlined />,
      },
    ],
  },
  {
    key: "logout",
    label: <Link href="#">Sign Out</Link>,
    icon: <LogoutOutlined />,
  },
];

const agencyRoutes: MenuItem[] = [
  {
    key: "dashboard",
    label: <Link href="/agency/dashboard">Dashboard</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "Flights",
    label: <Link href="/agency/flights">Flights</Link>,
    icon: <MdFlightTakeoff />,
  },
  {
    key: "Bookings",
    label: <Link href="/agency/bookings">Bookings</Link>,
    icon: <FileAddOutlined />,
  },
  {
    key: "Quotations",
    label: <Link href="/agency/quotation-requests">Quotations</Link>,
    icon: <PullRequestOutlined />,
  },
  {
    key: "logout",
    label: <Link href="#">Sign Out</Link>,
    icon: <LogoutOutlined />,
  },
];

const adminRoutes: MenuItem[] = [
  {
    key: "dashboard",
    label: <Link href="/admin/dashboard">Dashboard</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "Assets",
    label: <Link href="/admin/assets">Assets</Link>,
    icon: <BiSolidPlane />,
  },
  {
    key: "Audit Logs",
    label: <Link href="/admin/audit-logs">Audit Logs</Link>,
    icon: <AuditOutlined />,
  },
  {
    key: "Flights",
    label: <Link href="/admin/flights">Flights</Link>,
    icon: <MdFlightTakeoff />,
  },
  {
    key: "Invoices",
    label: <Link href="/admin/invoices">Invoices</Link>,
    icon: <FileAddOutlined />,
  },
  {
    key: "Team Members",
    label: <Link href="/admin/team-members">Team Members</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "Quotations",
    label: <Link href="/admin/quotation-requests">Quotations</Link>,
    icon: <PullRequestOutlined />,
  },
  {
    key: "Operators",
    label: <Link href="/admin/operators">Operators</Link>,
    icon: <UsergroupAddOutlined />,
  },
  {
    key: "Users",
    label: <Link href="/admin/users">Users</Link>,
    icon: <UserAddOutlined />,
  },
  {
    key: "logout",
    label: <Link href="#">Sign Out</Link>,
    icon: <LogoutOutlined />,
  },
];

export enum eRoutes {
  // #region Admin Routes
  adminDashboard = "/admin/dashboard",
  adminAssets = "/admin/assets",
  adminAuditLogs = "/admin/audit-logs",
  adminFlights = "/admin/flights",
  adminInvoices = "/admin/invoices",
  adminTeamMembers = "/admin/team-members",
  adminQuotationRequests = "/admin/quotation-requests",
  adminOperators = "/admin/operators",
  adminUsers = "/admin/users",
  adminChangePassword = "/admin/changePassword",
  // #endregion

  // #region Agency Routes
  agencyOnboarding = "/onboarding/agency/company",
  agencyDashboard = "/agency/dashboard",
  agencyQuotationRequests = "/agency/quotation-requests",
  agencyFlights = "/agency/flights",
  agencyBookings = "/agency/bookings",
  agencyInvoices = "/agency/invoices",
  agencyTickets = "/agency/tickets",
  agencyChangePassword = "/agency/changePassword",
  // #endregion

  // #region Operator Routes
  operatorOnboarding = "/onboarding/operator/company",
  operatorDashboard = "/operator/dashboard",
  operatorProfile = "/operator/profile",
  operatorFlights = "/operator/flights",
  operatorQuotationRequests = "/operator/quotation-requests",
  operatorBookings = "/operator/bookings",
  operatorChangePassword = "/operator/changePassword",
  // #endregion

  // #region Client Routes
  homePage = "/",
  clientProfile = "/profile",
  clientFlights = "/flights",
  clientQuotationRequests = "/quotation-requests",
  clientBookings = "/bookings",
  clientInvoices = "/invoices",
  clientTickets = "/tickets",
  // #endregion

  // #region Shared Routes
  login = "/login",
  register = "/register",
  roleSelection = "/role-select",
  changePassword = "/change-password",
  // #endregion
}

export interface IRoute {
  path: string;
  label: string;
  icon: React.ReactNode;
}
