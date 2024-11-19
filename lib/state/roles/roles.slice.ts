import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { IRolePermission as IRecord } from "@/lib/models/role.model";
import Service from "@/lib/services/roles.service";

const subject = "roles";

interface ISliceState {
  records: IRecord[];
  selectedRecord: IRecord | null;
  loading: {
    createRecord: boolean;
    getRecord: boolean;
    listRecords: boolean;
    removeRecord: boolean;
  };
  success: {
    createRecord: boolean;
    getRecord: boolean;
    listRecords: boolean;
    removeRecord: boolean;
  };
  error: {
    createRecord?: string | null;
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
    createRecord: false,
    getRecord: false,
    listRecords: false,
    removeRecord: false,
  },
  success: {
    createRecord: false,
    getRecord: false,
    listRecords: false,
    removeRecord: false,
  },
  error: {
    createRecord: null,
    getRecord: null,
    listRecords: null,
    removeRecord: null,
  },
};

// #region Async Thunks
export const create = createAsyncThunk(
  `${subject}/create`,
  async (payload: IRecord, thunk) => {
    return await service.create(payload);
  }
);

export const findAll = createAsyncThunk(
  `${subject}/findAll`,
  async (_, thunk) => {
    return await service.findAll();
  }
);

export const findOne = createAsyncThunk(
  `${subject}/findOne`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);

export const update = createAsyncThunk(
  `${subject}/findOne`,
  async ({ id, payload }: { id: string; payload: any }, thunk) => {
    return await service.update(id, payload);
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
        createRecord: false,
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.success = {
        createRecord: false,
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.error = {
        createRecord: null,
        getRecord: null,
        listRecords: null,
        removeRecord: null,
      };
    },
    resetActionStates: (state) => {
      state.loading = {
        createRecord: false,
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.success = {
        createRecord: false,
        getRecord: false,
        listRecords: false,
        removeRecord: false,
      };
      state.error = {
        createRecord: null,
        getRecord: null,
        listRecords: null,
        removeRecord: null,
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(create.pending, (state) => {
      state.loading.createRecord = true;
      state.error.createRecord = null;
    });
    builder.addCase(create.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      create.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading.createRecord = false;
        state.records = [action.payload, ...state.records];
      }
    );
    builder.addCase(findAll.pending, (state) => {
      state.loading.listRecords = true;
      state.error.listRecords = null;
    });
    builder.addCase(findAll.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(
      findAll.fulfilled,
      (state, action: PayloadAction<IRecord[]>) => {
        state.loading.listRecords = false;
        state.records =
          action.payload.length > 0 ? action.payload.reverse() : [];
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
      (state, action: PayloadAction<IRecord>) => {
        state.loading.getRecord = false;
        state.selectedRecord = action.payload;
      }
    );
    builder.addCase(remove.pending, (state) => {
      state.loading.removeRecord = true;
    });
    builder.addCase(remove.rejected, (state, action) => {
      state.loading.removeRecord = false;
      state.error.removeRecord = action.error.message;
    });
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
