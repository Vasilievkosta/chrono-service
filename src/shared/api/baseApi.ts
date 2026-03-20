import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TOKEN_STORAGE } from '../lib/auth';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://render-clock.onrender.com',
    prepareHeaders: (headers) => {
      const token = typeof window === 'undefined'
        ? null
        : localStorage.getItem(TOKEN_STORAGE);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['City'],
  endpoints: () => ({}),
});
