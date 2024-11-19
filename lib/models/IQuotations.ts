import { IAsset } from "./IAssets";
import { IAuditFields } from "./IAuditFields";
import { IOperator } from "./IOperators";
import { IMoney } from "./money.model";

export interface IQuotation {
  _id?: string;
  quotationNumber: string;
  quotationRequestId: string;
  status: "Accepted" | "Submitted" | "Rejected";
  aircraftId: string | IAsset;
  operatorId: string | IOperator;
  flightDuration: number; // Hours
  price: IMoney;
  expirationDate: Date;
  auditFields: IAuditFields;
}

export interface IQuotationUpdateDTO {
  quotationNumber?: string;
  quotationRequestId?: string;
  status?: "Accepted" | "Submitted" | "Rejected";
  aircraftId?: string;
  operatorId?: string;
  flightDuration?: number; // Hours
  price?: IMoney;
  expirationDate?: Date;
  auditFields?: IAuditFields;
}
