import { baseApi } from '../../../shared/api/baseApi';

export interface MasterRequest {
  cityId: string;
  date: string;
  time: string;
  duration: number;
}

export interface Master {
  id: number;
  name: string;
  rating_id: number;
}

export interface MasterRating {
  id: number;
  rating: number;
}

export interface MasterOfCities {
  master_id: number;
  master_name: string;
  master_rating: number;
  cities: Array<{
    id: number;
    title: string;
  }>;
}

export interface CreateMasterRequest {
  newName: string;
  arr: number[];
  rating_id: string;
}

export interface UpdateMasterRequest {
  masterId: number;
  newName: string;
  ratingId: number;
  arr: number[];
}

export const masterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableMasters: builder.mutation<Master[], MasterRequest>({
      query: (body) => ({
        url: '/api/master/datatime',
        method: 'POST',
        body,
      }),
    }),
    getMasters: builder.query<MasterOfCities[], void>({
      query: () => '/api/master/ofcities',
      providesTags: ['Master'],
    }),
    getRatings: builder.query<MasterRating[], void>({
      query: () => '/api/master/ratings',
    }),
    createMaster: builder.mutation<Master[], CreateMasterRequest>({
      query: (body) => ({
        url: '/api/master/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Master'],
    }),
    updateMaster: builder.mutation<Master, UpdateMasterRequest>({
      query: (body) => ({
        url: '/api/master/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Master'],
    }),
    deleteMaster: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/api/master/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Master'],
    }),
  }),
});

export const {
  useGetAvailableMastersMutation,
  useGetMastersQuery,
  useGetRatingsQuery,
  useCreateMasterMutation,
  useUpdateMasterMutation,
  useDeleteMasterMutation,
} = masterApi;
