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
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),
    logOut: builder.mutation({
      query: (data) => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/admin/users/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, account_status }) => ({
        url: `/admin/users/${id}`,
        method: "POST",
        body: { account_status },
      }),
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params,
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
    updateRegion: builder.mutation({
      query: (data) => ({
        url: `/admin/regions/${data.id}`,
        method: "PUT",
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
    updateSite: builder.mutation({
      query: (data) => ({
        url: `/admin/sites/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/admin/profile",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/users",
        method: data.method,
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response.users_sites,
    }),
    addUserSite: builder.mutation({
      query: ({ id, site }) => ({
        url: `/admin/users/${id}/sites`,
        method: "POST",
        body: site,
      }),
    }),
    deleteUserSite: builder.mutation({
      query: ({ id, site }) => ({
        url: `/admin/users/${id}/sites`,
        method: "DELETE",
        body: site,
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogOutMutation,
  useSignupMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetRegionsQuery,
  useNewRegionMutation,
  useGetSitesQuery,
  useNewSiteMutation,
  useGetProfileQuery,
  useUpdateSiteMutation,
  useGetUserProfileQuery,
  useAddUserSiteMutation,
  useUpdateRegionMutation,
  useUpdateProfileMutation,
  useDeleteUserSiteMutation,
  useUpdateUserStatusMutation,
} = API;
