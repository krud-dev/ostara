import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { BarChartOutlined, ClassOutlined, ListAltOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { EnrichedApplication } from 'infra/configuration/model/configuration';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { Box, Divider } from '@mui/material';
import ApplicationDataCollectionToggle from 'renderer/components/item/data-collection/ApplicationDataCollectionToggle';
import { IconViewer } from 'renderer/components/icon/IconViewer';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';

type ApplicationSidebarProps = { item: EnrichedApplication; width: number };

export default function ApplicationSidebar({ item, width }: ApplicationSidebarProps) {
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
            to: generatePath(urls.applicationDashboard.url, { id: item.id }),
          },
          {
            id: 'instances',
            icon: <IconViewer icon={getItemTypeIcon('instance')} />,
            label: <FormattedMessage id={'instances'} />,
            to: generatePath(urls.applicationInstances.url, { id: item.id }),
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
            to: generatePath(urls.applicationLoggers.url, { id: item.id }),
          },
          {
            id: 'caches',
            icon: <ClassOutlined />,
            label: <FormattedMessage id={'caches'} />,
            to: generatePath(urls.applicationCaches.url, { id: item.id }),
          },
        ],
      },
    ],
    [item]
  );

  return (
    <Box sx={{ width: width, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Sidebar sidebarConfig={navConfig} header={<ItemHeader item={item} />} sx={{ flexGrow: 1 }} />
      {/*<Divider />*/}
      {/*<ApplicationDataCollectionToggle item={item} />*/}
    </Box>
  );
}
