"use client";

import { useEffect, useState } from "react";

import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";

import { useAppSelector } from "@/lib/state/hooks";

import UploadFileInfoDrawer from "../Drawers/FileDrawer";

const CertificationsSection = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>();
  const [selectedKey, setSelectedKey] = useState<string>();
  const [certifications, setCertifications] = useState<any[]>([]); // Updated to support table rows

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
      render: (value: string | null) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      title: "Document Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (value: string | null) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag
          color={
            value === "Not Uploaded" || value === "Expired" ? "red" : "green"
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <UploadOutlined
            style={{ fontSize: "16px", cursor: "pointer" }}
            onClick={() => {
              setSelectedDocument(record.documentName);
              if (record.documentName === "Air Operating Certificate")
                setSelectedKey("airOperatingCertificate");
              if (record.documentName === "Certificate of Insurance")
                setSelectedKey("certificateOfInsurance");
              if (record.documentName === "Certificate of Airworthiness")
                setSelectedKey("certificateOfAirworthiness");
              setDrawerOpen(true);
            }}
          />
          {record.data && (
            <DownloadOutlined
              onClick={() => handleDownload(record)}
              style={{ fontSize: "16px", cursor: "pointer" }}
            />
          )}
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

      // Add Air Operating Certificate
      _certifications.push(
        AOC
          ? {
              documentName: "Air Operating Certificate",
              dateUploaded: AOC.dateUploaded || null,
              expirationDate: AOC.expirationDate || null,
              status: AOC.expirationDate
                ? new Date(AOC.expirationDate) > new Date()
                  ? "Valid"
                  : "Expired"
                : "Valid",
              data: AOC,
            }
          : {
              documentName: "Air Operating Certificate",
              status: "Not Uploaded",
              expirationDate: null,
              dateUploaded: null,
              data: null,
            }
      );

      // Add Certificate of Insurance
      _certifications.push(
        COFI
          ? {
              documentName: "Certificate of Insurance",
              dateUploaded: COFI.dateUploaded || null,
              expirationDate: COFI.expirationDate || null,
              status: COFI.expirationDate
                ? new Date(COFI.expirationDate) > new Date()
                  ? "Valid"
                  : "Expired"
                : "Valid",
              data: COFI,
            }
          : {
              documentName: "Certificate of Insurance",
              status: "Not Uploaded",
              expirationDate: null,
              dateUploaded: null,
              data: null,
            }
      );

      // Add Certificate of Airworthiness
      _certifications.push(
        COFA
          ? {
              documentName: "Certificate of Airworthiness",
              dateUploaded: COFA.dateUploaded || null,
              expirationDate: COFA.expirationDate || null,
              status: COFA.expirationDate
                ? new Date(COFA.expirationDate) > new Date()
                  ? "Valid"
                  : "Expired"
                : "Valid",
              data: COFA,
            }
          : {
              documentName: "Certificate of Airworthiness",
              status: "Not Uploaded",
              expirationDate: null,
              dateUploaded: null,
              data: null,
            }
      );

      setCertifications(_certifications); // Set certifications for the table
    }
  }, [currentOperator]);

  const handleDownload = (record: any) => {
    if (!record.data?.file?.data) {
      console.error("No file data available");
      return;
    }

    const file = record.data.file;

    const link = document.createElement("a");
    link.href = `data:${file.mimetype};base64,${file.data}`;
    link.download = file.name || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="certifications-section">
      <Table
        dataSource={certifications}
        columns={columns}
        rowKey="documentName"
        pagination={false}
      />
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
