import { baseApi } from '../../../shared/api/baseApi';

export interface DemoResponse {
  id: number;
  title: string;
  description: string;
}

const mockResponse: DemoResponse = {
  id: 1,
  title: 'RTK Query mock request',
  description:
    'Данные приходят из mock endpoint через queryFn, без реального backend API.',
};

export const demoRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDemoMessage: builder.query<DemoResponse, void>({
      async queryFn() {
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        return { data: mockResponse };
      },
    }),
  }),
});

export const { useGetDemoMessageQuery } = demoRequestApi;

