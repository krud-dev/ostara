import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import {
  AccessTimeOutlined,
  BarChartOutlined,
  ClassOutlined,
  DataUsageOutlined,
  DeviceHubOutlined,
  EggOutlined,
  LanOutlined,
  ListAltOutlined,
  ParkOutlined,
} from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';

type InstanceSidebarProps = { item: EnrichedInstance; width: number };

export default function InstanceSidebar({ item, width }: InstanceSidebarProps) {
  const navConfig = useMemo<SidebarConfig>(
    () => [
      {
        id: 'insights',
        label: <FormattedMessage id={'insights'} />,
        items: [
          {
            id: 'dashboard',
            icon: <BarChartOutlined />,
            label: <FormattedMessage id={'dashboard'} />,
            to: generatePath(urls.instanceDashboard.url, { id: item.id }),
          },
          {
            id: 'metrics',
            icon: <DataUsageOutlined />,
            label: <FormattedMessage id={'metrics'} />,
            to: generatePath(urls.instanceMetrics.url, { id: item.id }),
          },
          {
            id: 'quartz',
            icon: <AccessTimeOutlined />,
            label: <FormattedMessage id={'quartz'} />,
            to: generatePath(urls.instanceQuartz.url, { id: item.id }),
          },
          {
            id: 'environment',
            icon: <ParkOutlined />,
            label: <FormattedMessage id={'environment'} />,
            to: generatePath(urls.instanceEnvironment.url, { id: item.id }),
          },
          {
            id: 'beans',
            icon: <EggOutlined />,
            label: <FormattedMessage id={'beans'} />,
            to: generatePath(urls.instanceBeans.url, { id: item.id }),
          },
        ],
      },
      {
        id: 'manage',
        label: <FormattedMessage id={'manage'} />,
        items: [
          {
            id: 'loggers',
            icon: <ListAltOutlined />,
            label: <FormattedMessage id={'loggers'} />,
            to: generatePath(urls.instanceLoggers.url, { id: item.id }),
          },
          {
            id: 'caches',
            icon: <ClassOutlined />,
            label: <FormattedMessage id={'caches'} />,
            to: generatePath(urls.instanceCaches.url, { id: item.id }),
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
          },
          {
            id: 'heapDump',
            icon: <LanOutlined />,
            label: <FormattedMessage id={'heapDump'} />,
            to: generatePath(urls.instanceHeapDump.url, { id: item.id }),
          },
        ],
      },
    ],
    [item]
  );

  return <Sidebar sidebarConfig={navConfig} width={width} header={<ItemHeader item={item} />} />;
}
