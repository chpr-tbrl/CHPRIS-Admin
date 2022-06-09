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
    credentials: "include",
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
        url: "/regions",
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
    getSites: builder.query({
      query: (id) => ({
        url: `/regions/${id}/sites`,
        method: "GET",
      }),
    }),
    newSite: builder.mutation({
      query: (data) => ({
        url: `/admin/regions/${data.id}/sites`,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    dataExport: builder.mutation({
      query: ({ region_id, site_id, format, start_date, end_date }) => ({
        url: `/regions/${region_id}/sites/${site_id}/exports/${format}?start_date=${start_date}&end_date=${end_date}`,
        method: "GET",
        responseHandler: (response) => {
          return response.status === 200 ? response.text() : response.json();
        },
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
  useGetSitesQuery,
  useNewSiteMutation,
  useGetProfileQuery,
  useDataExportMutation,
} = API;
