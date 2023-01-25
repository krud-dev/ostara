import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { urls } from './urls';
import NavigatorLayout from 'renderer/layout/navigator/NavigatorLayout';
import Home from 'renderer/pages/navigator/home';
import Error from 'renderer/pages/general/error';
import InstanceDashboard from 'renderer/pages/navigator/instance/dashboard';
import FolderPage from 'renderer/pages/navigator/folder';
import InstanceLayout from 'renderer/layout/instance/InstanceLayout';
import SettingsLayout from 'renderer/layout/settings/SettingsLayout';
import TasksPage from 'renderer/pages/navigator/settings/tasks';
import ApplicationLayout from 'renderer/layout/application/ApplicationLayout';
import ApplicationDashboard from 'renderer/pages/navigator/application/dashboard';
import InstanceEnvironment from 'renderer/pages/navigator/instance/environment';
import InstanceCaches from 'renderer/pages/navigator/instance/caches';
import ApplicationCaches from 'renderer/pages/navigator/application/caches';
import ApplicationInstances from 'renderer/pages/navigator/application/instances';
import InstanceBeans from 'renderer/pages/navigator/instance/beans';
import InstanceProperties from 'renderer/pages/navigator/instance/properties';
import InstanceHttpRequests from 'renderer/pages/navigator/instance/http-requests';
import InstanceFlyway from 'renderer/pages/navigator/instance/flyway';
import ApplicationSettingsPage from 'renderer/pages/navigator/settings/application';

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
          element: <ApplicationLayout />,
          children: [
            { path: '', element: <Navigate to={urls.applicationDashboard.path} replace /> },
            {
              path: urls.applicationDashboard.path,
              element: <ApplicationDashboard />,
            },
            {
              path: urls.applicationInstances.path,
              element: <ApplicationInstances />,
            },
            {
              path: urls.applicationLoggers.path,
              element: <ApplicationDashboard />,
            },
            {
              path: urls.applicationCaches.path,
              element: <ApplicationCaches />,
            },
          ],
        },
        {
          path: urls.instance.path,
          element: <InstanceLayout />,
          children: [
            { path: '', element: <Navigate to={urls.instanceDashboard.path} replace /> },
            {
              path: urls.instanceDashboard.path,
              element: <InstanceDashboard />,
            },
            {
              path: urls.instanceMetrics.path,
              element: <InstanceDashboard />,
            },
            {
              path: urls.instanceEnvironment.path,
              element: <InstanceEnvironment />,
            },
            {
              path: urls.instanceBeans.path,
              element: <InstanceBeans />,
            },
            {
              path: urls.instanceHttpRequests.path,
              element: <InstanceHttpRequests />,
            },
            {
              path: urls.instanceQuartz.path,
              element: <InstanceDashboard />,
            },
            {
              path: urls.instanceFlyway.path,
              element: <InstanceFlyway />,
            },
            {
              path: urls.instanceProperties.path,
              element: <InstanceProperties />,
            },
            {
              path: urls.instanceLoggers.path,
              element: <InstanceDashboard />,
            },
            {
              path: urls.instanceCaches.path,
              element: <InstanceCaches />,
            },
            {
              path: urls.instanceThreadDump.path,
              element: <InstanceDashboard />,
            },
            {
              path: urls.instanceHeapDump.path,
              element: <InstanceDashboard />,
            },
          ],
        },
        { path: '*', element: <Navigate to={urls.error.url} replace /> },
      ],
    },

    // Settings Routes
    {
      path: urls.settings.path,
      element: <SettingsLayout />,
      children: [
        { path: '', element: <Navigate to={urls.applicationSettings.path} replace /> },
        {
          path: urls.applicationSettings.path,
          element: <ApplicationSettingsPage />,
        },
        {
          path: urls.tasks.path,
          element: <TasksPage />,
        },
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
