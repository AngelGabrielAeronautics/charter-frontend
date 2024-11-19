// /DataTable/renderers.tsx
import React from "react";

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
  TableColumnType,
  Tag,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";

import { IFile } from "@/lib/models/file.model";

import {
  formatCurrency,
  formatDateString,
  formatLabel,
  formatTimeString,
  isCurrencyKey,
  isDateKey,
  isDateString,
  isTimeKey,
  isTimeString,
  isValidJsonString,
  negativeStatuses,
  neutralStatuses,
  positiveStatuses,
  unwantedKeys,
  warningStatuses,
} from "./utilities";

interface RecordType {
  [key: string]: any;
}

export const renderColumns = (
  data: RecordType[],
  customColumns: TableColumnType<any>[],
  visibleColumns: string[],
  setEditRecord: (record: RecordType) => void,
  setEditDrawerVisible: (visible: boolean) => void,
  viewObjectDetails: (column: string, value: any) => void,
  viewImages: (files: IFile[]) => void,
  hiddenColumns: string[]
): TableColumnType<RecordType>[] => {
  const defaultColumns: TableColumnType<any>[] = Object.keys(data[0])
    .filter((key) => !unwantedKeys.includes(key))
    .filter((key) => !hiddenColumns.includes(key))
    .filter((key) => visibleColumns.includes(key)) // Filter by visible columns
    .map((key) => ({
      title: formatLabel(key),
      dataIndex: key,
      key,
      sorter: (a: RecordType, b: RecordType) => {
        const aValue = a[key];
        const bValue = b[key];

        if (typeof aValue === "object" && typeof bValue === "object") {
          return 0; // Skip sorting for object values
        }

        // Handle currency sorting
        if (isCurrencyKey(key)) {
          return aValue - bValue;
        }

        // Handle date sorting
        if (isDateString(aValue) && isDateString(bValue)) {
          return dayjs(aValue).isBefore(dayjs(bValue)) ? -1 : 1;
        }

        // Handle time sorting
        if (isTimeString(aValue) && isTimeString(bValue)) {
          return moment(aValue, "HH:mm").isBefore(moment(bValue, "HH:mm"))
            ? -1
            : 1;
        }

        // Handle number and string sorting
        if (typeof aValue === "number" && typeof bValue === "number") {
          return aValue - bValue;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        }

        return 0; // Fallback for other types
      },
      render: (value: any, record: any) => {
        // Handle currency values
        if (isCurrencyKey(key) && typeof value === "number") {
          return formatCurrency(value); // Format as currency
        }

        // Handle date strings
        if (isDateString(value)) {
          return moment(value).format("YYYY-MM-DD HH:mm:ss"); // Format as date-time string
        }

        // Handle time strings
        if (isTimeString(value)) {
          return moment(value, "HH:mm").format("HH:mm"); // Format as time string
        }

        if (typeof value === "boolean") {
          return <Tag>{value ? "Yes" : "No"}</Tag>;
        }

        if (key.toLowerCase() == "status") {
          return (
            <Tag
              color={
                negativeStatuses.includes(value.toLowerCase())
                  ? "error"
                  : positiveStatuses.includes(value.toLowerCase())
                    ? "success"
                    : neutralStatuses.includes(value.toLowerCase())
                      ? "blue"
                      : warningStatuses.includes(value.toLowerCase())
                        ? "warning"
                        : "default"
              }
            >
              {value}
            </Tag>
          );
        }

        let parsedValue = value;

        // Handle nested json strings
        // Check if the value is a JSON string and attempt to parse it
        if (typeof value === "string" && isValidJsonString(value)) {
          try {
            parsedValue = JSON.parse(value);
          } catch (e) {
            parsedValue = value; // If parsing fails, treat it as a normal string
          }
        }

        // Case 1: Check if the parsed value is an array of IFile objects (with "data" and "mimetype")
        if (
          Array.isArray(parsedValue) &&
          parsedValue.length > 0 &&
          parsedValue.every((item) => item.data && item.mimetype)
        ) {
          return (
            <Button type="link" onClick={() => viewImages(parsedValue)}>
              <EyeOutlined /> View
            </Button>
          );
        }

        // Case 2: Handle nested JSON objects
        if (typeof value === "object" && value !== null) {
          return (
            <Button
              type="link"
              onClick={() => viewObjectDetails(key, parsedValue)}
            >
              <EyeOutlined /> View
            </Button>
          );
        }

        // Fallback for other values
        else
          return value !== undefined && value !== null ? value.toString() : "";
      },
    }));

  const finalColumns = customColumns
    ? [
        ...defaultColumns.filter(
          (col) => !customColumns.some((custom) => custom.key === col.key)
        ),
        ...customColumns,
      ]
    : defaultColumns;

  // Add an extra column for actions like "Edit"
  // columns.unshift({
  // 	title: "Actions",
  // 	key: "actions",
  // 	render: (text: any, record: any) => (
  // 		<Space>
  // 			<EditOutlined
  // 				onClick={() => {
  // 					setEditRecord(record)
  // 					setEditDrawerVisible(true)
  // 				}}
  // 			/>
  // 			<DeleteOutlined onClick={() => {}} />
  // 		</Space>
  // 	),
  // })

  return finalColumns;
};

export const renderFormFields = (record: RecordType | undefined) => {
  if (!record) return <p>No data available</p>;

  return Object.keys(record).map((key) => {
    const value = record[key];
    let inputComponent;

    if (isCurrencyKey(key) && typeof value === "number") {
      inputComponent = (
        <InputNumber
          style={{ width: "100%" }}
          value={value}
          formatter={formatCurrency}
        />
      );
    } else if (isDateKey(key) && dayjs(value).isValid()) {
      inputComponent = (
        <DatePicker showTime style={{ width: "100%" }} value={dayjs(value)} />
      );
    } else if (isTimeKey(key) && dayjs(value, "HH:mm").isValid()) {
      inputComponent = (
        <TimePicker style={{ width: "100%" }} value={dayjs(value, "HH:mm")} />
      );
    } else if (typeof value === "boolean") {
      inputComponent = <Switch checked={value} />;
    } else {
      inputComponent = <Input style={{ width: "100%" }} value={value} />;
    }

    return (
      <Form.Item key={key} name={key} label={formatLabel(key)}>
        {inputComponent}
      </Form.Item>
    );
  });
};
