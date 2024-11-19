export interface IAuditFields {
  createdBy: string;
  createdById: string;
  dateCreated: Date;
  modifiedBy?: string;
  modifiedById?: string;
  dateModified?: Date;
}
