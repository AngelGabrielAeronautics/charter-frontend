import React from "react";

import { Col, DatePicker, Input, InputNumber, Select, Table } from "antd";
import dayjs from "dayjs";
import { AiOutlinePlus } from "react-icons/ai";
import { GrClose } from "react-icons/gr";

import AppRowContainer from "@/app/components/AppRowContainer";
import { getFormattedDate } from "@/app/helpers/DateHelper";
import {
  InvoiceCurrencyType,
  InvoiceItemType,
} from "@/app/types/models/invoice";

import { formatToMoneyWithCurrency as formatCurrency } from "@/lib/helpers/formatters.helpers";

import { currencyList, quantityType } from "../data";
import {
  StyledAddItem,
  StyledCloseBtn,
  StyledFlexWrapper,
  StyledSecondary,
  StyledSecondaryText,
} from "./index.styled";

const { Column, ColumnGroup } = Table;

const today = dayjs().format("DD MMM YYYY");

type Props = {
  items: InvoiceItemType[];
  taxTypeData: string;
  taxRateData: number;
  currencyData: InvoiceCurrencyType;
  setCurrencyData: (data: InvoiceCurrencyType) => void;
  setItems: (data: InvoiceItemType[]) => void;
  setTaxTypeData: (data: string) => void;
  setTaxRateData: (data: number) => void;
};
const EditInvoiceTable = ({
  items,
  taxTypeData,
  taxRateData,
  currencyData,
  setCurrencyData,
  setItems,
  setTaxTypeData,
  setTaxRateData,
}: Props) => {
  const onChangeLineItems = (
    index: number,
    key: string,
    value: any,
    nestedKey?: string
  ) => {
    const newItems = [...items];
    if (nestedKey) {
      if (nestedKey === "duration")
        value = getFormattedDate(value, "DD MMM YYYY");
      newItems[index] = {
        ...newItems[index],
        [nestedKey]: {
          ...newItems[index][nestedKey as "duration" | "quantity"],
          [key]: value,
        },
      };
    } else {
      newItems[index] = { ...newItems[index], [key]: value };
    }
    setItems(newItems);
  };

  const onDeleteLineItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
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
      <Table dataSource={items} pagination={false}>
        <ColumnGroup>
          <Column title="Pos" dataIndex="id" key="id" />
          <Column
            title="Task Name"
            dataIndex="name"
            key="name"
            render={(name, record, index) => (
              <Input
                autoFocus
                value={name || ""}
                placeholder="Name"
                onChange={(e) =>
                  onChangeLineItems(index, "name", e.target.value)
                }
              />
            )}
          />
          <Column
            title="Duration"
            dataIndex="duration"
            key="duration"
            render={(duration, record: InvoiceItemType, index) => (
              <div style={{ display: "flex", whiteSpace: "inherit" }}>
                <DatePicker.RangePicker
                  value={[
                    dayjs(record?.duration?.from),
                    dayjs(record?.duration?.to),
                  ]}
                  placeholder={["From", "To"]}
                  onChange={(value) => {
                    if (value) {
                      onChangeLineItems(index, "from", value[0], "duration");
                      onChangeLineItems(index, "to", value[1], "duration");
                    }
                  }}
                  format="DD MMM YYYY"
                  clearIcon={false}
                />
              </div>
            )}
          />
          <Column
            title="Quantity"
            dataIndex="quantity"
            key="quantity"
            render={(quantity, record: InvoiceItemType, index) => (
              <div style={{ display: "flex" }}>
                <InputNumber
                  style={{ minWidth: 50 }}
                  value={record?.quantity?.value}
                  placeholder="Value"
                  onChange={(value) => {
                    onChangeLineItems(index, "value", value, "quantity");
                    onChangeLineItems(
                      index,
                      "total",
                      value || 0 * record?.unitPrice || 0
                    );
                  }}
                />
                <Select
                  style={{ marginLeft: 10 }}
                  value={record?.quantity?.type}
                  onChange={(value) => {
                    onChangeLineItems(index, "type", value, "quantity");
                  }}
                >
                  {quantityType.map((quantity) => {
                    return (
                      <Select.Option
                        value={quantity.value}
                        key={quantity.value}
                      >
                        {quantity.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            )}
          />
          <Column
            title="Price Per Unit"
            dataIndex="unitPrice"
            key="unitPrice"
            render={(unitPrice, record: InvoiceItemType, index) => (
              <InputNumber
                value={record?.unitPrice || 0}
                placeholder="Unit Price"
                onChange={(value) => {
                  onChangeLineItems(index, "unitPrice", value);
                  onChangeLineItems(
                    index,
                    "total ",
                    value || 0 * record?.quantity?.value || 0
                  );
                }}
              />
            )}
          />
          <Column
            title="Sub Total"
            dataIndex="total"
            key="total"
            render={(total, record: InvoiceItemType, index) => (
              <div
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                {formatCurrency(record?.total || 0)}
                <StyledCloseBtn onClick={() => onDeleteLineItem(index)}>
                  <GrClose size={15} />
                </StyledCloseBtn>
              </div>
            )}
          />
        </ColumnGroup>
      </Table>

      <AppRowContainer gutter={2} style={{ marginTop: 40 }}>
        <Col xs={24} md={12}>
          <StyledAddItem
            onClick={() =>
              setItems([
                ...items,
                {
                  id: items.length + 1,
                  duration: { from: today, to: today },
                  quantity: {
                    type: "fixed",
                    value: 1,
                  },
                } as InvoiceItemType,
              ])
            }
          >
            <AiOutlinePlus size={18} />
            <div style={{ marginLeft: 6, fontSize: 16 }}>Add Item</div>
          </StyledAddItem>
        </Col>
        <Col xs={24} md={10} style={{ marginLeft: "auto", marginRight: 40 }}>
          <StyledSecondary>
            <div style={{ marginRight: 28, width: "100%" }}>Subtotal:</div>
            <div>{formatCurrency(getTotal())}</div>
          </StyledSecondary>
          {taxTypeData === "cgst_sgst" && (
            <>
              <StyledSecondary>
                <div style={{ width: "50%" }} />
                <div style={{ marginLeft: 16, width: "50%" }}> CGST:</div>
                <div>
                  {formatCurrency((getTotal() * (taxRateData * 0.01)) / 2)}
                </div>
              </StyledSecondary>
              <StyledSecondary>
                <div style={{ width: "50%" }} />
                <div style={{ marginLeft: 16, width: "50%" }}> SGST:</div>
                <div>
                  {formatCurrency((getTotal() * (taxRateData * 0.01)) / 2)}
                </div>
              </StyledSecondary>
            </>
          )}
          <StyledSecondary>
            <div style={{ marginRight: 24, width: "50%" }}>Total:</div>
            <Select
              style={{ marginRight: 24, width: "50%" }}
              value={currencyData.currency}
              onChange={(value) => {
                const type = currencyList.find(
                  (item) => item.currency === value
                );
                if (type) setCurrencyData(type);
              }}
            >
              {currencyList.map((quantity) => {
                return (
                  <Select.Option
                    value={quantity.currency}
                    key={quantity.currency}
                  >
                    {quantity.currency}
                  </Select.Option>
                );
              })}
            </Select>
            <div>{formatCurrency(getTotal() * (1 - taxRateData * 0.01))}</div>
          </StyledSecondary>
        </Col>
      </AppRowContainer>
    </>
  );
};

export default EditInvoiceTable;
