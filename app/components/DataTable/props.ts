import { TableColumnType } from "antd";

export interface RecordType {
  [key: string]: any; // Generic type to represent any kind of record structure
}

export interface DataTableProps {
  data: RecordType[]; // Array of data objects
  title: string; // Title for the table header
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  onRowClick?: (record: any) => void;
  onRowView?: (record: any) => void;
  onRowDelete?: (recordId: string) => void;
  hiddenColumns?: string[];
  additionalActions?: React.ReactElement[];
  createThunk?: (values: any) => void; // Async thunk for creating a new record
  updateThunk?: (values: any) => void; // Async thunk for updating an existing record
  bulkDeleteThunk?: (keys: string[]) => void; // Action for bulk deletion
  customCreateDrawer?: CreateDrawerConfig;
  customEditDrawer?: EditDrawerConfig;
  customColumns?: TableColumnType<any>[]; // Optional array of custom column definitions
  onSelectRow?: (record: any) => void;
  onViewSelected?: () => void;
  canCancel?: boolean;
  onCancel?: (id: string) => void;
}

interface CreateDrawerConfig {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  drawer: React.JSX.Element;
}

interface EditDrawerConfig {
  isOpen: boolean;
  openDrawer: (recordId: string) => void;
  closeDrawer: () => void;
  drawer: React.JSX.Element;
}
