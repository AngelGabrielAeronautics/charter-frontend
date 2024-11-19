import { IAuditFields } from "./IAuditFields";
import { IInvoice } from "./IInvoices";
import { IOperator } from "./IOperators";
import { IUser } from "./IUser";
import { IFlight } from "./flight.model";

export interface IBooking {
  _id?: string;
  bookingNumber?: string;
  customer: IUser;
  numberOfPassengers: number;
  flightNumber?: string;
  flightId?: string | IFlight;
  operatorId: string | IOperator;
  agencyId?: string;
  operatorName: string;
  items: IBookedItem[];
  currency: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  invoiceId?: string | IInvoice;
  status: "Pending" | "Invoiced" | "Paid" | "Cancelled";
  auditFields: IAuditFields;
}

export interface IBookedItem {
  adults: number;
  children: number;
  infants: number;
  totalNumberOfPassengers: number;
  totalPrice: number;
}
