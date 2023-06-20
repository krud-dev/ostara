import React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
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
import DaemonUnhealthy from '../pages/daemon/unhealthy';
import AbilityRedirectGuard from './guards/AbilityRedirectGuard';
import InstanceAbilityErrorGuard from './guards/InstanceAbilityErrorGuard';
import AppLayout from '../layout/app/AppLayout';
import ErrorBoundaryNavigator from './ErrorBoundaryNavigator';
import { ErrorBoundary } from 'react-error-boundary';
import InstanceTogglz from '../pages/navigator/instance/togglz';
import ApplicationMetricRules from '../pages/navigator/application/metric-rules';
import FolderDashboard from '../pages/navigator/folder/dashboard';
import InstanceInfo from 'renderer/pages/navigator/instance/info';
import InstanceHealth from 'renderer/pages/navigator/instance/health';
import SettingsLayout from 'renderer/layout/settings/SettingsLayout';
import SettingsGeneral from 'renderer/pages/settings/general';
import SettingsNotifications from 'renderer/pages/settings/notifications';
import SettingsPrivacy from 'renderer/pages/settings/privacy';
import SettingsBackups from 'renderer/pages/settings/backups';
import InstanceLogfile from 'renderer/pages/navigator/instance/logfile';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <ErrorBoundary FallbackComponent={ErrorBoundaryNavigator}>
          <AppLayout />
        </ErrorBoundary>
      ),
      children: [
        { path: '', element: <Navigate to={urls.navigator.url} replace /> },

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
              path: urls.dashboard.path,
              element: <FolderDashboard />,
            },
            {
              path: urls.folder.path,
              element: <FolderLayout />,
              children: [
                { path: '', element: <Navigate to={urls.folderDashboard.path} replace /> },
                {
                  path: urls.folderDashboard.path,
                  element: <FolderDashboard />,
                },
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
                  element: (
                    <AbilityRedirectGuard ability={'LOGGERS'}>
                      <ApplicationLoggers />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.applicationCaches.path,
                  element: (
                    <AbilityRedirectGuard ability={'CACHES'}>
                      <ApplicationCaches />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.applicationMetricRules.path,
                  element: (
                    <AbilityRedirectGuard ability={'METRICS'}>
                      <ApplicationMetricRules />
                    </AbilityRedirectGuard>
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
                  element: (
                    <InstanceAbilityErrorGuard ability={'METRICS'}>
                      <InstanceDashboard />
                    </InstanceAbilityErrorGuard>
                  ),
                },
                {
                  path: urls.instanceHealth.path,
                  element: (
                    <AbilityRedirectGuard ability={'HEALTH'}>
                      <InstanceHealth />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceInfo.path,
                  element: (
                    <AbilityRedirectGuard ability={'INFO'}>
                      <InstanceInfo />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceMetrics.path,
                  element: (
                    <AbilityRedirectGuard ability={'METRICS'}>
                      <InstanceMetrics />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceEnvironment.path,
                  element: (
                    <AbilityRedirectGuard ability={'ENV'}>
                      <InstanceEnvironment />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceSystemEnvironment.path,
                  element: (
                    <AbilityRedirectGuard ability={'SYSTEM_ENVIRONMENT'}>
                      <InstanceSystemEnvironment />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceBeans.path,
                  element: (
                    <AbilityRedirectGuard ability={'BEANS'}>
                      <InstanceBeans />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceBeansGraph.path,
                  element: (
                    <AbilityRedirectGuard ability={'BEANS'}>
                      <InstanceBeansGraph />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceHttpRequests.path,
                  element: (
                    <AbilityRedirectGuard ability={'HTTP_REQUEST_STATISTICS'}>
                      <InstanceHttpRequests />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceQuartz.path,
                  element: (
                    <AbilityRedirectGuard ability={'QUARTZ'}>
                      <InstanceQuartz />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceScheduledTasks.path,
                  element: (
                    <AbilityRedirectGuard ability={'SCHEDULEDTASKS'}>
                      <InstanceScheduledTasks />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceMappings.path,
                  element: (
                    <AbilityRedirectGuard ability={'MAPPINGS'}>
                      <InstanceMappings />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceFlyway.path,
                  element: (
                    <AbilityRedirectGuard ability={'FLYWAY'}>
                      <InstanceFlyway />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceLiquibase.path,
                  element: (
                    <AbilityRedirectGuard ability={'LIQUIBASE'}>
                      <InstanceLiquibase />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceProperties.path,
                  element: (
                    <AbilityRedirectGuard ability={'PROPERTIES'}>
                      <InstanceProperties />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceSystemProperties.path,
                  element: (
                    <AbilityRedirectGuard ability={'SYSTEM_PROPERTIES'}>
                      <InstanceSystemProperties />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceIntegrationGraph.path,
                  element: (
                    <AbilityRedirectGuard ability={'INTEGRATIONGRAPH'}>
                      <InstanceIntegrationGraph />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceLoggers.path,
                  element: (
                    <AbilityRedirectGuard ability={'LOGGERS'}>
                      <InstanceLoggers />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceLogfile.path,
                  element: (
                    <AbilityRedirectGuard ability={'LOGGERS'}>
                      <InstanceLogfile />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceCaches.path,
                  element: (
                    <AbilityRedirectGuard ability={'CACHES'}>
                      <InstanceCaches />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceTogglz.path,
                  element: (
                    <AbilityRedirectGuard ability={'TOGGLZ'}>
                      <InstanceTogglz />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceThreadDump.path,
                  element: (
                    <AbilityRedirectGuard ability={'THREADDUMP'}>
                      <InstanceThreadProfiling />
                    </AbilityRedirectGuard>
                  ),
                },
                {
                  path: urls.instanceHeapDump.path,
                  element: (
                    <AbilityRedirectGuard ability={'HEAPDUMP'}>
                      <InstanceHeapdumpReferences />
                    </AbilityRedirectGuard>
                  ),
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
            { path: '', element: <Navigate to={urls.settingsGeneral.url} replace /> },
            {
              path: urls.settingsGeneral.path,
              element: <SettingsGeneral />,
            },
            {
              path: urls.settingsNotifications.path,
              element: <SettingsNotifications />,
            },
            {
              path: urls.settingsPrivacy.path,
              element: <SettingsPrivacy />,
            },
            {
              path: urls.settingsBackups.path,
              element: <SettingsBackups />,
            },
          ],
        },

        // Daemon Routes
        {
          path: urls.daemon.path,
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
          children: [
            { path: urls.error.path, element: <Error /> },
            { path: '*', element: <Navigate to={urls.error.url} replace /> },
          ],
        },
        { path: '*', element: <Navigate to={urls.error.url} replace /> },
      ],
    },
  ]);
}
