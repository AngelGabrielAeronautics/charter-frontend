import { DocumentReference } from "firebase/firestore";

import { IAuditFields } from "./IAuditFields";

export interface IProject {
  id: string;
  name: string;
  description: string;
  status: string;
  audit_fields: IAuditFields;
}
