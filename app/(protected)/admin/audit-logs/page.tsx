"use client";

import React, { useEffect, useState } from "react";

import { Divider, TableColumnType } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";

import { findAll } from "@/lib/state/auditLogs/auditlog.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";

const AuditLogs = () => {
  const { records = [] } = useAppSelector((state) => state.auditLogs);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findAll());
    return () => {};
  }, []);

  const columns: TableColumnType<any>[] = [];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Get an overview of all the audit logs here"
      />
      <Divider />
      <DataTable
        title="Audit Logs"
        data={records}
        canCreate={false}
        canEdit={false}
        customColumns={columns}
      />
    </div>
  );
};

export default AuditLogs;
