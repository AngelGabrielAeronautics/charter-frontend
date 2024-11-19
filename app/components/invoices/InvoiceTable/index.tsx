import React from "react";

import { Col, Table } from "antd";

import AppRowContainer from "@/app/components/AppRowContainer";
import {
  InvoiceCurrencyType,
  InvoiceItemType,
} from "@/app/types/models/invoice";

import { formatToMoneyWithCurrency as formatCurrency } from "@/lib/helpers/formatters.helpers";

import { StyledSecondary } from "../AddInvoice/AddInvoice/EditTable/index.styled";
import { getColumns } from "./columns";

type Props = {
  items: InvoiceItemType[];
  currency?: InvoiceCurrencyType;
  taxTypeData: string;
  taxRateData: number;
};

const InvoiceItemsTable = ({ items, currency, taxRateData }: Props) => {
  const currencyData = currency || {
    currency: "USD",
    language: "en-US",
  };
  const getTotal = () => {
    return (
      items.reduce((acc, item) => {
        return acc + item.total;
      }, 0) || 0
    );
  };

  return (
    <>
      <div>
        <Table
          dataSource={items}
          columns={getColumns(currencyData)}
          pagination={false}
          rowClassName="customInvoiceRow"
        />
      </div>

      <AppRowContainer spacing={2} style={{ marginTop: 40 }}>
        <Col xs={24} md={10} style={{ marginLeft: "auto", marginRight: 10 }}>
          <StyledSecondary>
            <div style={{ marginRight: 24, width: "50%" }}></div>
            <div>
              <span style={{ color: "#0b3746", fontWeight: "bold" }}>
                {" "}
                <span style={{ marginRight: 10 }}>Total:</span>{" "}
                {formatCurrency(getTotal() * (1 - taxRateData * 0.01))}
              </span>
            </div>
          </StyledSecondary>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default InvoiceItemsTable;
