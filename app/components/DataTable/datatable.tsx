import React, { useState } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Table,
  TableColumnType,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";

import { useAppDispatch } from "@/lib/state/hooks";

interface IProps {
  data: any[]; // Array of data objects
  title: string; // Title for the table header
  createThunk: any; // Async thunk to dispatch on create form submit
  updateThunk: any; // Async thunk to dispatch on update form submit
}

const getSingularTitle = (title: string) => {
  if (title.endsWith("s")) {
    return title.slice(0, -1); // Remove the final 's' for plural words
  }
  return title; // Return the same if it's already singular
};

// Utility function to format both camelCase and underscore_separated strings
const formatLabel = (label: string) => {
  return label
    .replace(/([A-Z])/g, " $1") // Handle camelCase (insert spaces before capital letters)
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

// Utility function to format different types of values
const formatValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(", "); // Format arrays as a comma-separated list
  } else if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2); // Format objects as JSON strings
  } else if (typeof value === "boolean") {
    return value ? "Yes" : "No"; // Handle boolean values
  } else if (value === null || value === undefined) {
    return "N/A"; // Handle null/undefined
  } else {
    return value.toString().replace(/_/g, " "); // Default to string conversion
  }
};

// Utility function to check if a value is a valid date string
const isDateString = (value: string) => {
  return moment(value, moment.ISO_8601, true).isValid();
};

// Utility function to check if a value is a time representation (HH:mm format)
const isTimeString = (value: string) => {
  return moment(value, "HH:mm", true).isValid();
};

// Check if the key indicates a date-related value (e.g., contains "Date")
const isDateKey = (key: string) => {
  return /date/i.test(key); // Matches any key containing "Date"
};

// Check if the key indicates a time-related value (e.g., contains "Time")
const isTimeKey = (key: string) => {
  return /time/i.test(key); // Matches any key containing "Time"
};

// Check if the key indicates a price-related value (e.g., contains "Price", "Cost", etc.)
const isCurrencyKey = (key: string) => {
  return /price|cost|amount|total/i.test(key); // Case-insensitive match for price-related keys
};

// Utility function to format currency values
const formatCurrency = (value: number | undefined) => {
  if (value === undefined) {
    return ""; // Handle undefined case
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2, // Ensure 2 decimal places
    maximumFractionDigits: 2, // Ensure no more than 2 decimal places
  }).format(value);
};

const OriginalDataTable = ({
  data = [],
  title,
  createThunk,
  updateThunk,
}: IProps) => {
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [createRecord, setCreateRecord] = useState<any>(null);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [objectDetail, setObjectDetail] = useState<any>(null);
  const [objectDrawerVisible, setObjectDrawerVisible] = useState(false);
  const [objectDrawerTitle, setObjectDrawerTitle] = useState<string>("");

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  // Fallback if data is empty
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Inferring the columns and removing unwanted keys
  const unwantedKeys = ["__v"]; // Keys to remove
  const unwantedFormKeys = ["_id", "__v", "status", "auditFields"]; // Keys to remove

  const columns: TableColumnType<any>[] = Object.keys(data[0])
    .filter((key) => !unwantedKeys.includes(key))
    .map((key) => ({
      title: formatLabel(key),
      dataIndex: key,
      key,
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

        // Handle nested objects
        if (typeof value === "object" && value !== null) {
          return (
            <Button type="link" onClick={() => viewObjectDetails(key, value)}>
              <EyeOutlined /> View
            </Button>
          );
        }

        // Fallback for other values
        return value !== undefined && value !== null ? value.toString() : "";
      },
    }));

  // Add an extra column for actions like "Edit"
  columns.unshift({
    title: "Actions",
    key: "actions",
    render: (text: any, record: any) => (
      <Space>
        <EditOutlined onClick={() => openEditDrawer(record)} />
        <DeleteOutlined onClick={() => {}} />
      </Space>
    ),
  });

  const openCreateDrawer = () => {
    // form.setFieldsValue(formattedRecord) // Set form fields with formatted values
    setCreateDrawerVisible(true);
  };

  const openEditDrawer = (record: any) => {
    setEditRecord(record);

    // form.setFieldsValue(formattedRecord) // Set form fields with formatted values
    setEditDrawerVisible(true);
  };

  const closeEditDrawer = () => {
    setEditDrawerVisible(false);
    setEditRecord(null);
    form.resetFields();
  };

  const closeCreateDrawer = () => {
    setCreateDrawerVisible(false);
    setCreateRecord(null);
    form.resetFields();
  };

  const renderEditFormFields = (record: any) => {
    if (!record) {
      return <p>No data available</p>; // Gracefully handle missing record
    }

    return Object.keys(record)
      .filter((key) => !unwantedFormKeys.includes(key)) // Filter out unwanted keys
      .map((key) => {
        const value = record[key]; // Get the value from the record
        let inputComponent;

        // Handle InputNumber for numeric values
        if (isCurrencyKey(key) && typeof value === "number") {
          inputComponent = (
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => formatCurrency(value ?? 0)}
              parser={(value: any) => value.replace(/\$\s?|,/g, "")}
              addonBefore="$"
            />
          );

          // Handle DatePicker for date-like fields
        } else if (
          (isDateKey(key) || isDateString(value)) &&
          dayjs(value).isValid()
        ) {
          inputComponent = (
            <DatePicker
              showTime
              style={{ width: "100%" }}
              value={dayjs(value)}
            />
          );

          // Handle TimePicker for time-like fields
        } else if (
          (isTimeKey(key) || isTimeString(value)) &&
          dayjs(value, "HH:mm").isValid()
        ) {
          inputComponent = (
            <TimePicker
              style={{ width: "100%" }}
              value={dayjs(value, "HH:mm")}
            />
          );

          // Handle Switch for boolean values
        } else if (typeof value === "boolean") {
          inputComponent = (
            <Switch
              checked={value}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          );

          // Handle Input for string values
        } else if (typeof value === "string") {
          inputComponent = <Input style={{ width: "100%" }} value={value} />;

          // Fallback for other types
        } else {
          inputComponent = <Input style={{ width: "100%" }} value={value} />;
        }

        return (
          <Form.Item
            key={key}
            name={key}
            label={formatLabel(key)}
            style={{ width: "100%" }}
          >
            {inputComponent}
          </Form.Item>
        );
      });
  };

  // Dynamically render form fields based on the data type
  const renderCreateFormFields = () => {
    return Object.keys(data[0] as Record<string, any>)
      .filter((key) => !unwantedFormKeys.includes(key)) // Filter out unwanted keys
      .map((key) => {
        const value = data[0][key];
        let inputComponent;

        // Handle InputNumber for numeric values
        if (isCurrencyKey(key) && typeof value === "number") {
          inputComponent = (
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => formatCurrency(value ?? 0)}
              parser={(value: any) => value.replace(/\$\s?|,/g, "")}
              addonBefore="$"
            />
          );

          // Handle DatePicker for date-like fields
        } else if (
          (isDateKey(key) || isDateString(value)) &&
          dayjs(value).isValid()
        ) {
          inputComponent = (
            <DatePicker
              showTime
              style={{ width: "100%" }}
              value={dayjs(value)}
            />
          );

          // Handle TimePicker for time-like fields
        } else if (
          (isTimeKey(key) || isTimeString(value)) &&
          dayjs(value, "HH:mm").isValid()
        ) {
          inputComponent = (
            <TimePicker
              style={{ width: "100%" }}
              value={dayjs(value, "HH:mm")}
            />
          );

          // Handle Switch for boolean values
        } else if (typeof value === "boolean") {
          inputComponent = (
            <Switch
              checked={value}
              checkedChildren="Yes"
              unCheckedChildren="No"
            />
          );

          // For other string values, use a simple Input
        } else if (typeof value === "string") {
          inputComponent = <Input style={{ width: "100%" }} value={value} />;

          // Fallback for unknown or non-specific types
        } else {
          inputComponent = <Input style={{ width: "100%" }} value={value} />;
        }

        return (
          <Form.Item
            key={key}
            name={key}
            label={formatLabel(key)}
            style={{ width: "100%" }}
          >
            {inputComponent}
          </Form.Item>
        );
      });
  };

  // Handle object detail view in drawer
  const viewObjectDetails = (column: string, objectData: any) => {
    setObjectDetail(objectData);
    setObjectDrawerTitle(formatLabel(column)); // Set drawer title using column name
    setObjectDrawerVisible(true);
  };

  // Submit handling (create or update)
  const handleSubmit = (values: any) => {
    // Format date fields before submission
    const formattedValues = {
      ...values,
      ...Object.keys(values).reduce(
        (acc: { [key: string]: any }, key: string) => {
          if (isDateKey(key) && values[key]) {
            acc[key] = values[key].toISOString(); // Convert date to ISO string
          } else if (isTimeKey(key) && values[key]) {
            acc[key] = values[key].format("HH:mm"); // Convert time to HH:mm format
          }
          return acc;
        },
        {}
      ),
    };

    if (editRecord) {
      dispatch(updateThunk({ ...editRecord, ...formattedValues }));
      form.resetFields();
      closeEditDrawer();
    } else {
      dispatch(createThunk(formattedValues));
      form.resetFields();
      closeCreateDrawer();
    }
  };

  return (
    <div>
      {/* Table Header */}
      <Flex justify="space-between" align="bottom" className="mb-2">
        <section>
          <h2 className="mb-0 pb-0">{title}</h2>
        </section>
        <section>
          <Button type="primary" onClick={() => openCreateDrawer()}>
            <PlusOutlined />
          </Button>
        </section>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />

      {/* Create Drawer */}
      <Drawer
        title={`Create ${getSingularTitle(title)}`}
        width={600}
        onClose={closeCreateDrawer}
        open={createDrawerVisible}
        extra={
          <Space>
            <Button onClick={closeCreateDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Create
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {renderCreateFormFields()}
        </Form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        title={`Edit ${getSingularTitle(title)}`}
        width={600}
        onClose={closeEditDrawer}
        open={editDrawerVisible}
        extra={
          <Space>
            <Button onClick={closeEditDrawer}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Update
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {renderEditFormFields(editRecord)}{" "}
          {/* Use record-specific rendering */}
        </Form>
      </Drawer>

      {/* Drawer for viewing object details */}
      <Drawer
        title={objectDrawerTitle}
        width={600}
        onClose={() => setObjectDrawerVisible(false)}
        open={objectDrawerVisible}
      >
        <Descriptions column={1} bordered>
          {objectDetail &&
            Object.keys(objectDetail).map((key) => (
              <Descriptions.Item label={formatLabel(key)} key={key}>
                {isDateKey(key) && isDateString(objectDetail[key])
                  ? moment(objectDetail[key]).format("YYYY-MM-DD HH:mm:ss") // Format as date-time string
                  : isTimeKey(key) && isTimeString(objectDetail[key])
                    ? moment(objectDetail[key], "HH:mm").format("HH:mm") // Format as time string
                    : formatValue(objectDetail[key])}{" "}
                {/* Use formatValue as a fallback */}
              </Descriptions.Item>
            ))}
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default OriginalDataTable;
