import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/guards/AuthGuard';
import { APP_NAME } from '@/utils/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];

  const isPublicRoute = publicRoutes.includes(router.pathname);

  const getLayout = Component.getLayout ?? ((page) => page);

  console.log('[App] Rendering', { route: router.pathname, isPublicRoute });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          <title>{APP_NAME}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {isPublicRoute ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <AuthGuard>
            {getLayout(<Component {...pageProps} />)}
          </AuthGuard>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
