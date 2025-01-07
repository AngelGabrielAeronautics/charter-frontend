import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { eRoutes } from "@/app/(config)/routes";

import { IAuthState } from "@/lib/models/IAuth.model";
import { IOperator } from "@/lib/models/IOperators";

import { auth } from "@/lib/firebase/firebase";
import { checkActionCode, confirmPasswordReset } from "firebase/auth";
import {
  IFederatedUser,
  IPasswordResetPayload,
  ISignInPayload,
  ISignUpPayload,
  clearSession,
  createFirebaseAccount,
  handleFederatedAccountSignIn,
  sendResetPasswordLink,
  signIn,
  updateUserPassword
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
    signOut: false,
  },
  loading: {
    updatePassword: false,
    resetPassword: false,
    createAccount: false,
    authenticate: false,
    signOut: false,
  },
  error: {
    updatePassword: null,
    resetPassword: null,
    createAccount: null,
    authenticate: null,
    signOut: null,
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

      if (result.hasError) throw new Error("Password reset failed", {
        cause: result.error,
      });

      return result;
    } catch (error: any) {
      throw new Error("Password reset failed", {
        cause: error
      });
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: IPasswordResetPayload, thunkAPI) => {
    const { oobCode, newPassword } = payload;

    try {
      await checkActionCode(auth, oobCode)
        .then((info) => {
          // Action code is valid.
          console.log(info)
        })
        .catch((err) => {
          // Handle error.
          return thunkAPI.rejectWithValue({
            message: 'Password reset failed due to invalid action code',
            error: err
          });
        });

      await confirmPasswordReset(auth, oobCode, newPassword)
        .then(() => {
          return { message: 'Password successfully reset' }
        })
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        message: err.code == 'auth/invalid-action-code' ? 'Password reset failed due to invalid action code' : 'Password reset failed due to an unknown error',
        error: err.message
      });
    }
  }
);

export const sendFirebaseResetPasswordLink = createAsyncThunk(
  "auth/sendResetPasswordLink",
  async (email: string) => {
    try {
      const result = await sendResetPasswordLink(email);

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
      .addCase(sendFirebaseResetPasswordLink.pending, (state) => {
        state.resettingPassword = true;
        state.hasError = false;
        state.errorMessage = "";
      })
      .addCase(sendFirebaseResetPasswordLink.rejected, (state, action: PayloadAction<any>) => {
        state.resettingPassword = false;
        state.hasError = true;
        state.errorMessage = action.payload.error.message;
      })
      .addCase(sendFirebaseResetPasswordLink.fulfilled, (state) => {
        state.resettingPassword = false;
        state.redirect = { shouldRedirect: true, redirectPath: eRoutes.login };
      })
      .addCase(signOut.pending, (state) => {
        state.loading.signOut = true;
        state.success.signOut = false;
        state.error.signOut = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading.signOut = false;
        state.success.signOut = true;
        state.isAuthenticated = false;
        state.authenticatedUser = undefined;
      })
      .addCase(signOut.rejected, (state, action: any) => {
        console.log("Sign out failed! Payload =>", action.payload ?? " undefined")
        console.log("Sign out failed! Error message =>", action.payload?.error?.message ?? "No message - Something went wrong...")
        state.loading.signOut = false;
        state.error.signOut = action.payload?.error?.message ?? "Sign out failed! Something went wrong...";
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
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.success.updatePassword = false;
        state.loading.updatePassword = true;
        state.error.updatePassword = null;
      })
      .addCase(resetUserPassword.fulfilled, (state, action: any) => {
        console.log("resetUserPassword ~ fulfilled ~ action", action)
        state.success.updatePassword = true;
        state.loading.updatePassword = false;
      })
      .addCase(resetUserPassword.rejected, (state, action: any) => {
        console.log("resetUserPassword ~ rejected ~ action", action)
        state.loading.updatePassword = false;
        state.error.updatePassword = action.payload.message;
      });
  },
});

export const { setAuthenticatedUser, setRole, setOperator, resetRedirect, resetActionStates } = AuthSlice.actions;

// Selectors
export const authenticated_user = (state: RootState) => state.auth.authenticatedUser;
export const signed_in = (state: RootState) => state.auth.isAuthenticated;

export default AuthSlice.reducer;
