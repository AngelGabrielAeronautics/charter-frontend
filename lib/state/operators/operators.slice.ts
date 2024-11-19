import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "@/lib/enums/modules.enums";
import { IAuditFields } from "@/lib/models";
import { IOperator } from "@/lib/models/IOperators";
import { IUserUpdate } from "@/lib/models/IUser";
import OperatorService from "@/lib/services/operator.service";

import { updateUser } from "../users/users.slice";

const subject = eModules.OperatorsModule;
const service = new OperatorService(eModules.OperatorsModule);

interface State {
  currentOperator?: IOperator;
  createdOperator?: IOperator;
  operators: IOperator[];
  searchQuery: string;
  filteredOperators: IOperator[];
  drawers: {
    operatorDetails: {
      isOpen: boolean;
      operator?: IOperator;
    },
  };
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

const initialState: State = {
  operators: [],
  searchQuery: "",
  filteredOperators: [],
  drawers: {
    operatorDetails: {
      isOpen: false,
      operator: undefined,
    },
  },
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
};

export interface ICreateOperatorDto {
  airline: string;
  email: string;
  phone: string;
  country: string;
  auditFields: IAuditFields;
}

export const fetchOperators = createAsyncThunk(
  "operators/fetchAll",
  async () => {
    const response = await fetch(`${API_BASE_URL}/operators`);
    return await response.json();
  }
);

export const getCurrentOperator = createAsyncThunk(
  `${subject}/getCurrentOperator`,
  async (id: string) => {
    return await service.findOne(id);
  }
);

export const createOperator = createAsyncThunk(
  "operators/create",
  async (payload: ICreateOperatorDto, thunk: any) => {
    const state = thunk.getState();
    const { authenticatedUser } = state.auth;

    const response = await fetch(`${API_BASE_URL}/operators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status == 201) {
      const { _id } = data;
      const payload: IUserUpdate = { operatorId: _id, role: "Operator" };
      thunk.dispatch(updateUser({ id: authenticatedUser._id, payload }));
      return data;
    }

    throw new Error(data.message);
  }
);

export const getOperatorById = createAsyncThunk(
  "operators/findById",
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/operators/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  }
);

export const update = createAsyncThunk(
  `${subject}/update`,
  async ({ id, payload }: { id: string; payload: IOperator }, thunk) => {
    return await service.update(id, payload);
  }
);

export const vetProfileSection = createAsyncThunk(
  `${subject}/vet-section`,
  async ({ id, payload }: { id: string; payload: any }, thunk) => {
    return await service.vetProfileSection(id, payload);
  }
);

export const Slice = createSlice({
  name: subject,
  initialState,
  reducers: {
    resetDrawers(state) {
      state.drawers = initialState.drawers;
    },
    showOperatorDrawer(state, action) {
      const operator = state.operators.find((operator) => operator._id === action.payload);
      if (operator) {
        state.drawers = {
          ...state.drawers,
          operatorDetails: {
            isOpen: true,
            operator: operator,
          }
        };
        state.currentOperator = operator;
      }
    },
    hideOperatorDrawer(state) {
      state.drawers = {
        ...state.drawers,
        operatorDetails: {
          isOpen: false,
          operator: undefined,
        }
      };
    },
    resetActionStates(state) {
      state.loading = initialState.loading;
      state.success = initialState.success;
      state.error = initialState.error;
    },
    setOperators(state, action: PayloadAction<IOperator[]>) {
      state.operators = action.payload;
    },
    addOperator(state, action: PayloadAction<IOperator>) {
      state.operators.push(action.payload);
    },
    updateOperator(state, action: PayloadAction<IOperator>) {
      const index = state.operators.findIndex((operator: IOperator) => {
        if (index !== -1) {
          state.operators[index] = action.payload;
        }
      });
    },
    deleteOperator(state, action: PayloadAction<IOperator>) {
      state.operators = state.operators.filter(
        (operator: IOperator) => operator._id !== action.payload._id
      );
    },
    setCurrentOperator(state, action: PayloadAction<IOperator>) {
      state.currentOperator = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentOperator.pending, (state, action) => {
      state.loading.getRecord = true;
    });
    builder.addCase(getCurrentOperator.fulfilled, (state, action) => {
      state.loading.getRecord = false;
      state.currentOperator = action.payload;
    });
    builder.addCase(getCurrentOperator.rejected, (state, action) => {
      state.loading.getRecord = false;
      state.error.getRecord = action.error.message;
    });
    builder.addCase(fetchOperators.pending, (state, action) => {
      state.loading.listRecords = true;
    });
    builder.addCase(fetchOperators.fulfilled, (state, action) => {
      state.loading.listRecords = false;
      state.operators = action.payload;
    });
    builder.addCase(fetchOperators.rejected, (state, action) => {
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(createOperator.pending, (state, action) => {
      state.loading.createRecord = true;
    });
    builder.addCase(createOperator.fulfilled, (state, action) => {
      state.loading.createRecord = false;
      state.createdOperator = action.payload;
    });
    builder.addCase(createOperator.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(update.pending, (state, action) => {
      state.loading.updateRecord = true;
    });
    builder.addCase(update.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
    });
    builder.addCase(
      update.fulfilled,
      (state, action: PayloadAction<IOperator>) => {
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
        if (state.currentOperator?._id == action.payload._id) {
          state.currentOperator = action.payload;
        }
      }
    );
    builder.addCase(vetProfileSection.pending, (state, action) => {
      state.loading.updateRecord = true;
    });
    builder.addCase(vetProfileSection.rejected, (state, action) => {
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
    });
    builder.addCase(
      vetProfileSection.fulfilled,
      (state, action: PayloadAction<IOperator>) => {
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
        if (state.currentOperator?._id == action.payload._id) {
          state.currentOperator = action.payload;
          state.drawers = {
            ...state.drawers,
            operatorDetails: {
              ...state.drawers.operatorDetails,
              operator: action.payload
            }
          }
        }
      }
    );
  },
});

export const {
  showOperatorDrawer,
  hideOperatorDrawer,
  resetDrawers,
  setOperators,
  setCurrentOperator,
  addOperator,
  updateOperator,
  deleteOperator,
  resetActionStates,
} = Slice.actions;

export default Slice.reducer;
