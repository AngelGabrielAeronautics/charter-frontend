export interface IAuditLog {
  action: "Create" | "Update" | "Delete";
  collectionName: string;
  description: string;
  newValue?: any;
  requestBody?: any;
  documentId: string;
  userId: string;
  timestamp: Date;
  organisation?: string;
}
