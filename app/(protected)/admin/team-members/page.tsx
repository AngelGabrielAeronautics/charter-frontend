"use client";

import React, { useEffect, useState } from "react";

import { Button, Divider } from "antd";

import { PageHeader } from "@/app/components";
import DataTable from "@/app/components/DataTable";
import CreateFlightDrawer from "@/app/components/Drawers/CreateFlightDrawer";
import CreateUserDrawer from "@/app/components/Drawers/CreateUser";
import CreateUserRole from "@/app/components/Drawers/RolesAndPermissions/CreateUserRole";

import { fetchFlights } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { fetchUsers, filter } from "@/lib/state/users/users.slice";

const AdminTeamMembers = () => {
  const [inviteMemberDrawer, setInviteMemberDrawer] = useState(false);
  const [createMemberRoleDrawer, setCreateMemberRoleDrawer] = useState(false);

  const { users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(filter({ role: "Administrator" }));
    return () => {};
  }, [dispatch]);

  const onCloseCreateDrawer = () => {
    setInviteMemberDrawer(false);
  };

  const createDrawerConfig = {
    isOpen: inviteMemberDrawer,
    openDrawer: () => {
      setInviteMemberDrawer(true);
    },
    closeDrawer: () => {
      setInviteMemberDrawer(false);
    },
    drawer: (
      <CreateUserDrawer
        onClose={onCloseCreateDrawer}
        open={inviteMemberDrawer}
      />
    ),
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

  return (
    <div>
      <PageHeader
        title="Team Members"
        subtitle="Get an overview of all your team members here"
      />
      <Divider />
      <DataTable
        title="Team Members"
        data={users}
        customCreateDrawer={createDrawerConfig}
        additionalActions={actions}
        hiddenColumns={["provider", "fid", "__v"]}
      />
      <CreateUserRole
        open={createMemberRoleDrawer}
        onClose={() => setCreateMemberRoleDrawer(false)}
      />
    </div>
  );
};

export default AdminTeamMembers;
