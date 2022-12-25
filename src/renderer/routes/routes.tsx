import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { urls } from './urls';
import NavigatorLayout from 'renderer/layout/navigator/NavigatorLayout';
import Home from 'renderer/pages/navigator/home';
import Error from 'renderer/pages/general/error';
import InstancePage from 'renderer/pages/navigator/instance';
import FolderPage from 'renderer/pages/navigator/folder';
import ApplicationPage from 'renderer/pages/navigator/application';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={urls.navigator.url} replace />,
    },

    // Navigator Routes
    {
      path: urls.navigator.path,
      element: <NavigatorLayout />,
      children: [
        { path: '', element: <Navigate to={urls.home.url} replace /> },
        {
          path: urls.home.path,
          element: <Home />,
        },
        {
          path: urls.folder.path,
          element: <FolderPage />,
        },
        {
          path: urls.application.path,
          element: <ApplicationPage />,
        },
        {
          path: urls.instance.path,
          element: <InstancePage />,
        },
        { path: '*', element: <Navigate to={urls.error.url} replace /> },
      ],
    },

    // General Routes
    {
      path: '*',
      element: <Outlet />,
      children: [
        { path: urls.error.path, element: <Error /> },
        { path: '*', element: <Navigate to={urls.error.url} replace /> },
      ],
    },
    { path: '*', element: <Navigate to={urls.error.url} replace /> },
  ]);
}
