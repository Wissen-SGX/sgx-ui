import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { BacktestProvider } from '@/contexts/BacktestContext';
import { store } from '@/store';
import './index.css';

export default function App() {
  return (
    <Provider store={store}>
      <BacktestProvider>
        <RouterProvider router={router} />
      </BacktestProvider>
    </Provider>
  );
}
