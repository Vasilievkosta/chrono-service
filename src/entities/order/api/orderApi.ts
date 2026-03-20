import { baseApi } from '../../../shared/api/baseApi';

export interface CreateOrderRequest {
  date: string;
  time: string;
  duration: number;
  city_id: string;
  master_id: number;
  userName: string;
  email: string;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<unknown, CreateOrderRequest>({
      query: (body) => ({
        url: '/api/order/createAndSend',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
