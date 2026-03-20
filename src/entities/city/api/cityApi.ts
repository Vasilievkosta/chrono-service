import { baseApi } from '../../../shared/api/baseApi';

export interface City {
  id: number;
  title: string;
}

export interface CreateCityRequest {
  newTitle: string;
}

export interface UpdateCityRequest {
  cityId: number;
  newTitle: string;
}

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => '/api/city',
      providesTags: ['City'],
    }),
    createCity: builder.mutation<City, CreateCityRequest>({
      query: (body) => ({
        url: '/api/city/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['City'],
    }),
    updateCity: builder.mutation<City, UpdateCityRequest>({
      query: (body) => ({
        url: '/api/city/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['City'],
    }),
    deleteCity: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/api/city/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['City'],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = cityApi;
