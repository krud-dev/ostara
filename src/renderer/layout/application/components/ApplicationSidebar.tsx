import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { ClassOutlined, ListAltOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { ApplicationRO, InstanceAbility } from '../../../../common/generated_definitions';
import { useGetApplicationInstancesCountQuery } from '../../../apis/requests/application/getApplicationInstancesCount';
import { isNil } from 'lodash';

type ApplicationSidebarProps = { item: ApplicationRO; width: number };

export default function ApplicationSidebar({ item, width }: ApplicationSidebarProps) {
  const instanceCountState = useGetApplicationInstancesCountQuery({ applicationId: item.id });

  const isServiceInactive = useCallback((): boolean => {
    return !instanceCountState.data || instanceCountState.data === 0;
  }, [instanceCountState.data]);

  const navConfig = useMemo<SidebarConfig | undefined>(
    () =>
      !isNil(instanceCountState.data)
        ? [
            {
              id: 'overview',
              label: <FormattedMessage id={'overview'} />,
              items: [
                // {
                //   id: 'dashboard',
                //   icon: <BarChartOutlined />,
                //   label: <FormattedMessage id={'dashboard'} />,
                //   to: generatePath(urls.applicationDashboard.url, { id: item.id }),
                // },
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
                  disabled: isServiceInactive(),
                },
                {
                  id: 'caches',
                  icon: <ClassOutlined />,
                  label: <FormattedMessage id={'caches'} />,
                  to: generatePath(urls.applicationCaches.url, { id: item.id }),
                  disabled: isServiceInactive(),
                },
              ],
            },
          ]
        : undefined,
    [item, instanceCountState.data]
  );

  return <Sidebar sidebarConfig={navConfig} header={<ItemHeader item={item} />} />;
}
