import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { eModules } from "@/lib/enums/modules.enums";
import { IDashboardStats as IRecord } from "@/lib/models/dashboard.model";
import Service from "@/lib/services/dashboard.service";

const subject = eModules.DashboardsModule;
const service = new Service(eModules.DashboardsModule);

interface ISliceState {
  stats?: IRecord;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ISliceState = {
  loading: false,
  success: false,
  error: null,
};

// #region Async Thunks
export const getAdminDashboard = createAsyncThunk(
  `${subject}/admin`,
  async (_, thunk) => {
    return await service.getAdminDashboard();
  }
);

export const getOperatorDashboard = createAsyncThunk(
  `${subject}/operator`,
  async (id: string, thunk) => {
    return await service.getOperatorDashboard(id);
  }
);
// #endregion

export const slice = createSlice({
  name: subject,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAdminDashboard.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getAdminDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message!;
    });
    builder.addCase(
      getAdminDashboard.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading = false;
        state.success = true;
        state.stats = action.payload;
      }
    );
    builder.addCase(getOperatorDashboard.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(getOperatorDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message!;
    });
    builder.addCase(
      getOperatorDashboard.fulfilled,
      (state, action: PayloadAction<IRecord>) => {
        state.loading = false;
        state.success = true;
        state.stats = action.payload;
      }
    );
  },
});

export const {} = slice.actions;

export default slice.reducer;
