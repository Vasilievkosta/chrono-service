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

export interface UpdateOrderRequest {
  orderId: number;
  date: string;
  time: string;
  duration: number;
  user_id: number;
  master_id: number;
}

export interface UpdateOrderResponse {
  id: number;
  date: string;
  time: string;
  duration: number;
  user_id: number;
  master_id: number;
}

export interface DeleteOrderResponse {
  id: number;
  date: string;
  time: string;
  duration: number;
  user_id: number;
  master_id: number;
}

export interface OrderItem {
  id: number;
  date: string;
  time: string;
  duration: number;
  user_id?: number;
  master_id?: number;
  city_id?: number;
  city: {
    id?: number;
    title: string;
  };
  master: {
    id?: number;
    name: string;
  };
  user: {
    id?: number;
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
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query<OrderItem[], void>({
      query: () => '/api/order',
      providesTags: ['Order'],
    }),
    updateOrder: builder.mutation<UpdateOrderResponse, UpdateOrderRequest>({
      query: (body) => ({
        url: '/api/order/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation<DeleteOrderResponse, number>({
      query: (id) => ({
        url: `/api/order/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
