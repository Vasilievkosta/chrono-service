import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://render-clock.onrender.com",
  }),
  tagTypes: ["City"],
  endpoints: () => ({}),
})
