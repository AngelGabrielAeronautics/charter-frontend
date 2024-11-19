import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { IAuditLog, IAuditLog as IRecord } from "@/lib/models";
import Service from "@/lib/services/audit-log.service";

const subject = "audit-logs";

interface ISliceState {
  records: IRecord[];
  selectedRecord: IRecord | null;
  loading: { getRecord: boolean; listRecords: boolean; removeRecord: boolean };
  success: { getRecord: boolean; listRecords: boolean; removeRecord: boolean };
  error: {
    getRecord?: string | null;
    listRecords?: string | null;
    removeRecord?: string | null;
  };
}

const service = new Service();

const initialState: ISliceState = {
  records: [],
  selectedRecord: null,
  loading: {
    getRecord: false,
    listRecords: false,
    removeRecord: false,
  },
  success: {
    getRecord: false,
    listRecords: false,
    removeRecord: false,
  },
  error: {
    getRecord: null,
    listRecords: null,
    removeRecord: null,
  },
};

// Helper function to safely parse JSON strings
function parseJSONSafely(data: string | undefined) {
  try {
    return data ? JSON.parse(data) : undefined;
  } catch (error) {
    return data; // Return the original data if parsing fails
  }
}

// #region Async Thunks
export const findAll = createAsyncThunk(
  `${subject}/findAll`,
  async (_, thunk) => {
    const result = await service.findAll();

    // Transform the result
    const records: IRecord[] = result.map((value: IRecord) => {
      return {
        ...value,
        newValue: parseJSONSafely(value.newValue),
        requestBody: parseJSONSafely(value.requestBody),
      };
    });

    return records;
  }
);

export const findOne = createAsyncThunk(
  `${subject}/findOne`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);

export const remove = createAsyncThunk(
  `${subject}/remove`,
  async (id: string, thunk) => {
    return await service.remove(id);
  }
);
// #endregion

export const slice = createSlice({
  name: subject,
  initialState,
  reducers: {
    reset: (state) => {
      state.records = [];
      state.selectedRecord = null;
      state.loading = {
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.success = {
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        removeRecord: null,
      };
    },
    resetActionStates: (state) => {
      state.loading = {
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.success = {
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        removeRecord: null,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(findAll.pending, (state) => {
      state.loading.listRecords = true;
      state.error.listRecords = null;
    }),
      builder.addCase(findAll.rejected, (state, action) => {
        state.loading.listRecords = false;
        state.error.listRecords = action.error.message;
      }),
      builder.addCase(
        findAll.fulfilled,
        (state, action: PayloadAction<IRecord[]>) => {
          state.loading.listRecords = false;
          state.records =
            action.payload.length > 0 ? action.payload.reverse() : [];
        }
      ),
      builder.addCase(findOne.pending, (state) => {
        state.loading.getRecord = true;
      }),
      builder.addCase(findOne.rejected, (state, action) => {
        state.loading.getRecord = false;
        state.error.getRecord = action.error.message;
      }),
      builder.addCase(
        findOne.fulfilled,
        (state, action: PayloadAction<IRecord>) => {
          state.loading.getRecord = false;
          state.selectedRecord = action.payload;
        }
      );
    builder.addCase(remove.pending, (state) => {
      state.loading.removeRecord = true;
    }),
      builder.addCase(remove.rejected, (state, action) => {
        state.loading.removeRecord = false;
        state.error.removeRecord = action.error.message;
      }),
      builder.addCase(
        remove.fulfilled,
        (state, action: PayloadAction<IRecord>) => {
          state.loading.removeRecord = false;
          state.success.removeRecord = true;
        }
      );
  },
});

export const { reset, resetActionStates } = slice.actions;

export default slice.reducer;
