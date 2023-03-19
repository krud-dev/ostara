import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import {
  AccessTimeOutlined,
  AccountTreeOutlined,
  BarChartOutlined,
  ClassOutlined,
  DataUsageOutlined,
  DeviceHubOutlined,
  EggOutlined,
  EventRepeatOutlined,
  HttpOutlined,
  LanOutlined,
  ListAltOutlined,
  StorageOutlined,
  SyncAltOutlined,
  TextSnippetOutlined,
  WysiwygOutlined,
  YardOutlined,
} from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { InstanceAbility, InstanceRO } from '../../../../common/generated_definitions';
import InstanceActiveProfiles from './InstanceActiveProfiles';
import { useGetInstanceAbilitiesQuery } from '../../../apis/requests/instance/getInstanceAbilities';

type InstanceSidebarProps = { item: InstanceRO; disabled: boolean; width: number };

export default function InstanceSidebar({ item, disabled, width }: InstanceSidebarProps) {
  const abilitiesState = useGetInstanceAbilitiesQuery({ instanceId: item.id });

  const isServiceInactive = useCallback(
    (ability: InstanceAbility): boolean => {
      return !abilitiesState.data || abilitiesState.data.indexOf(ability) === -1;
    },
    [abilitiesState.data]
  );

  const navConfig = useMemo<SidebarConfig | undefined>(
    () =>
      abilitiesState.data
        ? [
            {
              id: 'insights',
              label: <FormattedMessage id={'insights'} />,
              items: [
                {
                  id: 'dashboard',
                  icon: <BarChartOutlined />,
                  label: <FormattedMessage id={'dashboard'} />,
                  to: generatePath(urls.instanceDashboard.url, { id: item.id }),
                  disabled: disabled,
                },
                {
                  id: 'metrics',
                  icon: <DataUsageOutlined />,
                  label: <FormattedMessage id={'metrics'} />,
                  to: generatePath(urls.instanceMetrics.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('METRICS'),
                },
                {
                  id: 'system-environment',
                  icon: <YardOutlined />,
                  label: <FormattedMessage id={'systemEnvironment'} />,
                  to: generatePath(urls.instanceSystemEnvironment.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('SYSTEM_ENVIRONMENT'),
                },
                {
                  id: 'system-properties',
                  icon: <WysiwygOutlined />,
                  label: <FormattedMessage id={'systemProperties'} />,
                  to: generatePath(urls.instanceSystemProperties.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('SYSTEM_PROPERTIES'),
                },
                {
                  id: 'properties',
                  icon: <ListAltOutlined />,
                  label: <FormattedMessage id={'appProperties'} />,
                  to: generatePath(urls.instanceProperties.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('PROPERTIES'),
                },
                {
                  id: 'beans',
                  icon: <EggOutlined />,
                  label: <FormattedMessage id={'beans'} />,
                  to: generatePath(urls.instanceBeans.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('BEANS'),
                },
                // {
                //   id: 'beans-graph',
                //   icon: <MediationOutlined />,
                //   label: <FormattedMessage id={'beansGraph'} />,
                //   to: generatePath(urls.instanceBeansGraph.url, { id: item.id }),
                //   disabled: disabled || isServiceInactive('BEANS'),
                // },
                {
                  id: 'http-requests',
                  icon: <HttpOutlined />,
                  label: <FormattedMessage id={'httpRequests'} />,
                  to: generatePath(urls.instanceHttpRequests.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('HTTP_REQUEST_STATISTICS'),
                },
                {
                  id: 'quartz',
                  icon: <AccessTimeOutlined />,
                  label: <FormattedMessage id={'quartz'} />,
                  to: generatePath(urls.instanceQuartz.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('QUARTZ'),
                },
                {
                  id: 'scheduled-tasks',
                  icon: <EventRepeatOutlined />,
                  label: <FormattedMessage id={'scheduledTasks'} />,
                  to: generatePath(urls.instanceScheduledTasks.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('SCHEDULEDTASKS'),
                },
                {
                  id: 'mappings',
                  icon: <SyncAltOutlined />,
                  label: <FormattedMessage id={'mappings'} />,
                  to: generatePath(urls.instanceMappings.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('MAPPINGS'),
                },
                {
                  id: 'flyway',
                  icon: <StorageOutlined />,
                  label: <FormattedMessage id={'flyway'} />,
                  to: generatePath(urls.instanceFlyway.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('FLYWAY'),
                },
                {
                  id: 'liquibase',
                  icon: <StorageOutlined />,
                  label: <FormattedMessage id={'liquibase'} />,
                  to: generatePath(urls.instanceLiquibase.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('LIQUIBASE'),
                },
                {
                  id: 'integration-graph',
                  icon: <AccountTreeOutlined />,
                  label: <FormattedMessage id={'integrationGraph'} />,
                  to: generatePath(urls.instanceIntegrationGraph.url, { id: item.id }),
                  disabled: disabled,
                  hidden: isServiceInactive('INTEGRATIONGRAPH'),
                },
              ],
            },
            {
              id: 'manage',
              label: <FormattedMessage id={'manage'} />,
              items: [
                {
                  id: 'loggers',
                  icon: <TextSnippetOutlined />,
                  label: <FormattedMessage id={'loggers'} />,
                  to: generatePath(urls.instanceLoggers.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('LOGGERS'),
                },
                {
                  id: 'caches',
                  icon: <ClassOutlined />,
                  label: <FormattedMessage id={'caches'} />,
                  to: generatePath(urls.instanceCaches.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('CACHES'),
                },
              ],
            },
            {
              id: 'jvm',
              label: <FormattedMessage id={'jvm'} />,
              items: [
                {
                  id: 'threadDump',
                  icon: <DeviceHubOutlined />,
                  label: <FormattedMessage id={'threadDump'} />,
                  to: generatePath(urls.instanceThreadDump.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('THREADDUMP'),
                },
                {
                  id: 'heapDump',
                  icon: <LanOutlined />,
                  label: <FormattedMessage id={'heapDump'} />,
                  to: generatePath(urls.instanceHeapDump.url, { id: item.id }),
                  disabled: disabled || isServiceInactive('HEAPDUMP'),
                },
              ],
            },
          ]
        : undefined,
    [item, disabled, isServiceInactive]
  );

  return (
    <Sidebar
      sidebarConfig={navConfig}
      header={
        <>
          <ItemHeader item={item} />
          <InstanceActiveProfiles item={item} />
        </>
      }
    />
  );
}
