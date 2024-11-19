export interface IAirport {
  airportId: string;
  airportName: string;
  cityIataCode: string;
  countryIso2: string;
  countryName: string;
  fullLabel: string;
  geonameId: number;
  gmt: number;
  iataCode: string;
  icaoCode: string;
  id: number;
  latitude: number;
  longitude: number;
  phoneNumber?: string | null;
  shortLabel: string;
  timezone: string;
  flag: string;
  _id: string;
}
