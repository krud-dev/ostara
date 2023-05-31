import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';
import { ApplicationHealthStatus, ApplicationRO, InstanceRO } from '../../../../../common/generated_definitions';
import EmptyContent from '../../../../components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from '../../../../constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import FolderApplicationsHealthStatusWidget from './components/FolderApplicationsHealthStatusWidget';
import FolderApplicationWidget from './components/FolderApplicationWidget';
import { isEmpty } from 'lodash';
import NiceModal from '@ebay/nice-modal-react';
import { useItems } from '../../../../contexts/ItemsContext';
import { getNewItemSort, getSubTreeItemsForItem, getSubTreeRoot } from '../../../../utils/treeUtils';
import { isFolder } from '../../../../utils/itemUtils';
import LogoLoaderCenter from '../../../../components/common/LogoLoaderCenter';
import CreateApplicationDialog from '../../../../components/item/dialogs/create/CreateApplicationDialog';

const FolderDashboard: FunctionComponent = () => {
  const { applications } = useItems();
  const { selectedItem, data: navigatorData } = useNavigatorTree();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);
  const folderIds = useMemo<string[]>(
    () =>
      getSubTreeItemsForItem(navigatorData || [], item.id)
        .filter((i) => isFolder(i))
        .map((i) => i.id),
    [item.id, navigatorData]
  );
  const data = useMemo<ApplicationRO[] | undefined>(
    () => applications?.filter((a) => !!a.parentFolderId && folderIds.includes(a.parentFolderId)),
    [applications, folderIds]
  );
  const healthStatuses = useMemo<ApplicationHealthStatus[]>(
    () => ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN', 'EMPTY', 'UNKNOWN', 'PENDING'],
    []
  );

  const createApplicationHandler = useCallback(async (): Promise<void> => {
    const treeItem = getSubTreeRoot(navigatorData || [], item.id);
    const sort = treeItem ? getNewItemSort(treeItem) : 1;

    await NiceModal.show<InstanceRO[] | undefined>(CreateApplicationDialog, {
      parentFolderId: item.id,
      sort: sort,
    });
  }, [item, navigatorData]);

  return (
    <Page sx={{ height: '100%' }}>
      {!data ? (
        <LogoLoaderCenter />
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <Card>
            <CardHeader title={<FormattedMessage id={'summary'} />} />
            <CardContent>
              <Grid2 container spacing={COMPONENTS_SPACING}>
                {healthStatuses.map((healthStatus) => (
                  <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={healthStatus}>
                    <FolderApplicationsHealthStatusWidget applications={data} healthStatus={healthStatus} />
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={<FormattedMessage id={'applications'} />} />
            <CardContent>
              {isEmpty(data) ? (
                <EmptyContent
                  text={<FormattedMessage id={'folderNoApplications'} />}
                  description={
                    <>
                      <Box>
                        <FormattedMessage id={'folderNoApplicationsDescription'} />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button variant={'outlined'} color={'primary'} onClick={createApplicationHandler}>
                          <FormattedMessage id={'createApplication'} />
                        </Button>
                      </Box>
                    </>
                  }
                />
              ) : (
                <Grid2 container spacing={COMPONENTS_SPACING}>
                  {data.map((application) => (
                    <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={application.id}>
                      <FolderApplicationWidget application={application} />
                    </Grid2>
                  ))}
                </Grid2>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}
    </Page>
  );
};

export default FolderDashboard;
