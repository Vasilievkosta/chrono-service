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

export interface OrderItem {
  id: number;
  date: string;
  time: string;
  duration: number;
  city: {
    title: string;
  };
  master: {
    name: string;
  };
  user: {
    name: string;
    email: string;
  };
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
    getOrders: builder.query<OrderItem[], void>({
      query: () => '/api/order',
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = orderApi;
