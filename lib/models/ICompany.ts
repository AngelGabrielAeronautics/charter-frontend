import { DocumentReference } from "firebase/firestore";

import { IAuditFields } from "./IAuditFields";

export interface ICompany {
  id: string; // A unique identifier for the company.
  name: string; // The name of the company.
  description?: string; // A brief description of the company.
  country: string; // The country where the company is based.
  dial_code: string; // The country dial code.
  address: string; // The physical address of the company.
  phone: string; // The primary contact number for the company.
  email: string; // The primary email address for the company.
  website_url?: string; // The website URL of the company.
  industry: string; // The industry in which the company operates.
  registration_number: string; // The company's registration number.
  tax_identification_number: string; // The company's tax identification number.
  base_currency: string; // The base currency used by the company.
  logo_url?: string; // URL to the company's logo.
  established_date: Date; // The date when the company was established.
  audit_fields: IAuditFields; // Fields related to auditing, defined in the IAuditFields interface.
}
