"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { CalendarOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";

import PageHeader from "@/app/components/PageHeader";

import CalanderComponet from "../../../../components/calendar";

const CalendarPage = () => {
  const router = useRouter();
  const pageActions = [
    <Button
      type="primary"
      ghost
      icon={<CalendarOutlined />}
      key="2"
      onClick={() => router.back()}
    >
      View KPIS
    </Button>,
  ];
  return (
    <div className="space-y-10">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Get an overview of all flights here"
        actions={pageActions}
      />
      <CalanderComponet />
    </div>
  );
};

export default CalendarPage;
