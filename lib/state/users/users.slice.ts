import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE_URL } from "@/app/(config)/constants";

import { eModules } from "@/lib/enums/modules.enums";
import { IUser, IUserUpdate } from "@/lib/models/IUser";
import { INotify } from "@/lib/models/utility.model";
import UserService from "@/lib/services/user.service";

import { setAuthenticatedUser } from "../auth/auth.slice";

const subject = eModules.UsersModule;
const service = new UserService(eModules.UsersModule);

export interface IUpdateUserDto {
  id: string;
  isCurrentUser: boolean;
  updates: any;
}

interface UsersState {
  users: IUser[];
  selectedCustomer?: IUser;
  isFetchingCustomer: boolean;
  isFetchingUsers: boolean;
  isUpdatingUser: boolean;
  notify: INotify;
  error: {
    addBillingAddress: any;
    createRecord: any;
    updateRecord: any;
    listRecords: any;
  };
  loading: {
    addBillingAddress: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    listRecords: boolean;
  };
  success: {
    addBillingAddress: boolean;
    createRecord: boolean;
    updateRecord: boolean;
    listRecords: boolean;
  };
}

const initialState: UsersState = {
  users: [],
  isFetchingUsers: false,
  isFetchingCustomer: false,
  isUpdatingUser: false,
  notify: {
    shouldNotify: false,
    type: "info",
    title: "",
    message: "",
  },
  error: {
    addBillingAddress: null,
    createRecord: null,
    updateRecord: null,
    listRecords: null,
  },
  loading: {
    addBillingAddress: false,
    createRecord: false,
    updateRecord: false,
    listRecords: false,
  },
  success: {
    addBillingAddress: false,
    createRecord: false,
    updateRecord: false,
    listRecords: false,
  },
};

export const fetchUsers = createAsyncThunk(`${subject}/fetchAll`, async () => {
  return await service.findAll();
});

export const createUser = createAsyncThunk(
  `${subject}/create`,
  async (payload: IUser, thunk) => {
    return await service.create(payload);
  }
);

export const addTeamMember = createAsyncThunk(
  `${subject}/team-member/add`,
  async (payload: IUser, thunk) => {
    return await service.addTeamMember(payload);
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, payload }: { id: string; payload: IUserUpdate }, thunk) => {
    const updatedUser = await service.update(id, payload);
    thunk.dispatch(setAuthenticatedUser(updatedUser));
    return updatedUser;
  }
);

export const filter = createAsyncThunk(
  `${subject}/filter`,
  async (payload: any, thunk) => {
    return await service.findByFilter(payload);
  }
);

export const findByOperator = createAsyncThunk(
  `${subject}/findByOperator`,
  async (id: string, thunk) => {
    return await service.findByOperator(id);
  }
);

export const addBillingAddress = createAsyncThunk(
  `${subject}/add-billing-address`,
  async (payload: IUpdateUserDto, thunk) => {
    const { id, updates } = payload;
    return await service.update(id, updates);
  }
);

export const getCustomerById = createAsyncThunk(
  `${subject}/getCustomer`,
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    const data = await response.json();
    return data;
  }
);

export const UsersSlice = createSlice({
  name: subject,
  initialState,
  reducers: {
    resetActionStates(state) {
      state.loading = initialState.loading;
      state.success = initialState.success;
      state.error = initialState.error;
    },
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload;
    },
    addUser(state, action: PayloadAction<IUser>) {
      state.users.push(action.payload);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(
        (users: IUser) => users._id != action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUser.pending, (state, action) => {
      state.isUpdatingUser = true;
      state.loading.updateRecord = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isUpdatingUser = false;
      state.loading.updateRecord = false;
      state.error.updateRecord = action.error.message;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.isUpdatingUser = false;
        state.loading.updateRecord = false;
        state.success.updateRecord = true;
      }
    );
    builder.addCase(addTeamMember.pending, (state, action) => {
      state.loading.createRecord = true;
      state.success.createRecord = false;
    });
    builder.addCase(addTeamMember.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      addTeamMember.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.users.push(action.payload);
      }
    );
    builder.addCase(createUser.pending, (state, action) => {
      state.loading.createRecord = true;
      state.success.createRecord = false;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading.createRecord = false;
      state.error.createRecord = action.error.message;
    });
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading.createRecord = false;
        state.success.createRecord = true;
        state.users.push(action.payload);
      }
    );
    builder.addCase(addBillingAddress.pending, (state, action) => {
      state.isUpdatingUser = true;
      state.loading.addBillingAddress = true;
      state.success.addBillingAddress = false;
    });
    builder.addCase(addBillingAddress.rejected, (state, action) => {
      state.isUpdatingUser = false;
      state.loading.addBillingAddress = false;
      state.error.addBillingAddress = action.error.message;
    });
    builder.addCase(
      addBillingAddress.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.isUpdatingUser = false;
        state.loading.addBillingAddress = false;
        state.success.addBillingAddress = true;
      }
    );
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.isFetchingUsers = true;
      state.loading.listRecords = true;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isFetchingUsers = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<IUser[]>) => {
        state.isFetchingUsers = false;
        state.loading.listRecords = false;
        state.users = action.payload;
      }
    );
    builder.addCase(findByOperator.pending, (state, action) => {
      state.isFetchingUsers = true;
      state.loading.listRecords = true;
    });
    builder.addCase(findByOperator.rejected, (state, action) => {
      state.isFetchingUsers = false;
      state.loading.listRecords = false;
      state.error.listRecords = action.error.message;
    });
    builder.addCase(
      findByOperator.fulfilled,
      (state, action: PayloadAction<IUser[]>) => {
        state.isFetchingUsers = false;
        state.loading.listRecords = false;
        state.success.listRecords = true;
        state.users = action.payload;
      }
    );
    builder.addCase(getCustomerById.pending, (state) => {
      state.isFetchingCustomer = true;
    });
    builder.addCase(getCustomerById.rejected, (state, action) => {
      state.isFetchingCustomer = false;
    });
    builder.addCase(
      getCustomerById.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.isFetchingCustomer = false;
        state.selectedCustomer = action.payload;
      }
    );
  },
});

export const { setUsers, addUser, deleteUser, resetActionStates } =
  UsersSlice.actions;
export default UsersSlice.reducer;
