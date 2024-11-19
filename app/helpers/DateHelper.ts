import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
// load on demand
import localizedFormat from "dayjs/plugin/localizedFormat";
// load on demand
import relativeTime from "dayjs/plugin/relativeTime";

// load on demand

dayjs.extend(localizedFormat);
dayjs.extend(AdvancedFormat); // use plugin
dayjs.extend(relativeTime); // use plugin

export const getDateObject = (dateObject?: string | dayjs.Dayjs) => {
  if (dateObject) return dayjs(dateObject);
  return dayjs();
};

export const getCurrentMonthDate = (date: number, format = "MMM DD,YYYY") => {
  if (date) return dayjs().date(date).format(format);

  return dayjs().format(format);
};

export const getFormattedDate = (
  dateObject?: string | dayjs.Dayjs,
  format = "MMM DD,YYYY"
) => {
  if (dateObject) return dayjs(dateObject).format(format);
  return "";
};

export const getFormattedDateTime = (
  value = 0,
  unit = "days",
  format = "MMM DD,YYYY"
) => {
  if (value === 0) {
    return dayjs().format(format);
  } else {
    // @ts-ignore
    return dayjs().add(value, unit).format(format);
  }
};

export const timeFromNow = (date: string) => {
  const timestamp = dayjs(date).format("X");
  const newDate = dayjs.unix(Number(timestamp));
  return dayjs(newDate).fromNow();
};

export const getTimeFromNow = (date: string) => {
  const timestamp = dayjs(date).format("X");
  const newDate = dayjs.unix(Number(timestamp));
  return dayjs(newDate).fromNow();
};
