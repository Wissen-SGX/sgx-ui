import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

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
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/parameters/universe" replace />,
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
