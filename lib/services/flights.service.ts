import { API_BASE_URL } from "@/app/(config)/constants";

// Fetch flight by text
export const fetchFilteredFlight = async (search: string) => {
  const response = await fetch(`${API_BASE_URL}/flights/text-search/${search}`);
  const data = await response.json();
  return data;
};
