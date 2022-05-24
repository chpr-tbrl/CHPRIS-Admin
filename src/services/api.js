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
    newRecord: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records`,
        method: "POST",
        body: data,
      }),
    }),
    getRecords: builder.query({
      query: (auth) => ({
        url: `/users/${auth.uid}/sites/${auth.site_id}/regions/${auth.region_id}/records`,
        method: "get",
      }),
    }),
    newSpecimen: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/specimen_collections`,
        method: "POST",
        body: data,
      }),
    }),
    getSpecimens: builder.query({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/specimen_collections`,
        method: "get",
      }),
    }),
    newLabResult: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/labs`,
        method: "POST",
        body: data,
      }),
    }),
    getLabResults: builder.query({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/labs`,
        method: "get",
      }),
    }),
    newFollowUp: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/follow_ups`,
        method: "POST",
        body: data,
      }),
    }),
    getFollowUps: builder.query({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/follow_ups`,
        method: "get",
      }),
    }),
    newOutcome: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/outcome_recorded`,
        method: "POST",
        body: data,
      }),
    }),
    getOutcomes: builder.query({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/outcome_recorded`,
        method: "get",
      }),
    }),
    newTreatmentOutcome: builder.mutation({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/tb_treatment_outcomes`,
        method: "POST",
        body: data,
      }),
    }),
    getTreatmentOutcomes: builder.query({
      query: (data) => ({
        url: `/users/${data.uid}/sites/${data.site_id}/regions/${data.region_id}/records/${data.record_id}/tb_treatment_outcomes`,
        method: "get",
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useSignupMutation,
  useGetRecordsQuery,
  useNewRecordMutation,
  useGetSpecimensQuery,
  useNewSpecimenMutation,
  useGetLabResultsQuery,
  useNewLabResultMutation,
  useGetFollowUpsQuery,
  useNewFollowUpMutation,
  useGetOutcomesQuery,
  useNewOutcomeMutation,
  useGetTreatmentOutcomesQuery,
  useNewTreatmentOutcomeMutation,
} = API;
