import { useEffect, useState } from "react";

import {
  CloseOutlined,
  ColumnWidthOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
// Import the json2csv parser
import {
  Button,
  Checkbox,
  Drawer,
  Empty,
  Flex,
  Form,
  FormInstance,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
// CSV parser
import { Parser } from "json2csv";

import { IFile } from "@/lib/models/file.model";

import {
  renderCreateDrawer,
  renderDetailsDrawer,
  renderEditDrawer,
  renderImagesDrawer,
} from "./Drawers";
import { DataTableProps, RecordType } from "./props";
import { renderColumns } from "./renderers";
import { formatLabel } from "./utilities";

const DataTable = ({
  data = [],
  customCreateDrawer,
  customEditDrawer,
  canCreate = true,
  canEdit = true,
  canDelete = false,
  additionalActions = [],
  hiddenColumns = [],
  onRowClick,
  onRowDelete,
  customColumns = [],
  onSelectRow,
  canCancel = false,
  onCancel,
  onRowView,
}: DataTableProps) => {
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
  const [createDrawerVisible, setCreateDrawerVisible] =
    useState<boolean>(false);
  const [editRecord, setEditRecord] = useState<RecordType | null>(null);

  const [objectDetail, setObjectDetail] = useState<any>(null);
  const [objectDrawerVisible, setObjectDrawerVisible] = useState(false);
  const [objectDrawerTitle, setObjectDrawerTitle] = useState<string>("");

  const [imagesDrawerFiles, setImagesDrawerFiles] = useState<IFile[]>([]);
  const [imagesDrawerVisible, setImagesDrawerVisible] = useState(false);

  const [form] = Form.useForm<FormInstance>();

  // State for column visibility and column selection drawer
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    data && Object.keys(data[0] || {})
  ); // Initialize with all columns
  const [columnDrawerVisible, setColumnDrawerVisible] =
    useState<boolean>(false);

  // Track selected rows
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Track uploaded files
  const [fileList, setFileList] = useState<any[]>([]);
  const [importDrawerVisible, setImportDrawerVisible] = useState(false); // Drawer visibility state
  const [parsedImportData, setParsedImportData] = useState<any[]>([]); // Store parsed data from CSV

  // Initialize visibleColumns with all columns on component mount
  useEffect(() => {
    if (data.length > 0) {
      setVisibleColumns(Object.keys(data[0])); // Select all columns by default
    }
  }, [data]);

  // Toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  // Toggle column visibility

  // Fallback if data is empty
  // if (!data || data.length === 0) {
  // 	return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  // }

  // Close create drawer and reset form
  const closeCreateDrawer = () => {
    setCreateDrawerVisible(false);
    form.resetFields();
  };

  // Close edit drawer and reset form
  const closeEditDrawer = () => {
    setEditDrawerVisible(false);
    form.resetFields();
  };

  // Handle form submission for both creating and updating records
  const handleSubmit = (values: RecordType) => {
    if (editRecord) {
      // dispatch(updateThunk({ ...editRecord, ...formattedValues }))
      closeEditDrawer();
    } else {
      // dispatch(createThunk(formattedValues))
      closeCreateDrawer();
    }
  };

  // Handle row selection changes
  const onSelectChange = (selectedRowKeys: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    onSelectRow &&
      selectedRowKeys.length === 1 &&
      onSelectRow(selectedRowKeys[0]);
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    fixed: true,
    onChange: onSelectChange
  };

  // Bulk delete action

  // Export selected rows to CSV
  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("No rows selected for export.");
      return;
    }

    const selectedData = data.filter((row) =>
      selectedRowKeys.includes(row.id || row._id || row.key)
    );

    try {
      const parser = new Parser(); // Create the json2csv parser
      const csv = parser.parse(selectedData); // Convert the selected data to CSV format

      // Create a blob and trigger the download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "exported_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Data exported successfully.");
    } catch (error) {
      message.error("Failed to export data.");
    }
  };

  // Handle object detail view in drawer
  const viewObjectDetails = (column: string, objectData: any) => {
    setObjectDetail(objectData);
    setObjectDrawerTitle(formatLabel(column)); // Set drawer title using column name
    setObjectDrawerVisible(true);
  };

  const viewImages = (files: IFile[]) => {
    setImagesDrawerFiles(files); // Set the files to display in the drawer
    setImagesDrawerVisible(true); // Open the drawer
  };

  // Handle file upload and parsing

  // Submit the parsed data after previewing
  const handleSubmitImportData = () => {
    try {
      // Dispatch the parsed data to the backend
      // dispatch(createThunk(parsedData)) // Replace with your appropriate dispatch
      message.success("Data submitted successfully.");
      setImportDrawerVisible(false); // Close the drawer
      setParsedImportData([]); // Clear the parsed data after submission
    } catch (error) {
      message.error("Failed to submit data.");
    }
  };

  const [page, setPage] = useState(1); // Current page number
  const [pageSize, setPageSize] = useState(10); // Number of items per page

  // Handle the page change and page size change
  const handleTableChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize) setPageSize(newPageSize);
  };

  return (
    <div>
      {/* Table Header with Create Button */}
      <Flex justify="space-between" align="bottom" className="mb-2">
        <section>{/* <h2 className='mb-0 pb-0'>{title}</h2> */}</section>
        <section>
          <Space>
            {data.length > 0 && (
              <Button
                type="default"
                onClick={() => setColumnDrawerVisible(true)}
              >
                <ColumnWidthOutlined />
              </Button>
            )}
            {/* <Upload
							accept='.csv' // Only accept CSV files for now
							beforeUpload={(file) => {
								handleFileUpload(file)
								return false // Prevent automatic upload
							}}
							fileList={fileList}
							onRemove={() => setFileList([])} // Clear the file list
						>
							<Button type='default'>
								<UploadOutlined />
							</Button>
						</Upload> */}
            {/* Bulk Delete Button */}
            {selectedRowKeys.length > 0 && (
              <>
                {/* <Button
									danger
									type='primary'
									// disabled={selectedRowKeys.length === 0} // Disable if no rows selected
									onClick={handleBulkDelete}>
									<DeleteOutlined />
								</Button> */}
                <Button
                  type="default"
                  disabled={selectedRowKeys.length === 0} // Disable if no rows are selected
                  onClick={handleExport} // Trigger the CSV export function
                >
                  <DownloadOutlined />
                </Button>
              </>
            )}
            {additionalActions && selectedRowKeys.length == 1 && additionalActions}
            {canCancel && selectedRowKeys.length == 1 && (
              <Tooltip title="Cancel">
                <Button
                  type="default"
                  onClick={() => {
                    onCancel && onCancel(selectedRowKeys[0]);
                  }}
                >
                  <CloseOutlined />
                </Button>
              </Tooltip>
            )}
            {canEdit && selectedRowKeys.length == 1 && (
              <Tooltip title="Edit">
                <Button
                  type="primary"
                  onClick={() => {
                    if (customEditDrawer) {
                      customEditDrawer.openDrawer(selectedRowKeys[0]);
                    } else {
                      setEditDrawerVisible(true);
                    }
                  }}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
            )}
            {canDelete && selectedRowKeys.length == 1 && (
              <Button
                danger
                type="primary"
                onClick={() => {
                  onRowDelete && onRowDelete(selectedRowKeys[0]);
                }}
              >
                <DeleteOutlined />
              </Button>
            )}
            {onRowView && selectedRowKeys.length == 1 && (
              <Button
                type="primary"
                onClick={() => {
                  onRowView &&
                    onRowView(
                      data.find((record) => record._id === selectedRowKeys[0])
                    );
                }}
              >
                <EyeOutlined />
              </Button>
            )}
            {canCreate && (
              <Button
                type="primary"
                onClick={() => {
                  if (customCreateDrawer) {
                    customCreateDrawer.openDrawer();
                  } else {
                    setCreateDrawerVisible(true);
                  }
                }}
              >
                <PlusOutlined />
              </Button>
            )}
          </Space>
        </section>
      </Flex>
      {/* Render Table */}
      {data.length > 0 ? (
        <Table
          onRow={(record, _index) => {
            return {
              onClick: () => {
                onRowClick && onRowClick(record);
              },
            };
          }}
          rowSelection={rowSelection} // Enable row selection
          columns={renderColumns(
            data,
            customColumns,
            visibleColumns,
            setEditRecord,
            setEditDrawerVisible,
            viewObjectDetails,
            viewImages,
            (hiddenColumns = [...hiddenColumns, "_id"])
          )}
          dataSource={data}
          rowKey={(record) => record.id || record._id || record.key} // Ensure a unique identifier
          scroll={{ x: "max-content" }}
          onChange={(pagination, filters, sorter) => {}}
          pagination={{
            current: page,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: handleTableChange,
            total: data.length, // Total number of items for client-side pagination
          }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      {/* Render Create Drawer */}
      {canCreate
        ? customCreateDrawer && customCreateDrawer.drawer
        : data &&
          renderCreateDrawer(
            createDrawerVisible,
            closeCreateDrawer,
            form,
            handleSubmit,
            data
          )}

      {/* Render Edit Drawer */}
      {canEdit
        ? customEditDrawer && customEditDrawer.drawer
        : data &&
          renderEditDrawer(
            editDrawerVisible,
            closeEditDrawer,
            form,
            handleSubmit,
            editRecord
          )}

      {/* Render Details Drawer */}
      {renderDetailsDrawer(
        objectDrawerVisible,
        setObjectDrawerVisible,
        objectDetail,
        objectDrawerTitle
      )}

      {/* Render Images Drawer */}
      {renderImagesDrawer({
        open: imagesDrawerVisible,
        onClose: () => setImagesDrawerVisible(false),
        files: imagesDrawerFiles,
      })}

      {/* Column Selection Drawer */}
      {data && (
        <Drawer
          title="Select Columns"
          width={400}
          onClose={() => setColumnDrawerVisible(false)}
          open={columnDrawerVisible}
        >
          <Form layout="vertical">
            {Object.keys(data[0] || {})
              .filter((key) => !hiddenColumns.includes(key))
              .map((key) => (
                <Form.Item key={key}>
                  <Checkbox
                    checked={visibleColumns.includes(key)}
                    onChange={() => toggleColumnVisibility(key)}
                  >
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}{" "}
                    {/* Format label */}
                  </Checkbox>
                </Form.Item>
              ))}
          </Form>
          <Button type="primary" onClick={() => setColumnDrawerVisible(false)}>
            Done
          </Button>
        </Drawer>
      )}

      {/* Drawer for previewing the uploaded data */}
      <Drawer
        title="Preview Uploaded Data"
        width="100%"
        onClose={() => setImportDrawerVisible(false)}
        open={importDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setImportDrawerVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmitImportData}>
              Submit Data
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={parsedImportData} // Display parsed data in table
          columns={Object.keys(parsedImportData[0] || {}).map((key) => ({
            title: key,
            dataIndex: key,
            key,
          }))} // Dynamically create columns from parsed data
          rowKey={(record, index) => {
            // Return a valid key, falling back to the index if no unique ID is available
            return record.id || record._id || record.key || index;
          }} // Use index as row key since data might not have unique IDs
          scroll={{ x: "max-content" }}
          pagination={false} // Disable pagination for preview
        />
      </Drawer>
    </div>
  );
};

export default DataTable;
