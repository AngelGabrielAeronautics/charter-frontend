"use client";

import React from "react";

import PageHeader from "@/app/components/PageHeader";

import AddAssetForm from "../../../../components/Assets/AddAsset";

const AddAssetPage = () => {
  return (
    <div>
      <PageHeader
        title="Create Asset"
        subtitle="Please fill out the form to create your aircraft"
      />
      <div className="mt-7">
        <AddAssetForm />
      </div>
    </div>
  );
};

export default AddAssetPage;
