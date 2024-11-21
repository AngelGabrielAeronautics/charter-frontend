import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { eRoutes } from "@/app/(config)/routes";

import { IAuthState } from "@/lib/models/IAuth.model";
import { IOperator } from "@/lib/models/IOperators";

import {
  IFederatedUser,
  ISignInPayload,
  ISignUpPayload,
  clearSession,
  createFirebaseAccount,
  handleFederatedAccountSignIn,
  resetFirebasePassword,
  signIn,
  updateUserPassword,
} from "../../firebase/auth.service";
import { IUser } from "../../models/IUser";
import { RootState } from "../store";

const initialState: IAuthState = {
  email: undefined,
  isAuthenticated: false,
  authenticatedUser: undefined,
  company: undefined,
  authenticating: false,
  resettingPassword: false,
  updatingPassword: false,
  creatingAccount: false,
  hasError: false,
  errorMessage: "",
  redirect: {
    shouldRedirect: false,
  },
  success: {
    updatePassword: false,
    resetPassword: false,
    createAccount: false,
    authenticate: false,
  },
  loading: {
    updatePassword: false,
    resetPassword: false,
    createAccount: false,
    authenticate: false,
  },
  error: {
    updatePassword: null,
    resetPassword: null,
    createAccount: null,
    authenticate: null,
  },
  notify: {
    shouldNotify: false,
    message: "",
    title: "",
    type: undefined,
  },
};

// #region Async Thunks
export const login = createAsyncThunk(
  "auth/login",
  async (authData: ISignInPayload, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    try {
      const result = await signIn(authData);

      if (result.hasError) return rejectWithValue(result.error);

      return result;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createAccount = createAsyncThunk(
  "auth/createAccount",
  async (userData: ISignUpPayload, thunk) => {
    const { rejectWithValue, dispatch } = thunk;
    try {
      const result = await createFirebaseAccount(userData);

      if (result.hasError) return rejectWithValue(result.error);

      return result;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createFederatedAccount = createAsyncThunk(
  "auth/createAccount/google",
  async (userData: IFederatedUser) => {
    try {
      const result = await handleFederatedAccountSignIn(userData);

      if (!result) return false;

      return result;
    } catch (error: any) {
      return false;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email: string) => {
    try {
      const result = await resetFirebasePassword(email);

      if (!result) return false;

      return result;
    } catch (error: any) {
      return false;
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (payload: any) => {
    const result = await updateUserPassword(
      payload.currentPassword,
      payload.newPassword
    );
    return result;
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  try {
    const result = await clearSession();

    if (!result.success) return false;

    return result;
  } catch (error: any) {
    return { success: false, error };
  }
});
// #endregion

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetActionStates: (state) => {
      state.loading = initialState.loading
      state.error = initialState.error
      state.success = initialState.success
    },
    setAuthenticatedUser: (state, action: PayloadAction<IUser>) => {
      state.authenticatedUser = action.payload;
      state.isAuthenticated = true;
    },
    setRole: (
      state,
      action: PayloadAction<
        | "Client"
        | "Operator"
        | "Agency"
        | "Administrator"
        | "Super User"
        | undefined
      >
    ) => {
      if (state.authenticatedUser && action.payload) {
        state.authenticatedUser.role = action.payload;
      }
    },
    setOperator: (state, action: PayloadAction<IOperator>) => {
      state.operator = action.payload;
    },
    resetRedirect: (state) => {
      state.redirect = { shouldRedirect: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFederatedAccount.pending, (state) => {
        state.creatingAccount = true;
        state.hasError = false;
        state.errorMessage = "";
      })
      .addCase(
        createFederatedAccount.rejected,
        (state, action: PayloadAction<any>) => {
          state.creatingAccount = false;
          state.hasError = true;
          state.errorMessage = action.payload.error.message;
        }
      )
      .addCase(createFederatedAccount.fulfilled, (state, action) => {
        state.creatingAccount = false;
        state.isAuthenticated = true;
        state.authenticatedUser = action.payload.user;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resettingPassword = true;
        state.hasError = false;
        state.errorMessage = "";
      })
      .addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
        state.resettingPassword = false;
        state.hasError = true;
        state.errorMessage = action.payload.error.message;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resettingPassword = false;
        state.redirect = { shouldRedirect: true, redirectPath: eRoutes.login };
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.authenticatedUser = undefined;
      })
      .addCase(login.pending, (state) => {
        state.authenticating = true;
        state.hasError = false;
        state.errorMessage = "";
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.authenticating = false;
        state.isAuthenticated = true;
        state.authenticatedUser = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        let errorMessage = action.payload.message.toString();

        if (action.payload.code) {
          switch (action.payload.code) {
            case "auth/invalid-credential":
              errorMessage = "Invalid username or password";
              break;
            case "auth/too-many-requests":
              errorMessage =
                "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
              break;
          }
        }

        state.authenticating = false;
        state.isAuthenticated = false;
        state.hasError = true;
        state.errorMessage = errorMessage;
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.creatingAccount = false;
          state.isAuthenticated = true;
          state.authenticatedUser = action.payload;
        }
      )
      .addCase(createAccount.pending, (state) => {
        state.hasError = false;
        state.errorMessage = "";
        state.creatingAccount = true;
      })
      .addCase(createAccount.rejected, (state, action: PayloadAction<any>) => {
        let errorMessage = action.payload.message.toString();

        if (action.payload.code) {
          switch (action.payload.code) {
            case "auth/email-already-in-use":
              errorMessage = "Email account already in use";
              break;
            default:
              errorMessage = "Account creation failed. Something went wrong.";
              break;
          }
        }

        state.creatingAccount = false;
        state.hasError = true;
        state.errorMessage = errorMessage;
      })
      .addCase(updatePassword.pending, (state) => {
        state.hasError = false;
        state.errorMessage = "";
        state.updatingPassword = true;
        // New action state objects
        state.success.updatePassword = false;
        state.loading.updatePassword = true;
        state.error.updatePassword = null;
      })
      .addCase(updatePassword.fulfilled, (state, action: any) => {
        state.updatingPassword = false;
        // New action state objects
        state.success.updatePassword = true;
        state.loading.updatePassword = false;
      })
      .addCase(updatePassword.rejected, (state, action: PayloadAction<any>) => {
        let errorMessage = action.payload.message.toString();

        state.updatingPassword = false;
        state.hasError = true;
        state.errorMessage = errorMessage;

        // New action state objects
        state.loading.updatePassword = false;
        state.error.updatePassword = errorMessage;
      });
  },
});

export const { setAuthenticatedUser, setRole, setOperator, resetRedirect, resetActionStates } = AuthSlice.actions;

// Selectors
export const authenticated_user = (state: RootState) => state.auth.authenticatedUser;
export const signed_in = (state: RootState) => state.auth.isAuthenticated;

export default AuthSlice.reducer;
