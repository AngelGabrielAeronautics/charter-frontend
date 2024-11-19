"use client";

import React from "react";

import { Calendar as AntCalendar } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";

const Calendar = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  };
  return <AntCalendar onPanelChange={onPanelChange} />;
};

export default Calendar;
