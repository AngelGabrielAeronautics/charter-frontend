import { IAirport } from "./airport.model";

export interface ISearchItem {
  departureAirport: string;
  departureAirportObject?: IAirport;
  arrivalAirport: string;
  arrivalAirportObject?: IAirport;
  departureDate: string;
  departureTime: string | null;
  numberOfPassengers: number;
}
