import { baseApi } from '../../../shared/api/baseApi';

export interface AppUser {
  id: number;
  username: string;
  email: string;
  title: string;
  city_id?: number;
}

export interface UpdateUserRequest {
  id: number;
  userName: string;
  email: string;
  city_id: number;
}

export interface UpdateUserResponse {
  id: number;
  username: string;
  email: string;
  city_id: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<AppUser[], void>({
      query: () => '/api/user',
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: '/api/user/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User', 'Order'],
    }),
    deleteUser: builder.mutation<unknown, number>({
      query: (id) => ({
        url: `/api/user/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi;
