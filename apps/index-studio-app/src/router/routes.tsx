import { lazy } from 'react';
import { Navigate, redirect, RouteObject } from 'react-router-dom';
import { fetchCurrentUser } from '@/api/auth.api';

const authLoader = async () => {
  const user = await fetchCurrentUser();
  if (!user) return redirect('/auth');
  return null;
};

const BacktestDashboardPage = lazy(() => import('@/features/backtest/steps/dashboard/BacktestDashboardPage'));
const BacktestDetailPage = lazy(() => import('@/features/backtest/steps/dashboard/components/BacktestDetailPage'));
const CreateIndexPage = lazy(() => import('@/features/backtest/steps/create-index/CreateIndexPage'));
const EditBacktestPage = lazy(() => import('@/features/backtest/steps/create-index/components/EditBacktestPage'));

const UniverseSelectionPage = lazy(() => import('@/features/parameters-configuration/steps/universe-selection/UniverseSelectionPage'));
const FilteringPage = lazy(() => import('@/features/parameters-configuration/steps/filtering/FilteringPage'));
const CreateFilterSet = lazy(() => import('@/features/parameters-configuration/steps/filtering/components/CreateFilterSet'));
const GenerateUniversePage = lazy(() => import('@/features/parameters-configuration/steps/generate-universe/GenerateUniversePage'));
const CreateUniverseConfiguration = lazy(
  () => import('@/features/parameters-configuration/steps/generate-universe/components/CreateUniverseConfiguration')
);
const UniverseHistory = lazy(() => import('@/features/parameters-configuration/steps/universe-selection/components/UniverseHistory'));
const UniverseEditDetails = lazy(() => import('@/features/parameters-configuration/steps/universe-selection/components/UniverseEditDetails'));
const FilterSetDetail = lazy(() => import('@/features/parameters-configuration/steps/filtering/components/FilterSetDetail'));
const PackagesUiPage = lazy(() => import('@/components/PackagesUiPage/PackagesUiPage'));
const Layout = lazy(() => import('@layout/Layout'));

export const routes: RouteObject[] = [
  {
    path: '/',
    loader: authLoader,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/backtest/dashboard" replace />,
      },
      {
        path: 'backtest/dashboard',
        element: <BacktestDashboardPage />,
      },
      {
        path: 'backtest/create-index',
        element: <CreateIndexPage />,
      },
      {
        path: 'backtest/dashboard/:id',
        element: <BacktestDetailPage />,
      },
      {
        path: 'backtest/dashboard/:id/edit',
        element: <EditBacktestPage />,
      },
      {
        path: 'parameters/universe',
        element: <UniverseSelectionPage />,
      },
      {
        path: 'parameters/universe/:universeId/history',
        element: <UniverseHistory />,
      },
      {
        path: 'parameters/universe/:universeId/edit',
        element: <UniverseEditDetails />,
      },
      {
        path: 'parameters/filtering',
        element: <FilteringPage />,
      },
      {
        path: 'parameters/filtering/create',
        element: <CreateFilterSet />,
      },
      {
        path: 'parameters/filtering/:filterId/view',
        element: <FilterSetDetail />,
      },
      {
        path: 'parameters/configure-universe',
        element: <GenerateUniversePage />,
      },
      {
        path: 'parameters/configure-universe/create',
        element: <CreateUniverseConfiguration />,
      },
      {
        path: 'ui-components',
        element: <PackagesUiPage />,
      },
    ],
  },
];
