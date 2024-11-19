import { IAuditFields } from "./IAuditFields";

export interface IInvoice {
  _id: string;
  invoiceNumber: string;
  status: "Paid" | "Due" | "Cancelled";
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  flightId?: string;
  customerId: string;
  bookingId: string;
  dateIssued: Date;
  currency: string;
  auditFields: IAuditFields;
}
