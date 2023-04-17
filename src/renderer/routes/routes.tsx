import React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { urls } from './urls';
import NavigatorLayout from 'renderer/layout/navigator/NavigatorLayout';
import Home from 'renderer/pages/navigator/home';
import Error from 'renderer/pages/general/error';
import InstanceDashboard from 'renderer/pages/navigator/instance/dashboard';
import InstanceLayout from 'renderer/layout/instance/InstanceLayout';
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
import DaemonUnhealthy from '../layout/daemon/components/DaemonUnhealthy';
import DaemonLayout from '../layout/daemon/DaemonLayout';
import AbilityGuard from './guards/AbilityGuard';

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
              element: (
                <AbilityGuard ability={'LOGGERS'}>
                  <ApplicationLoggers />
                </AbilityGuard>
              ),
            },
            {
              path: urls.applicationCaches.path,
              element: (
                <AbilityGuard ability={'CACHES'}>
                  <ApplicationCaches />
                </AbilityGuard>
              ),
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
              element: (
                <AbilityGuard ability={'METRICS'}>
                  <InstanceMetrics />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceEnvironment.path,
              element: (
                <AbilityGuard ability={'ENV'}>
                  <InstanceEnvironment />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceSystemEnvironment.path,
              element: (
                <AbilityGuard ability={'SYSTEM_ENVIRONMENT'}>
                  <InstanceSystemEnvironment />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceBeans.path,
              element: (
                <AbilityGuard ability={'BEANS'}>
                  <InstanceBeans />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceBeansGraph.path,
              element: (
                <AbilityGuard ability={'BEANS'}>
                  <InstanceBeansGraph />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceHttpRequests.path,
              element: (
                <AbilityGuard ability={'HTTP_REQUEST_STATISTICS'}>
                  <InstanceHttpRequests />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceQuartz.path,
              element: (
                <AbilityGuard ability={'QUARTZ'}>
                  <InstanceQuartz />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceScheduledTasks.path,
              element: (
                <AbilityGuard ability={'SCHEDULEDTASKS'}>
                  <InstanceScheduledTasks />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceMappings.path,
              element: (
                <AbilityGuard ability={'MAPPINGS'}>
                  <InstanceMappings />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceFlyway.path,
              element: (
                <AbilityGuard ability={'FLYWAY'}>
                  <InstanceFlyway />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceLiquibase.path,
              element: (
                <AbilityGuard ability={'LIQUIBASE'}>
                  <InstanceLiquibase />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceProperties.path,
              element: (
                <AbilityGuard ability={'PROPERTIES'}>
                  <InstanceProperties />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceSystemProperties.path,
              element: (
                <AbilityGuard ability={'SYSTEM_PROPERTIES'}>
                  <InstanceSystemProperties />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceIntegrationGraph.path,
              element: (
                <AbilityGuard ability={'INTEGRATIONGRAPH'}>
                  <InstanceIntegrationGraph />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceLoggers.path,
              element: (
                <AbilityGuard ability={'LOGGERS'}>
                  <InstanceLoggers />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceCaches.path,
              element: (
                <AbilityGuard ability={'CACHES'}>
                  <InstanceCaches />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceThreadDump.path,
              element: (
                <AbilityGuard ability={'THREADDUMP'}>
                  <InstanceThreadProfiling />
                </AbilityGuard>
              ),
            },
            {
              path: urls.instanceHeapDump.path,
              element: (
                <AbilityGuard ability={'HEAPDUMP'}>
                  <InstanceHeapdumpReferences />
                </AbilityGuard>
              ),
            },
          ],
        },
        { path: '*', element: <Navigate to={urls.error.url} replace /> },
      ],
    },

    // Daemon Routes
    {
      path: urls.daemon.path,
      element: <DaemonLayout />,
      children: [
        { path: '', element: <Navigate to={urls.applicationInstances.path} replace /> },
        {
          path: urls.daemonUnhealthy.path,
          element: <DaemonUnhealthy />,
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
