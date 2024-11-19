"use client";

import React, { useEffect, useState } from "react";

import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";

import { IFileInfo } from "@/lib/models/file.model";
import { useAppSelector } from "@/lib/state/hooks";

import UploadFileInfoDrawer from "../Drawers/FileDrawer";

const CertificationsSection = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>();
  const [certifications, setCertifications] = useState<IFileInfo[]>([]);

  const { currentOperator } = useAppSelector((state) => state.operators);

  const columns = [
    {
      title: "Document Name",
      dataIndex: "documentName",
      key: "documentName",
    },
    {
      title: "Date Uploaded",
      dataIndex: "dateUploaded",
      key: "dateUploaded",
    },
    {
      title: "Document Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <UploadOutlined
            style={{ fontSize: "16px" }}
            onClick={() => {
              setSelectedDocument(record.documentName);
              if (record.documentName === "Air Operating Certificate")
                setSelectedKey("certifications.airOperatingCertificate");
              if (record.documentName === "Certificate of Insurance")
                setSelectedKey("certifications.certificateOfInsurance");
              if (record.documentName === "Certificate of Air Worthiness")
                setSelectedKey("certifications.certificateOfAirworthiness");
              setDrawerOpen(true);
            }}
          />
          <DownloadOutlined
            onClick={() => handleDownload(record._id)}
            style={{ fontSize: "16px" }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (currentOperator) {
      const _certifications = [];

      const AOC = currentOperator.certifications?.airOperatingCertificate;
      const COFI = currentOperator.certifications?.certificateOfInsurance;
      const COFA = currentOperator.certifications?.certificateOfAirworthiness;

      if (AOC) {
        _certifications.push(AOC);
      } else {
        _certifications.push({
          documentName: "Air Operating Certificate",
          status: "Not Uploaded",
          expirationDate: null,
          dateUploaded: null,
        });
      }
      if (COFI) {
        _certifications.push(COFI);
      } else {
        _certifications.push({
          documentName: "Certificate of Insurance",
          status: "Not Uploaded",
          expirationDate: null,
          dateUploaded: null,
        });
      }
      if (COFA) {
        _certifications.push(COFA);
      } else {
        _certifications.push({
          documentName: "Certificate of Airworthiness",
          status: "Not Uploaded",
          expirationDate: null,
          dateUploaded: null,
        });
      }

      // setCertifications(_certifications)
    }
    return () => {};
  }, [currentOperator]);

  const handleDownload = (id: string) => {};

  return (
    <section className="certifications-section">
      <Table dataSource={certifications} columns={columns} pagination={false} />
      {selectedDocument && selectedKey && (
        <UploadFileInfoDrawer
          modelKey={selectedKey}
          documentName={selectedDocument}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </section>
  );
};

export default CertificationsSection;
