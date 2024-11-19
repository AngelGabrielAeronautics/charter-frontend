import {
  GetThunkAPI,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { eModules } from "@/lib/enums/modules.enums";
import { IAgency as IRecord } from "@/lib/models";
import AgencyService from "@/lib/services/agency.service";

const subject = eModules.AgenciesModule;
const service = new AgencyService(eModules.AgenciesModule);

interface IState {
  records: IRecord[];
  selectedRecord: IRecord | null;
  userAgency: IRecord | null;
  drawer: { createRecord: boolean; updateRecord: boolean };
  loading: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    removeRecord: boolean;
  };
  success: {
    getRecord: boolean;
    listRecords: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    removeRecord: boolean;
  };
  error: {
    getRecord?: string | null;
    listRecords?: string | null;
    createRecord?: string | null;
    updateRecord?: string | null;
    removeRecord?: string | null;
  };
}

const initialState: IState = {
  records: [],
  selectedRecord: null,
  userAgency: null,
  drawer: {
    createRecord: false,
    updateRecord: false,
  },
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

export const findOne = createAsyncThunk(
  `${subject}/findOne`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);

export const create = createAsyncThunk(
  `${subject}/create`,
  async (payload: IRecord, thunk: GetThunkAPI<any>) => {
    return await service.create(payload, thunk);
  }
);

export const update = createAsyncThunk(
  `${subject}/update`,
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

export const getCurrentAgency = createAsyncThunk(
  `${subject}/getCurrentAgency`,
  async (id: string, thunk) => {
    return await service.findOne(id);
  }
);
// #endregion

export const slice = createSlice({
  name: subject,
  initialState,
  reducers: {
    resetOrganisation: (state) => {
      state.records = [];
      state.selectedRecord = null;
      state.drawer = {
        createRecord: false,
        updateRecord: false,
      };
      state.loading = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
        removeRecord: false,
      };
      state.success = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
        removeRecord: false,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
        removeRecord: null,
      };
    },
    resetActionStates: (state) => {
      state.drawer = {
        createRecord: false,
        updateRecord: false,
      };
      state.loading = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
        removeRecord: false,
      };
      state.success = {
        getRecord: false,
        listRecords: false,
        createRecord: false,
        updateRecord: false,
        removeRecord: false,
      };
      state.error = {
        getRecord: null,
        listRecords: null,
        createRecord: null,
        updateRecord: null,
        removeRecord: null,
      };
    },
    setCreateDrawer: (state, action) => {
      state.drawer.createRecord = action.payload;
    },
    setUpdateDrawer: (state, action) => {
      state.drawer.updateRecord = action.payload;
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    setUserAgency: (state, action) => {
      state.userAgency = action.payload;
    },
  },
  extraReducers(builder) {
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
        state.records = action.payload.reverse();
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
    builder.addCase(getCurrentAgency.pending, (state) => {
      state.loading.getRecord = true;
      state.success.getRecord = false;
      state.error.getRecord = null;
    });
    builder.addCase(getCurrentAgency.rejected, (state, action) => {
      state.loading.getRecord = false;
      state.error.getRecord = action.error.message;
    });
    builder.addCase(
      getCurrentAgency.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading.getRecord = false;
        state.success.getRecord = true;
        state.userAgency = action.payload;
      }
    );
    builder.addCase(create.pending, (state) => {
      state.loading.createRecord = true;
      state.error.createRecord = null;
      state.success.createRecord = false;
    });
    builder.addCase(create.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      create.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.records = state.records
          ? [action.payload, ...state.records]
          : [action.payload];
      }
    );
    builder.addCase(update.pending, (state) => {
      state.loading.updateRecord = true;
    });
    builder.addCase(update.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
    });
    builder.addCase(
      update.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading.updateRecord = false;
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
        state.records = state.records.filter(
          (record) => record._id != action.payload._id
        );
      }
    );
  },
});

export const {
  resetOrganisation,
  resetActionStates,
  setSelectedRecord,
  setCreateDrawer,
  setUpdateDrawer,
  setUserAgency: setUserOrganisation,
} = slice.actions;

export default slice.reducer;
