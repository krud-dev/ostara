import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      retry: false,
    },
  },
});
export default queryClient;
