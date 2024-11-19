import { IAuditFields } from "@/lib/models/IAuditFields";
import { IBooking } from "@/lib/models/IBooking";
import { IInvoice } from "@/lib/models/IInvoices";
import { IOperator } from "@/lib/models/IOperators";
import { IFlight } from "@/lib/models/flight.model";
import { IPerson } from "@/lib/models/person.model";

export interface ITicket {
  _id?: string;
  ticketNumber: string;
  customerId: string;
  bookingId: string | IBooking;
  invoiceId: string | IInvoice;
  operatorId: string | IOperator;
  agencyId?: string;
  flightId: string | IFlight;

  pdfFile?: string;
  passengerDetails?: IPerson;
  auditFields: IAuditFields;
}
