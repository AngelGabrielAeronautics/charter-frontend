import { DocumentReference } from "firebase/firestore";

import { IAuditFields } from "./IAuditFields";
import { ICompany } from "./ICompany";

export interface IClient {
  id: string; // A unique identifier for the client.
  company: DocumentReference<ICompany>; // Reference to the client's company.
  name: string; // The name of the client.
  contact_person: string; // The primary contact person for the client.
  email: string; // The primary email address for the client.
  phone: string; // The primary contact number for the client.
  address: string; // The physical address of the client.
  country: string; // The country where the client is based.
  dial_code: string; // The country dial code.
  industry: string; // The industry in which the client operates.
  client_type: string; // The type of client (e.g., individual, business).
  registration_number?: string; // (Optional) The client's registration number.
  tax_identification_number?: string; // (Optional) The client's tax identification number.
  created_at: Date; // The date when the client was created.
  updated_at: Date; // The date when the client was last updated.
  audit_fields: IAuditFields; // Fields related to auditing, defined in the IAuditFields interface.
}
