import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { IInvoice } from "@/lib/models/IInvoices";

import {
  fetchBookings,
  fetchSelectedBookings,
  getBookingById,
} from "../bookings/bookings.slice";
import { getCustomerById } from "../users/users.slice";

interface InvoicesState {
  invoices: IInvoice[];
  selectedInvoice?: IInvoice;
  isFetchingInvoices: boolean;
  isFetchingInvoiceDetails: boolean;
  isUpdatingInvoice: boolean;
  searchQuery: string;
  filteredInvoices: IInvoice[];
  loading: {
    updateRecord: any;
    listRecords: any;
  };
  success: {
    updateRecord: any;
    listRecords: any;
  };
  error: {
    updateRecord: any;
    listRecords: any;
  };
}

const initialState: InvoicesState = {
  invoices: [],
  isFetchingInvoices: false,
  isUpdatingInvoice: false,
  isFetchingInvoiceDetails: false,
  searchQuery: "",
  filteredInvoices: [],
  loading: {
    updateRecord: false,
    listRecords: false,
  },
  success: {
    updateRecord: false,
    listRecords: false,
  },
  error: {
    updateRecord: false,
    listRecords: false,
  },
};

export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (_, thunk) => {
    const response = await fetch(`${API_BASE_URL}/invoices`);
    const data = await response.json();

    const bookingIds: string[] = data.map(
      (invoice: IInvoice) => invoice.bookingId
    );

    if (bookingIds.length > 0)
      thunk.dispatch(fetchSelectedBookings(bookingIds));

    return data;
  }
);

export const getInvoiceById = createAsyncThunk(
  "invoices/getOne",
  async (id: string, thunk) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
    const data = await response.json();

    if (data.bookingId) thunk.dispatch(getBookingById(data.bookingId));
    if (data.customerId) thunk.dispatch(getCustomerById(data.customerId));

    return data;
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  "invoices/updateStatus",
  async ({ id, status }: { id: string; status: string }, thunk) => {
    const response = await fetch(`${API_BASE_URL}/invoices/status/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data;
  }
);

export const InvoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    resetActionStates(state) {
      state.isFetchingInvoices = false;
      state.isUpdatingInvoice = false;
      state.success.updateRecord = false;
      state.error.updateRecord = false;
      state.loading.updateRecord = false;
    },
    setInvoices(state, action: PayloadAction<IInvoice[]>) {
      state.invoices = action.payload;
    },
    addOperator(state, action: PayloadAction<IInvoice>) {
      state.invoices.push(action.payload);
    },
    updateOperator(state, action: PayloadAction<IInvoice>) {
      const index = state.invoices.findIndex((operator: IInvoice) => {
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      });
    },
    deleteOperator(state, action: PayloadAction<IInvoice>) {
      state.invoices = state.invoices.filter(
        (invoice: IInvoice) => invoice._id !== action.payload._id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInvoiceById.pending, (state) => {
      state.isFetchingInvoiceDetails = true;
    });
    builder.addCase(
      getInvoiceById.fulfilled,
      (state, action: PayloadAction<IInvoice>) => {
        state.isFetchingInvoiceDetails = false;
        state.selectedInvoice = action.payload;
      }
    );
    builder.addCase(getInvoiceById.rejected, (state, action) => {
      state.isFetchingInvoiceDetails = false;
    });
    builder.addCase(fetchInvoices.pending, (state, action) => {
      state.isFetchingInvoices = true;
    });
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.isFetchingInvoices = false;
      state.invoices = action.payload;
    });
    builder.addCase(fetchInvoices.rejected, (state, action) => {
      state.isFetchingInvoices = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(updateInvoiceStatus.pending, (state, action) => {
      state.isUpdatingInvoice = true;
      state.loading.updateRecord = true;
    });
    builder.addCase(updateInvoiceStatus.fulfilled, (state, action) => {
      state.isUpdatingInvoice = false;
      state.loading.updateRecord = false;
      state.invoices = action.payload;
    }),
      builder.addCase(updateInvoiceStatus.rejected, (state, action) => {
        state.isUpdatingInvoice = false;
        state.loading.updateRecord = false;
        state.error.updateRecord = action.error.message;
      });
  },
});

export const {
  setInvoices,
  addOperator,
  updateOperator,
  deleteOperator,
  resetActionStates,
} = InvoicesSlice.actions;

export default InvoicesSlice.reducer;
