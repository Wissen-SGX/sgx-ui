import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { BacktestProvider } from '@/contexts/BacktestContext';
import { store } from '@/store';
import { LoadingSpinner } from '@sgx/ui';
import './index.css';

export default function App() {
  return (
    <Provider store={store}>
      <BacktestProvider>
        <Suspense fallback={<LoadingSpinner fullscreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </BacktestProvider>
    </Provider>
  );
}
