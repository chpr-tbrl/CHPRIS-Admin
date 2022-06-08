// user management
import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
  uid: "",
  account_type: "",
  account_status: "",
  permitted_approve_accounts: false,
  permitted_decrypted_data: false,
  permitted_export_range: 1,
  permitted_export_types: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveAuth: (state, action) => {
      return {
        ...state,
        uid: action.payload.id,
        account_type: action.payload.account_type,
        account_status: action.payload.account_status,
        permitted_approve_accounts: action.payload.permitted_approve_accounts,
        permitted_decrypted_data: action.payload.permitted_decrypted_data,
        permitted_export_range: action.payload.permitted_export_range,
        permitted_export_types: action.payload.permitted_export_types,
      };
    },
    clearAuth: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
});

// Action creators are generated for each reducer function
export const { saveAuth, clearAuth } = authSlice.actions;

// auth selector
export const authSelector = (state) => state.auth;

export const logout = createAction("LOG_OUT");

export default authSlice.reducer;
