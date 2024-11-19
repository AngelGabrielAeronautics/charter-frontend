// /DataTable/utilities.ts
import dayjs from "dayjs";
import moment from "moment";

// Inferring the columns and removing unwanted keys
export const unwantedKeys = ["__v"]; // Keys to remove
export const unwantedFormKeys = ["_id", "__v", "status", "auditFields"]; // Keys to remove

// Statuses
export const negativeStatuses = [
  "cancelled",
  "rejected",
  "failed",
  "declined",
  "withdrawn",
  "refused",
  "terminated",
  "expired",
  "refunded",
];
export const positiveStatuses = [
  "approved",
  "successful",
  "completed",
  "confirmed",
  "granted",
  "finished",
  "done",
  "resolved",
  "ready",
  "paid",
];
export const neutralStatuses = [
  "in progress",
  "pending",
  "on hold",
  "processing",
  "waiting",
  "under review",
  "open",
  "draft",
  "due",
  "offered",
  "on offer",
  "for sale",
  "invoiced",
];
export const warningStatuses = [
  "warning",
  "error",
  "delayed",
  "paused",
  "blocked",
  "incomplete",
  "overdue",
  "quoted",
];

// Utility to get the singular form of a title
export const getSingularTitle = (title: string) => {
  return title.endsWith("s") ? title.slice(0, -1) : title;
};

// Utility to format labels from camelCase or underscore_separated strings
export const formatLabel = (label: string) => {
  return label
    .replace(/([A-Z])/g, " $1") // Split camelCase with spaces
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
};

// Utility to format various value types (arrays, booleans, objects, etc.)
export const formatValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  } else if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  } else if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  } else if (value === null || value === undefined) {
    return "N/A";
  } else {
    return value.toString().replace(/_/g, " "); // Handle regular string values
  }
};

// Utility to format currency values
export const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Utility to check if a value is a valid date string
export const isDateString = (value: string) => {
  return moment(value, moment.ISO_8601, true).isValid();
};

// Utility to check if a value is a valid time string (HH:mm format)
export const isTimeString = (value: string) => {
  return moment(value, "HH:mm", true).isValid();
};

// Utility to check if a key indicates a date-related field (e.g., contains "Date")
export const isDateKey = (key: string) => {
  return /date/i.test(key);
};

// Utility to check if a key indicates a time-related field (e.g., contains "Time")
export const isTimeKey = (key: string) => {
  return /time/i.test(key);
};

// Utility to check if a key indicates a currency-related field (e.g., contains "Price", "Cost", "Amount")
export const isCurrencyKey = (key: string) => {
  return /price|cost|amount|total/i.test(key);
};

// Utility to format date strings for display in the table
export const formatDateString = (value: string) => {
  return dayjs(value).isValid()
    ? dayjs(value).format("YYYY-MM-DD HH:mm:ss")
    : value;
};

// Utility to format time strings for display in the table
export const formatTimeString = (value: string) => {
  return dayjs(value, "HH:mm").isValid() ? dayjs(value).format("HH:mm") : value;
};

// Utility to checks if a string is valid JSON
export const isValidJsonString = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};
