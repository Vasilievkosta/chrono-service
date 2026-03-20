import { baseApi } from "../../../shared/api/baseApi"

export interface MasterRequest {
  cityId: string
  date: string
  time: string
  duration: number
}

export interface Master {
  id: number
  name: string
  rating_id: number
}

export const masterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableMasters: builder.mutation<Master[], MasterRequest>({
      query: (body) => ({
        url: "/api/master/datetime",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useGetAvailableMastersMutation } = masterApi
