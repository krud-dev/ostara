import Sidebar from 'renderer/components/menu/sidebar/Sidebar';
import { SidebarConfig } from 'renderer/components/menu/sidebar/SidebarSection';
import { ClassOutlined, ListAltOutlined } from '@mui/icons-material';
import { urls } from 'renderer/routes/urls';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';
import ItemHeader from 'renderer/components/item/ItemHeader';
import { Box } from '@mui/material';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { getItemTypeIcon } from 'renderer/utils/itemUtils';
import { FolderRO } from '../../../../common/generated_definitions';

type FolderSidebarProps = { item: FolderRO; width: number };

export default function FolderSidebar({ item, width }: FolderSidebarProps) {
  const navConfig = useMemo<SidebarConfig>(
    () => [
      {
        id: 'overview',
        label: <FormattedMessage id={'overview'} />,
        items: [
          {
            id: 'applications',
            icon: <IconViewer icon={getItemTypeIcon('application')} />,
            label: <FormattedMessage id={'applications'} />,
            to: generatePath(urls.folderApplications.url, { id: item.id }),
          },
        ],
      },
    ],
    [item]
  );

  return (
    <Box sx={{ width: width, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Sidebar sidebarConfig={navConfig} header={<ItemHeader item={item} />} sx={{ flexGrow: 1 }} />
    </Box>
  );
}
