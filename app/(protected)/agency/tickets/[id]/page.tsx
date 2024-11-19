"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Divider, Row, Typography } from "antd";
import dayjs from "dayjs";

import { ClientAppBar } from "@/app/components";
import AppCard from "@/app/components/AppCard";
import AppRowContainer from "@/app/components/AppRowContainer";
import TicketPDF from "@/app/components/TicketPdf";
import {
  StyledBankAccountWrapper,
  StyledPrimaryText2,
} from "@/app/components/invoices/AddInvoice/AddInvoice/index.styled";
import InvoiceItemsTable from "@/app/components/invoices/InvoiceTable";
import {
  StyledFlexWrapper,
  StyledFlexWrapper1,
} from "@/app/components/invoices/index.styled";
import { downloadPdf } from "@/app/helpers/FileHelper";
import {
  InvoiceItemType,
  InvoiceSettingType,
} from "@/app/types/models/invoice";

import { formatUCTtoISO } from "@/lib/helpers/formatters.helpers";
import { ITicket } from "@/lib/models/ITicket";
import { IFlight } from "@/lib/models/flight.model";
import { findOne } from "@/lib/state/assets/assets.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { getInvoiceById } from "@/lib/state/invoices/invoices.slice";
import { getTicket } from "@/lib/state/tickets/slice";
import { getCustomerById } from "@/lib/state/users/users.slice";

const AgencyTicketDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { selectedRecord } = useAppSelector((state) => state.tickets);
  const { selectedAsset } = useAppSelector((state) => state.assets);

  useEffect(() => {
    const path = pathname.split("/");
    const id = path[path.length - 1];
    if (id) {
      dispatch(getTicket(id));
    }
    return () => {};
  }, [dispatch, pathname]);

  return (
    <>
      <h3 style={{ fontWeight: 500, color: "#0b3746" }}>
        <ArrowLeftOutlined onClick={() => router.back()} /> Ticket Details
      </h3>
      <div style={{ width: "70%", margin: "auto" }}>
        {selectedRecord && <TicketPDF ticket={selectedRecord} />}
      </div>
    </>
  );
};

export default AgencyTicketDetails;
