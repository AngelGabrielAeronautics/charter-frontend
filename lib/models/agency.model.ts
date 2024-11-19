import { IAuditFields } from "./IAuditFields";

export interface IAgency {
  _id?: string;
  name: string;
  userId: string;
  country: string;
  email: string;
  dialCode: string;
  phone: string;
  auditFields: IAuditFields;
}
