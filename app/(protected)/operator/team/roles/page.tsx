"use client";

import React, { useEffect, useState } from "react";

import { Button, Divider, Modal } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import CreateUserDrawer from "@/app/components/Drawers/CreateUser";
import CreateUserRole from "@/app/components/Drawers/RolesAndPermissions/CreateUserRole";
import CreatePermission from "@/app/components/Drawers/RolesAndPermissions/createPermission";
import EditPermission from "@/app/components/Drawers/RolesAndPermissions/editPermission";

import { fetchFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import {
  findByOrganisation,
  getApplicationModules,
  remove,
} from "@/lib/state/slices/role-permission.slice";
import { fetchUsers, filter } from "@/lib/state/users/users.slice";

const OperatorRolesAndPermissions = () => {
  const [inviteMemberDrawer, setInviteMemberDrawer] = useState(false);
  const [createMemberRoleDrawer, setCreateMemberRoleDrawer] = useState(false);

  const { records } = useAppSelector((state) => state.rolePermissionState);
  const { currentOperator } = useAppSelector((state) => state.operators);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findByOrganisation(currentOperator?._id!));
    dispatch(getApplicationModules());
    return () => {};
  }, [dispatch, currentOperator]);

  const onCloseCreateDrawer = () => {
    setInviteMemberDrawer(false);
  };

  const actions = [
    <Button
      type="default"
      key="openAddRoleDrawer"
      onClick={() => setCreateMemberRoleDrawer(true)}
    >
      Add Role
    </Button>,
  ];

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const createDrawer = {
    isOpen: createDrawerOpen,
    openDrawer: () => setCreateDrawerOpen(true),
    closeDrawer: () => setCreateDrawerOpen(false),
    drawer: (
      <CreatePermission
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
      />
    ),
  };

  const editDrawer = {
    isOpen: editDrawerOpen,
    openDrawer: () => setEditDrawerOpen(true),
    closeDrawer: () => setEditDrawerOpen(false),
    drawer: (
      <EditPermission
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
      />
    ),
  };

  const deleteRecord = (recordId: string) => {
    const record = records.find((item) => item._id == recordId);
    if (record) {
      Modal.confirm({
        title: "Delete Role",
        content: "Are you sure you want to delete this role?",
        onOk: () => {
          dispatch(remove(recordId));
        },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Get an overview of all your roles here"
      />
      <Divider />
      <DataTable
        title="Company Roles"
        data={records}
        customCreateDrawer={createDrawer}
        customEditDrawer={editDrawer}
        canEdit={true}
        canDelete={true}
        onRowDelete={deleteRecord}
      />
    </div>
  );
};

export default OperatorRolesAndPermissions;
