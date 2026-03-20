import { baseApi } from "../../../shared/api/baseApi"

export interface City {
  id: number
  title: string
}

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => "/api/city",
      providesTags: ["City"],
    }),
  }),
})

export const { useGetCitiesQuery } = cityApi
