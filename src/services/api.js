// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Define a service using a base URL and expected endpoints
export const API = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_VERSION}`,
    headers: {
      "content-type": "application/json",
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/admin/users/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
    }),
    getRegions: builder.query({
      query: () => ({
        url: "/admin/regions",
        method: "GET",
      }),
    }),
    newRegion: builder.mutation({
      query: (data) => ({
        url: "/admin/regions",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useSignupMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetRegionsQuery,
  useNewRegionMutation,
} = API;
