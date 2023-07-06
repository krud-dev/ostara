import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import {
  AccessTimeOutlined,
  AccountTreeOutlined,
  BarChartOutlined,
  ClassOutlined,
  DataUsageOutlined,
  DescriptionOutlined,
  DeviceHubOutlined,
  DifferenceOutlined,
  DvrOutlined,
  EggOutlined,
  EventRepeatOutlined,
  HttpOutlined,
  LanOutlined,
  ListAltOutlined,
  LocalHospitalOutlined,
  StorageOutlined,
  SyncAltOutlined,
  ToggleOnOutlined,
  WysiwygOutlined,
  YardOutlined,
} from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { InstanceAbility, InstanceRO } from 'common/generated_definitions';
import InstanceActiveProfiles from 'renderer/layout/instance/components/InstanceActiveProfiles';
import { isItemInactive } from 'renderer/utils/itemUtils';

type InstanceSidebarProps = { item: InstanceRO; itemAbilities?: InstanceAbility[]; disabled: boolean; width: number };

export default function InstanceSidebar({ item, itemAbilities, disabled, width }: InstanceSidebarProps) {
  const itemInactive = useMemo<boolean>(() => isItemInactive(item), [item]);

  const isServiceInactive = useCallback(
    (ability: InstanceAbility): boolean => {
      return !itemAbilities || itemAbilities.indexOf(ability) === -1;
    },
    [itemAbilities]
  );

  const isServiceDisabled = useCallback(
    (ability?: InstanceAbility): boolean => {
      return disabled || itemInactive || (!!ability && isServiceInactive(ability));
    },
    [disabled, itemInactive, isServiceInactive]
  );

  const navConfig = useMemo<SidebarConfig | undefined>(
    () =>
      itemAbilities
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
                  disabled: isServiceDisabled(),
                },
                {
                  id: 'health',
                  icon: <LocalHospitalOutlined />,
                  label: <FormattedMessage id={'health'} />,
                  to: generatePath(urls.instanceHealth.url, { id: item.id }),
                  disabled: isServiceDisabled('HEALTH'),
                },
                {
                  id: 'info',
                  icon: <DvrOutlined />,
                  label: <FormattedMessage id={'info'} />,
                  to: generatePath(urls.instanceInfo.url, { id: item.id }),
                  disabled: isServiceDisabled('INFO'),
                },
                {
                  id: 'metrics',
                  icon: <DataUsageOutlined />,
                  label: <FormattedMessage id={'metrics'} />,
                  to: generatePath(urls.instanceMetrics.url, { id: item.id }),
                  disabled: isServiceDisabled('METRICS'),
                },
                {
                  id: 'system-environment',
                  icon: <YardOutlined />,
                  label: <FormattedMessage id={'systemEnvironment'} />,
                  to: generatePath(urls.instanceSystemEnvironment.url, { id: item.id }),
                  disabled: isServiceDisabled('SYSTEM_ENVIRONMENT'),
                },
                {
                  id: 'system-properties',
                  icon: <WysiwygOutlined />,
                  label: <FormattedMessage id={'systemProperties'} />,
                  to: generatePath(urls.instanceSystemProperties.url, { id: item.id }),
                  disabled: isServiceDisabled('SYSTEM_PROPERTIES'),
                },
                {
                  id: 'properties',
                  icon: <ListAltOutlined />,
                  label: <FormattedMessage id={'appProperties'} />,
                  to: generatePath(urls.instanceProperties.url, { id: item.id }),
                  disabled: isServiceDisabled('PROPERTIES'),
                },
                {
                  id: 'beans',
                  icon: <EggOutlined />,
                  label: <FormattedMessage id={'beans'} />,
                  to: generatePath(urls.instanceBeans.url, { id: item.id }),
                  disabled: isServiceDisabled('BEANS'),
                },
                // {
                //   id: 'beans-graph',
                //   icon: <MediationOutlined />,
                //   label: <FormattedMessage id={'beansGraph'} />,
                //   to: generatePath(urls.instanceBeansGraph.url, { id: item.id }),
                //   disabled: isServiceDisabled('BEANS'),
                // },
                {
                  id: 'http-requests',
                  icon: <HttpOutlined />,
                  label: <FormattedMessage id={'httpRequests'} />,
                  to: generatePath(urls.instanceHttpRequests.url, { id: item.id }),
                  disabled: isServiceDisabled('HTTP_REQUEST_STATISTICS'),
                  hidden: isServiceInactive('HTTP_REQUEST_STATISTICS'),
                },
                {
                  id: 'quartz',
                  icon: <AccessTimeOutlined />,
                  label: <FormattedMessage id={'quartz'} />,
                  to: generatePath(urls.instanceQuartz.url, { id: item.id }),
                  disabled: isServiceDisabled('QUARTZ'),
                  hidden: isServiceInactive('QUARTZ'),
                },
                {
                  id: 'scheduled-tasks',
                  icon: <EventRepeatOutlined />,
                  label: <FormattedMessage id={'scheduledTasks'} />,
                  to: generatePath(urls.instanceScheduledTasks.url, { id: item.id }),
                  disabled: isServiceDisabled('SCHEDULEDTASKS'),
                  hidden: isServiceInactive('SCHEDULEDTASKS'),
                },
                {
                  id: 'mappings',
                  icon: <SyncAltOutlined />,
                  label: <FormattedMessage id={'mappings'} />,
                  to: generatePath(urls.instanceMappings.url, { id: item.id }),
                  disabled: isServiceDisabled('MAPPINGS'),
                  hidden: isServiceInactive('MAPPINGS'),
                },
                {
                  id: 'flyway',
                  icon: <StorageOutlined />,
                  label: <FormattedMessage id={'flyway'} />,
                  to: generatePath(urls.instanceFlyway.url, { id: item.id }),
                  disabled: isServiceDisabled('FLYWAY'),
                  hidden: isServiceInactive('FLYWAY'),
                },
                {
                  id: 'liquibase',
                  icon: <StorageOutlined />,
                  label: <FormattedMessage id={'liquibase'} />,
                  to: generatePath(urls.instanceLiquibase.url, { id: item.id }),
                  disabled: isServiceDisabled('LIQUIBASE'),
                  hidden: isServiceInactive('LIQUIBASE'),
                },
                {
                  id: 'integration-graph',
                  icon: <AccountTreeOutlined />,
                  label: <FormattedMessage id={'integrationGraph'} />,
                  to: generatePath(urls.instanceIntegrationGraph.url, { id: item.id }),
                  disabled: isServiceDisabled('INTEGRATIONGRAPH'),
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
                  icon: <DifferenceOutlined />,
                  label: <FormattedMessage id={'loggers'} />,
                  to: generatePath(urls.instanceLoggers.url, { id: item.id }),
                  disabled: isServiceDisabled('LOGGERS'),
                },
                {
                  id: 'logfile',
                  icon: <DescriptionOutlined />,
                  label: <FormattedMessage id={'logfile'} />,
                  to: generatePath(urls.instanceLogfile.url, { id: item.id }),
                  disabled: isServiceDisabled('LOGFILE'),
                  hidden: isServiceInactive('LOGFILE'),
                },
                {
                  id: 'caches',
                  icon: <ClassOutlined />,
                  label: <FormattedMessage id={'caches'} />,
                  to: generatePath(urls.instanceCaches.url, { id: item.id }),
                  disabled: isServiceDisabled('CACHES'),
                },
                {
                  id: 'togglz',
                  icon: <ToggleOnOutlined />,
                  label: <FormattedMessage id={'togglz'} />,
                  to: generatePath(urls.instanceTogglz.url, { id: item.id }),
                  disabled: isServiceDisabled('TOGGLZ'),
                  hidden: isServiceInactive('TOGGLZ'),
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
                  label: <FormattedMessage id={'threadProfiling'} />,
                  to: generatePath(urls.instanceThreadDump.url, { id: item.id }),
                  disabled: isServiceDisabled('THREADDUMP'),
                },
                {
                  id: 'heapDump',
                  icon: <LanOutlined />,
                  label: <FormattedMessage id={'heapDump'} />,
                  to: generatePath(urls.instanceHeapDump.url, { id: item.id }),
                  disabled: isServiceDisabled('HEAPDUMP'),
                },
              ],
            },
          ]
        : undefined,
    [item, itemAbilities, disabled, itemInactive]
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
