import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { IQuotation, IQuotationUpdateDTO } from "@/lib/models/IQuotations";
import { IUser } from "@/lib/models/IUser";
import QuotationService from "@/lib/services/quotation.service";

import { RootState } from "../store";

const subject = "quotations";
const service = new QuotationService();

interface QuotationsState {
  quotations: IQuotation[];
  selectedQuotation?: IQuotation;
  isFetchingQuotations: boolean;
  searchQuery: string;
  filteredQuotations: IQuotation[];
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

const initialState: QuotationsState = {
  quotations: [],
  isFetchingQuotations: false,
  searchQuery: "",
  filteredQuotations: [],
  loading: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
  },
  success: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
  },
  error: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
  },
};

// #region Async Thunks
export const findAll = createAsyncThunk(
  `${subject}/findAll`,
  async (_, thunk) => {
    return await service.findAll();
  }
);

export const filter = createAsyncThunk(
  `${subject}/filter`,
  async (payload: any, thunk) => {
    const { auth } = thunk.getState() as RootState;
    const authenticatedUser = auth.authenticatedUser as IUser;
    return await service.findByFilter(payload, authenticatedUser);
  }
);

export const findOne = createAsyncThunk(
  `${subject}/findOne`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);

export const create = createAsyncThunk(
  `${subject}/create`,
  async (payload: IQuotation, thunk) => {
    return await service.create(payload);
  }
);

export const update = createAsyncThunk(
  `${subject}/update`,
  async (
    { id, payload }: { id: string; payload: IQuotationUpdateDTO },
    thunk
  ) => {
    return await service.update(id, payload as IQuotation);
  }
);

export const fetchQuotations = createAsyncThunk(
  "quotations/fetchAll",
  async () => {
    const response = await fetch(`${API_BASE_URL}/quotations`);
    const data = await response.json();

    return data;
  }
);
// #endregion

export const QuotationsSlice = createSlice({
  name: "quotations",
  initialState,
  reducers: {
    setQuotations(state, action: PayloadAction<IQuotation[]>) {
      state.quotations = action.payload;
    },
    addQuotation(state, action: PayloadAction<IQuotation>) {
      state.quotations.push(action.payload);
    },
    updateQuotation(state, action: PayloadAction<IQuotation>) {
      const index = state.quotations.findIndex((operator: IQuotation) => {
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
      });
    },
    deleteQuotation(state, action: PayloadAction<IQuotation>) {
      state.quotations = state.quotations.filter(
        (quotation: IQuotation) => quotation._id !== action.payload._id
      );
    },

    reset: (state) => {
      state = initialState;
    },
    resetActionStates: (state) => {
      state.loading = initialState.loading;
      state.success = initialState.success;
      state.error = initialState.error;
    },
    setSelectedQuotation(state, action) {
      state.selectedQuotation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuotations.pending, (state, action) => {
      state.isFetchingQuotations = true;
    });
    builder.addCase(fetchQuotations.fulfilled, (state, action) => {
      state.isFetchingQuotations = false;
      state.quotations = action.payload;
    });
    builder.addCase(fetchQuotations.rejected, (state, action) => {
      state.isFetchingQuotations = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(findAll.pending, (state) => {
      state.loading.listRecords = true;
      state.error.listRecords = false;
    });
    builder.addCase(findAll.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(
      findAll.fulfilled,
      (state, action: PayloadAction<IQuotation[]>) => {
        state.loading.listRecords = false;
        state.quotations = action.payload.reverse();
      }
    );
    builder.addCase(filter.pending, (state) => {
      state.loading.listRecords = true;
      state.error.listRecords = false;
    });
    builder.addCase(filter.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(
      filter.fulfilled,
      (state, action: PayloadAction<IQuotation[]>) => {
        state.loading.listRecords = false;
        state.quotations = action.payload.reverse();
      }
    );
    builder.addCase(findOne.pending, (state) => {
      state.loading.getRecord = true;
    });
    builder.addCase(findOne.rejected, (state, action) => {
      state.loading.getRecord = false;
      state.error.getRecord = action.error.message;
    });
    builder.addCase(
      findOne.fulfilled,
      (state, action: PayloadAction<IQuotation>) => {
        state.loading.getRecord = false;
        state.selectedQuotation = action.payload;
      }
    );
    builder.addCase(create.pending, (state) => {
      state.loading.createRecord = true;
      state.error.createRecord = false;
      state.success.createRecord = false;
    });
    builder.addCase(create.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      create.fulfilled,
      (state, action: PayloadAction<IQuotation>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.quotations = state.quotations
          ? [action.payload, ...state.quotations]
          : [action.payload];
      }
    );
    builder.addCase(update.pending, (state) => {
      state.loading.updateRecord = true;
    });
    builder.addCase(update.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      update.fulfilled,
      (state, action: PayloadAction<IQuotation>) => {
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
        state.selectedQuotation = action.payload;
        // Update the quotation in the quotations array
        const index = state.quotations.findIndex(
          (quotation: IQuotation) => quotation._id === action.payload._id
        );
        if (index !== -1) {
          state.quotations[index] = action.payload;
        }
      }
    );
  },
});

export const {
  setQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  reset,
  resetActionStates,
  setSelectedQuotation,
} = QuotationsSlice.actions;

export default QuotationsSlice.reducer;
