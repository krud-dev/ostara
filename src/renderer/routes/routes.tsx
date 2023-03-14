import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { urls } from './urls';
import NavigatorLayout from 'renderer/layout/navigator/NavigatorLayout';
import Home from 'renderer/pages/navigator/home';
import Error from 'renderer/pages/general/error';
import InstanceDashboard from 'renderer/pages/navigator/instance/dashboard';
import InstanceLayout from 'renderer/layout/instance/InstanceLayout';
import SettingsLayout from 'renderer/layout/settings/SettingsLayout';
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
import InstanceLiquibase from 'renderer/pages/navigator/instance/liquibase';
import InstanceLoggers from 'renderer/pages/navigator/instance/loggers';
import ApplicationLoggers from 'renderer/pages/navigator/application/loggers';
import InstanceHeapdumpReferences from '../pages/navigator/instance/heapdumps';
import InstanceScheduledTasks from '../pages/navigator/instance/scheduled-tasks';
import InstanceQuartz from '../pages/navigator/instance/quartz';
import InstanceIntegrationGraph from '../pages/navigator/instance/integration-graph';
import InstanceSystemProperties from '../pages/navigator/instance/system-properties';
import InstanceSystemEnvironment from '../pages/navigator/instance/system-environment';
import FolderLayout from '../layout/folder/FolderLayout';
import FolderApplications from '../pages/navigator/folder/applications';
import InstanceThreadProfiling from '../pages/navigator/instance/threaddumps';
import InstanceMetrics from '../pages/navigator/instance/metrics';
import InstanceBeansGraph from '../pages/navigator/instance/beans-graph';
import InstanceMappings from '../pages/navigator/instance/mappings';

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
          element: <FolderLayout />,
          children: [
            { path: '', element: <Navigate to={urls.folderApplications.path} replace /> },
            {
              path: urls.folderApplications.path,
              element: <FolderApplications />,
            },
          ],
        },
        {
          path: urls.application.path,
          element: <ApplicationLayout />,
          children: [
            { path: '', element: <Navigate to={urls.applicationInstances.path} replace /> },
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
              element: <ApplicationLoggers />,
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
              element: <InstanceMetrics />,
            },
            {
              path: urls.instanceEnvironment.path,
              element: <InstanceEnvironment />,
            },
            {
              path: urls.instanceSystemEnvironment.path,
              element: <InstanceSystemEnvironment />,
            },
            {
              path: urls.instanceBeans.path,
              element: <InstanceBeans />,
            },
            {
              path: urls.instanceBeansGraph.path,
              element: <InstanceBeansGraph />,
            },
            {
              path: urls.instanceHttpRequests.path,
              element: <InstanceHttpRequests />,
            },
            {
              path: urls.instanceQuartz.path,
              element: <InstanceQuartz />,
            },
            {
              path: urls.instanceScheduledTasks.path,
              element: <InstanceScheduledTasks />,
            },
            {
              path: urls.instanceMappings.path,
              element: <InstanceMappings />,
            },
            {
              path: urls.instanceFlyway.path,
              element: <InstanceFlyway />,
            },
            {
              path: urls.instanceLiquibase.path,
              element: <InstanceLiquibase />,
            },
            {
              path: urls.instanceProperties.path,
              element: <InstanceProperties />,
            },
            {
              path: urls.instanceSystemProperties.path,
              element: <InstanceSystemProperties />,
            },
            {
              path: urls.instanceIntegrationGraph.path,
              element: <InstanceIntegrationGraph />,
            },
            {
              path: urls.instanceLoggers.path,
              element: <InstanceLoggers />,
            },
            {
              path: urls.instanceCaches.path,
              element: <InstanceCaches />,
            },
            {
              path: urls.instanceThreadDump.path,
              element: <InstanceThreadProfiling />,
            },
            {
              path: urls.instanceHeapDump.path,
              element: <InstanceHeapdumpReferences />,
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
