import { ColumnsType } from "antd/es/table";

import {
  InvoiceCurrencyType,
  InvoiceItemType,
} from "@/app/types/models/invoice";

import { formatToMoneyWithCurrency as formatCurrency } from "@/lib/helpers/formatters.helpers";

export const getColumns = (
  currencyData: InvoiceCurrencyType
): ColumnsType<InvoiceItemType> => [
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    onHeaderCell: () => {
      return {
        style: {
          backgroundColor: "#d9d1cb",
          color: "#0b3746",
        },
      };
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    onHeaderCell: () => {
      return {
        style: {
          backgroundColor: "#d9d1cb",
          color: "#0b3746",
        },
      };
    },
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    onHeaderCell: () => {
      return {
        style: {
          backgroundColor: "#d9d1cb",
          color: "#0b3746",
        },
      };
    },
    render: (text, record) =>
      `${record?.quantity?.value}
      ${record?.quantity?.type !== "fixed" ? `${record?.quantity?.type}${record?.quantity?.value > 1 ? "s" : ""}` : ""}`,
  },
  {
    title: "Price Per Unit",
    dataIndex: "unitPrice",
    key: "unitPrice",
    onHeaderCell: () => {
      return {
        style: {
          backgroundColor: "#d9d1cb",
          color: "#0b3746",
        },
      };
    },
    render: (text, record) => (
      <>
        {formatCurrency(record?.unitPrice)}

        {record?.quantity?.type !== "fixed"
          ? ` per ${record?.quantity?.type}`
          : " "}
      </>
    ),
  },
  {
    title: "Sub Total",
    dataIndex: "unitPrice",
    key: "unitPrice",
    onHeaderCell: () => {
      return {
        style: {
          backgroundColor: "#d9d1cb",
          color: "#0b3746",
        },
      };
    },
    render: (text, record) => <>{formatCurrency(record?.total || 0)}</>,
  },
];
