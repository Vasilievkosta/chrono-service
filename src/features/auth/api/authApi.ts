import { baseApi } from "../../../shared/api/baseApi"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: boolean
  token: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
