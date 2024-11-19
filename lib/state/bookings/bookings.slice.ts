import {
  GetThunkAPI,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";
import { eRoutes } from "@/app/(config)/routes";

import { eModules } from "@/lib/enums/modules.enums";
import { IBooking } from "@/lib/models/IBooking";
import { INotify, IRedirect } from "@/lib/models/utility.model";
import Service from "@/lib/services/bookings.service";

import { fetchSelectedFlights, getFlightById } from "../flights/flights.slice";
import { RootState } from "../store";

const subject = eModules.BookingsModule;
const service = new Service(eModules.BookingsModule);

interface BookingsState {
  selectedBooking?: IBooking;
  bookings: IBooking[];
  selectedBookings: IBooking[];
  isFetchingBookings: boolean;
  isCreatingBooking: boolean;
  redirect: IRedirect;
  notify: INotify;
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

const initialState: BookingsState = {
  bookings: [],
  selectedBookings: [],
  isFetchingBookings: false,
  isCreatingBooking: false,
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
  redirect: {
    shouldRedirect: false,
  },
  notify: {
    shouldNotify: false,
    type: "info",
    title: "",
    message: "",
  },
};

export const fetchSelectedBookings = createAsyncThunk(
  `${subject}/fetchSelectedBookings`,
  async (_ids: string[]) => {
    const response = await fetch(`${API_BASE_URL}/${subject}/findInIdsArray`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _ids }),
    });
    const data = await response.json();

    return data.reverse();
  }
);

export const update = createAsyncThunk(
  `${subject}/update`,
  async ({ id, payload }: { id: string; payload: any }, thunk) => {
    return await service.update(id, payload);
  }
);

export const filterBookings = createAsyncThunk(
  `${subject}/filter`,
  async (payload: any, thunk) => {
    return await service.findByFilter(payload);
  }
);

export const fetchBookings = createAsyncThunk(
  `${subject}/fetchAll`,
  async (_, thunk) => {
    const response = await fetch(`${API_BASE_URL}/${subject}`);
    const data = await response.json();

    const flightIds: string[] = data.map(
      (booking: IBooking) => booking.flightId
    );

    thunk.dispatch(fetchSelectedFlights(flightIds));

    return data;
  }
);

export const getBookingById = createAsyncThunk(
  `${subject}/getOne`,
  async (id: string, thunk) => {
    const response = await fetch(`${API_BASE_URL}/${subject}/${id}`);
    const data = await response.json();

    if (data.flightId) thunk.dispatch(getFlightById(data.flightId));

    return data;
  }
);

export const createBooking = createAsyncThunk(
  `${subject}/create`,
  async (booking: IBooking, thunkAPI) => {
    const response = await fetch(`${API_BASE_URL}/${subject}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    const data = await response.json();

    const state = thunkAPI.getState() as RootState;
    const authenticatedUser = state.auth.authenticatedUser;

    let redirectPath = "";

    // If agency redirect to agency invoice page
    if (authenticatedUser?.role == "Agency") {
      redirectPath = `${eRoutes.agencyInvoices}/${data.invoiceId}`;
    } else {
      redirectPath = `${eRoutes.clientInvoices}/${data.invoiceId}`;
    }

    return {
      booking: data,
      redirect: {
        shouldRedirect: true,
        redirectPath: redirectPath,
      },
    };
  }
);

export const BookingsSlice = createSlice({
  name: subject,
  initialState,
  reducers: {
    selectBooking(state, action) {
      state.selectedBooking = action.payload;
    },
    setBookings(state, action: PayloadAction<IBooking[]>) {
      state.bookings = action.payload;
    },
    // Set notify
    setNotify(state, action: PayloadAction<INotify>) {
      state.notify = action.payload;
    },
    // Reset notify
    reset(state) {
      state.notify = {
        shouldNotify: false,
        type: "info",
        title: "",
        message: "",
      };
      state.redirect = {
        shouldRedirect: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBooking.pending, (state, action) => {
      state.isCreatingBooking = true;
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.isCreatingBooking = false;
      state.bookings = [...state.bookings, action.payload.booking];
      state.redirect = action.payload.redirect;
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.isCreatingBooking = false;
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(fetchSelectedBookings.pending, (state, action) => {
      state.isFetchingBookings = true;
      state.loading.listRecords = true;
    });
    builder.addCase(fetchSelectedBookings.fulfilled, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.selectedBookings = action.payload;
    });
    builder.addCase(fetchSelectedBookings.rejected, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(fetchBookings.pending, (state, action) => {
      state.isFetchingBookings = true;
      state.loading.listRecords = true;
    });
    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.bookings = action.payload;
    });
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(filterBookings.pending, (state, action) => {
      state.isFetchingBookings = true;
      state.loading.listRecords = true;
    });
    builder.addCase(filterBookings.fulfilled, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.bookings = action.payload;
    });
    builder.addCase(filterBookings.rejected, (state, action) => {
      state.isFetchingBookings = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(getBookingById.pending, (state) => {
      state.loading.getRecord = true;
    });
    builder.addCase(getBookingById.rejected, (state, action) => {
      state.loading.getRecord = false;
      state.error.getRecord = action.error.message;
    });
    builder.addCase(
      getBookingById.fulfilled,
      (state, action: PayloadAction<IBooking>) => {
        state.loading.getRecord = false;
        state.selectedBooking = action.payload;
      }
    );
    builder.addCase(update.pending, (state) => {
      state.loading.updateRecord = true;
      state.success.updateRecord = false;
    });
    builder.addCase(update.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
    });
    builder.addCase(
      update.fulfilled,
      (state, action: PayloadAction<IBooking>) => {
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
        state.selectedBooking = action.payload;
        state.bookings = state.bookings.map((booking) =>
          booking._id == action.payload._id ? action.payload : booking
        );
      }
    );
  },
});

export const { setBookings, setNotify, reset, selectBooking } =
  BookingsSlice.actions;

export default BookingsSlice.reducer;
