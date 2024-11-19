"use client";

import React, { useEffect, useState } from "react";

import { Button, Divider, Modal } from "antd";

import {
  CreatePermissionDrawer,
  DataTable,
  EditPermissionDrawer,
  PageHeader,
} from "@/app/components";
import CreateUserDrawer from "@/app/components/Drawers/CreateUser";

import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { findByOrganisation } from "@/lib/state/slices/role-permission.slice";
import { findByOperator } from "@/lib/state/users/users.slice";

const OperatorTeamMembers = () => {
  const [inviteMemberDrawer, setInviteMemberDrawer] = useState(false);
  const [createMemberRoleDrawer, setCreateMemberRoleDrawer] = useState(false);

  const { records } = useAppSelector((state) => state.rolePermissionState);
  const { currentOperator } = useAppSelector((state) => state.operators);
  const { users } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findByOrganisation(currentOperator?._id!));
    dispatch(findByOperator(currentOperator?._id!));
    return () => {};
  }, [dispatch, currentOperator]);

  const onCloseCreateDrawer = () => {
    setInviteMemberDrawer(false);
  };

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const createDrawer = {
    isOpen: createDrawerOpen,
    openDrawer: () => setCreateDrawerOpen(true),
    closeDrawer: () => setCreateDrawerOpen(false),
    drawer: (
      <CreateUserDrawer
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
      <EditPermissionDrawer
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
          // dispatch(remove(recordId))
        },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Team Members"
        subtitle="Get an overview of all your Team Members here"
      />
      <Divider />
      <DataTable
        title="Team Members"
        data={users}
        customCreateDrawer={createDrawer}
        customEditDrawer={editDrawer}
        canEdit={true}
        canDelete={true}
        onRowDelete={deleteRecord}
        hiddenColumns={["provider", "fid", "__v"]}
      />
    </div>
  );
};

export default OperatorTeamMembers;
