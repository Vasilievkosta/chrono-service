import { baseApi } from '../../../shared/api/baseApi';

export interface AppUser {
  id: number;
  username: string;
  email: string;
  title: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<AppUser[], void>({
      query: () => '/api/user',
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
