import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "@/lib/enums/modules.enums";
import {
  IQuotationRequest,
  IQuotationRequestUpdateDTO,
} from "@/lib/models/IQuotationRequest";
import QuotationRequestService from "@/lib/services/quotation-request.service";

const subject = eModules.QuotationRequestsModule;
const service = new QuotationRequestService(eModules.QuotationRequestsModule);

interface quotationRequestsState {
  quotationRequests: IQuotationRequest[];
  selectedQuotationRequest?: IQuotationRequest;
  isFetchingQuotationRequests: boolean;
  searchQuery: string;
  filteredQuotationRequests: IQuotationRequest[];
  loading: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    removeRecord: boolean;
  };
  success: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
    removeRecord: any;
  };
  error: {
    getRecord: any;
    listRecords: any;
    createRecord: any;
    updateRecord: any;
    removeRecord: any;
  };
}

const initialState: quotationRequestsState = {
  quotationRequests: [],
  isFetchingQuotationRequests: false,
  searchQuery: "",
  filteredQuotationRequests: [],
  loading: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
    removeRecord: false,
  },
  success: {
    getRecord: false,
    listRecords: false,
    createRecord: false,
    updateRecord: false,
    removeRecord: false,
  },
  error: {
    getRecord: null,
    listRecords: null,
    createRecord: null,
    updateRecord: null,
    removeRecord: null,
  },
};

// #region Async Thunks
export const findAll = createAsyncThunk(
  `${subject}/findAll`,
  async (_, thunk) => {
    return await service.findAll();
  }
);

export const filterQuotationRequests = createAsyncThunk(
  `${subject}/filter`,
  async (payload: any, thunk) => {
    return await service.findByFilter(payload);
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
  async (payload: IQuotationRequest, thunk) => {
    return await service.create(payload)
  }
);

export const updateQuotationRequest = createAsyncThunk(
  `${subject}/update`,
  async (
    { id, payload }: { id: string; payload: IQuotationRequestUpdateDTO },
    thunk
  ) => {
    return await service.update(id, payload);
  }
);

export const fetchQuotationRequests = createAsyncThunk(
  "quotationRequests/fetchAll",
  async () => {
    const response = await fetch(`${API_BASE_URL}/quotation-requests`);
    const data = await response.json();

    return data;
  }
);
// #endregion

export const QuotationRequestSlice = createSlice({
  name: subject,
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
    selectRecord: (state, action) => {
      state.selectedQuotationRequest = action.payload;
    },
    deselectRecord: (state) => {
      state.selectedQuotationRequest = undefined;
    },
    updateSelectedRecord: (state, action) => {
      const updatedRequest = {
        ...state.selectedQuotationRequest,
        ...action.payload
      };
      state.selectedQuotationRequest = updatedRequest

      const updatedQuotationRequests = [...state.quotationRequests];
      const index = updatedQuotationRequests.findIndex((item) => item._id === state.selectedQuotationRequest?._id)
      updatedQuotationRequests[index] = updatedRequest;

      state.quotationRequests = updatedQuotationRequests;
    },
    resetActionStates: (state) => {
      state.loading = initialState.loading;
      state.success = initialState.success;
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuotationRequests.pending, (state, action) => {
      state.isFetchingQuotationRequests = true;
      state.loading.listRecords = true;
    });
    builder.addCase(fetchQuotationRequests.fulfilled, (state, action) => {
      state.isFetchingQuotationRequests = false;
      state.loading.listRecords = false;
      state.quotationRequests = action.payload.reverse();
    });
    builder.addCase(fetchQuotationRequests.rejected, (state, action) => {
      state.isFetchingQuotationRequests = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(filterQuotationRequests.pending, (state, action) => {
      state.isFetchingQuotationRequests = true;
      state.loading.listRecords = true;
    });
    builder.addCase(filterQuotationRequests.fulfilled, (state, action) => {
      state.isFetchingQuotationRequests = false;
      state.loading.listRecords = false;
      state.quotationRequests = action.payload.reverse();
    });
    builder.addCase(filterQuotationRequests.rejected, (state, action) => {
      state.isFetchingQuotationRequests = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(findAll.pending, (state, action) => {
      state.loading.listRecords = true;
    });
    builder.addCase(findAll.fulfilled, (state, action) => {
      state.loading.listRecords = false;
      state.quotationRequests = action.payload;
    });
    builder.addCase(findAll.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(create.pending, (state, action) => {
      state.loading.createRecord = true;
      state.success.createRecord = false;
    });
    builder.addCase(create.fulfilled, (state, action) => {
      state.loading.createRecord = false;
      state.success.createRecord = true;
    });
    builder.addCase(create.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(updateQuotationRequest.pending, (state) => {
      state.loading.updateRecord = true;
    });
    builder.addCase(updateQuotationRequest.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      updateQuotationRequest.fulfilled,
      (state, action: PayloadAction<IQuotationRequest>) => {
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
        state.selectedQuotationRequest = action.payload;
        state.quotationRequests = state.quotationRequests.map(
          (quotationRequest) =>
            quotationRequest._id == action.payload._id
              ? action.payload
              : quotationRequest
        );
      }
    );
  },
});

export const { resetActionStates, selectRecord, deselectRecord, updateSelectedRecord } =
  QuotationRequestSlice.actions;

export default QuotationRequestSlice.reducer;
