// user management
import { API } from "services";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    saveAccount: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearAccount: (state) => {
      return {
        ...state,
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      API.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        return {
          ...state,
          ...payload,
        };
      }
    );
  },
});

// Action creators are generated for each reducer function
export const { saveAccount, clearAccount } = accountSlice.actions;

// auth selector
export const accountSelector = (state) => state.account;

export default accountSlice.reducer;
