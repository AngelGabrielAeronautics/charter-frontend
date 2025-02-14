import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { IFlight } from "@/lib/models/flight.model";
import { ISearchItem } from "@/lib/models/search.model";
import { INotify } from "@/lib/models/utility.model";
import { fetchFilteredFlight } from "@/lib/services/flights.service";

interface FlightsState {
  searchFlightCriteria: ISearchItem[];
  searchingFlights: boolean;
  selectedFlight?: IFlight;
  flights: IFlight[];
  selectedFlights: IFlight[];
  isFetchingFlights: boolean;
  notify: INotify;
  shouldShowSearchResults: boolean;
  loading: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
  };
  success: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
  };
  error: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
  };
}

const initialState: FlightsState = {
  searchFlightCriteria: [],
  searchingFlights: false,
  shouldShowSearchResults: false,
  flights: [],
  selectedFlights: [],
  isFetchingFlights: false,
  loading: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
  },
  success: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
  },
  error: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
  },
  notify: {
    shouldNotify: false,
    type: "info",
    title: "",
    message: "",
  },
};

export const searchFlights = createAsyncThunk(
  "flights/search",
  async (criteria: ISearchItem[]) => {
    const promises = criteria.map(async (criterion) => {
      // Combine date and time into a single string
      let departureDateTimeString;
      if (criterion.departureTime){

         departureDateTimeString = `${criterion.departureDate}T${criterion.departureTime}`;
      } else {
        departureDateTimeString = criterion.departureDate;
      }

      // Convert to a Date object
      const departureDateTime = new Date(departureDateTimeString);

      // Convert to ISO string for the API
      const departureDateTimeISO = departureDateTime.toISOString();
      

      const response = await fetch(`${API_BASE_URL}/flights/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            ...criterion,
            departureDate: departureDateTimeISO,
            maxSeatsAvailable: { $gt: 0 }
          },
        ]),
      });

      return response.json();
    });

    const results = await Promise.all(promises);
    const flattenedResults = results.flat();

    return flattenedResults;
  }
);

export const fetchFlights = createAsyncThunk("flights/fetchAll", async () => {
  const response = await fetch(`${API_BASE_URL}/flights`);
  const data = await response.json();

  return data;
});

export const fetchSelectedFlights = createAsyncThunk(
  "flights/fetchSelectedFlights",
  async (_ids: string[]) => {
    const response = await fetch(`${API_BASE_URL}/flights/findInIdsArray`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _ids }),
    });
    const data = await response.json();

    return data;
  }
);

export const cancelFlight = createAsyncThunk(
  "flights/cancel",
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Cancelled" }),
    });
    const data = await response.json();
    return data;
  }
);

export const updateFlightThunk = createAsyncThunk(
  "flights/update",
  async (payload: any) => {
    console.log("updateFlightThunk", payload)
    const response = await fetch(`${API_BASE_URL}/flights/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload.data),
    });
    const data = await response.json();
    return data;
  }
);

export const getOperatorFlights = createAsyncThunk(
  "flights/filter/operator",
  async (operatorId: string) => {
    const response = await fetch(`${API_BASE_URL}/flights/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operatorId }),
    });
    const data = await response.json();
    return data;
  }
);

export const filterFlights = createAsyncThunk(
  "flights/filter",
  async (filter: any) => {
    const response = await fetch(`${API_BASE_URL}/flights/filter-with-operators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter),
    });
    const data = await response.json();
    return data;
  }
);

export const getFlightById = createAsyncThunk(
  "flights/getOne",
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`);
    const data = await response.json();
    return data;
  }
);

export const getFilteredFlights = createAsyncThunk(
  "flights/filter/searchText",
  async (searchText: string) => {
    const data: IFlight[] = await fetchFilteredFlight(searchText);
    return data;
  }
);

export const addFlightThunk = createAsyncThunk(
  "flights/add",
  async (newFlight: IFlight) => {
    const response = await fetch(`${API_BASE_URL}/flights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlight),
    });
    const data = await response.json();
    return data;
  }
);

export const FlightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    addFlightCriteria: (state, action) => {
      state.searchFlightCriteria.push(action.payload);
    },
    setSearchFlightCriteria: (state, action) => {
      state.searchFlightCriteria = action.payload;
    },
    resetFlightCriteria: (state) => {
      state.searchFlightCriteria = [];
      state.shouldShowSearchResults = false;
    },
    setShouldShowSearchResults: (state, action) => {
      state.shouldShowSearchResults = action.payload;
    },
    removeFlightCriteria: (state, action) => {
      state.searchFlightCriteria = state.searchFlightCriteria.filter(
        (item) => item !== action.payload
      );
    },
    setFlights(state, action: PayloadAction<IFlight[]>) {
      state.flights = action.payload;
    },
    selectFlight(state, action: PayloadAction<IFlight>) {
      state.selectedFlight = action.payload;
    },
    clearFlightSelection(state) {
      state.selectedFlight = undefined;
    },
    updateFlight(state, action: PayloadAction<IFlight>) {
      const index = state.flights.findIndex((operator: IFlight) => {
        if (index !== -1) {
          state.flights[index] = action.payload;
        }
      });
    },
    deleteFlight(state, action: PayloadAction<IFlight>) {
      state.flights = state.flights.filter(
        (operator: IFlight) => operator._id !== action.payload._id
      );
    },
    setNotify(state, action: PayloadAction<INotify>) {
      state.notify = action.payload;
    },
    resetNotify(state) {
      state.notify = {
        shouldNotify: false,
        type: "info",
        title: "",
        message: "",
      };
    },
    resetActionStates: (state) => {
      state.loading = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
      };
      state.success = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
      };
      state.shouldShowSearchResults = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchFlights.pending, (state, action) => {
      state.searchingFlights = true;
      state.shouldShowSearchResults = false;
      state.notify = {
        shouldNotify: false,
        type: "info",
        title: "",
        message: "",
      };
    });
    builder.addCase(
      searchFlights.fulfilled,
      (state, action: PayloadAction<IFlight[]>) => {
        state.searchingFlights = false;
        state.shouldShowSearchResults = true;
        state.flights = action.payload;
      }
    );
    builder.addCase(searchFlights.rejected, (state, action) => {
      state.searchingFlights = false;
      state.error.listRecords = action.error.message;
      state.notify = {
        shouldNotify: true,
        type: "error",
        title: "",
        message: `${action.error.message}`,
      };
    });
    builder.addCase(fetchFlights.pending, (state, action) => {
      state.isFetchingFlights = true;
    });
    builder.addCase(fetchFlights.fulfilled, (state, action) => {
      state.isFetchingFlights = false;
      state.flights = action.payload;
    });
    builder.addCase(fetchFlights.rejected, (state, action) => {
      state.isFetchingFlights = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(fetchSelectedFlights.pending, (state, action) => {
      state.isFetchingFlights = true;
    });
    builder.addCase(fetchSelectedFlights.fulfilled, (state, action) => {
      state.isFetchingFlights = false;
      state.selectedFlights = action.payload;
    });
    builder.addCase(fetchSelectedFlights.rejected, (state, action) => {
      state.isFetchingFlights = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(filterFlights.pending, (state, action) => {
      state.isFetchingFlights = true;
    });
    builder.addCase(filterFlights.fulfilled, (state, action) => {
      state.isFetchingFlights = false;
      state.flights = action.payload;
    });
    builder.addCase(filterFlights.rejected, (state, action) => {
      state.isFetchingFlights = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(getOperatorFlights.pending, (state, action) => {
      state.isFetchingFlights = true;
    });
    builder.addCase(getOperatorFlights.fulfilled, (state, action) => {
      state.isFetchingFlights = false;
      state.flights = action.payload;
    });
    builder.addCase(getOperatorFlights.rejected, (state, action) => {
      state.isFetchingFlights = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(getFlightById.pending, (state) => {
      state.loading.getRecord = true;
    });
    builder.addCase(
      getFlightById.fulfilled,
      (state, action: PayloadAction<IFlight>) => {
        state.loading.getRecord = false;
        state.selectedFlight = action.payload;
      }
    );
    builder.addCase(getFilteredFlights.pending, (state, action) => {
      state.isFetchingFlights = true;
    });
    builder.addCase(getFilteredFlights.rejected, (state, action) => {
      state.isFetchingFlights = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(getFilteredFlights.fulfilled, (state, action) => {
      state.isFetchingFlights = false;
      state.flights = action.payload;
    });
    builder.addCase(addFlightThunk.pending, (state, action) => {
      state.loading.createRecord = true;
      state.success.createRecord = false;
      state.error.createRecord = null;
    });
    builder.addCase(addFlightThunk.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      addFlightThunk.fulfilled,
      (state, action: PayloadAction<IFlight>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.flights = [action.payload, ...state.flights];
      }
    );
    builder.addCase(cancelFlight.pending, (state, action) => {
      state.loading.updateRecord = true;
      state.success.updateRecord = false;
      state.error.updateRecord = null;
    });
    builder.addCase(cancelFlight.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
      state.notify = {
        shouldNotify: true,
        type: "error",
        title: "",
        message: `${action.error?.message}`,
      };
    });
    builder.addCase(cancelFlight.fulfilled, (state, action) => {
      const updatedFlight: IFlight = action.payload;
      state.loading.updateRecord = false;
      state.success.updateRecord = true;
      state.notify = {
        shouldNotify: true,
        type: "success",
        title: "",
        message: `Successfully cancelled flight`,
      };
      const updatedFlights = state.flights.map((flight) =>
        flight._id === updatedFlight._id ? updatedFlight : flight
      );
      state.flights = updatedFlights;
    });
    builder.addCase(updateFlightThunk.pending, (state, action) => {
      state.loading.updateRecord = true;
      state.success.updateRecord = false;
      state.error.updateRecord = null;
    });
    builder.addCase(updateFlightThunk.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
      state.notify = {
        shouldNotify: true,
        type: "error",
        title: "",
        message: `${action.error?.message}`,
      };
    });
    builder.addCase(updateFlightThunk.fulfilled, (state, action) => {
      const updatedFlight: IFlight = action.payload;
      state.loading.updateRecord = false;
      state.success.updateRecord = true;
      state.notify = {
        shouldNotify: true,
        type: "success",
        title: "",
        message: `Successfully updated flight`,
      };
      state.selectedFlight = updatedFlight;
      state.flights = state.flights.map((flight) =>
        flight._id === updatedFlight._id
          ? { ...flight, ...updatedFlight }
          : flight
      );
    });
  },
});

export const {
  resetActionStates,
  setFlights,
  selectFlight,
  clearFlightSelection,
  updateFlight,
  deleteFlight,
  addFlightCriteria,
  removeFlightCriteria,
  setNotify,
  resetNotify,
  resetFlightCriteria,
  setSearchFlightCriteria,
  setShouldShowSearchResults,
} = FlightsSlice.actions;

export default FlightsSlice.reducer;
