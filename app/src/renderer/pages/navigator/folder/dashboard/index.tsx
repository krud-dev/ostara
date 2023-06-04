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
import { chain, isEmpty } from 'lodash';
import NiceModal from '@ebay/nice-modal-react';
import { useItems } from '../../../../contexts/ItemsContext';
import { findTreeItemPath, getNewItemSort, getSubTreeItemsForItem, getSubTreeRoot } from '../../../../utils/treeUtils';
import { getItemDisplayName, isFolder } from '../../../../utils/itemUtils';
import LogoLoaderCenter from '../../../../components/common/LogoLoaderCenter';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';

type DashboardApplicationRO = ApplicationRO & {
  path: string;
  displayPath: string;
};

const FolderDashboard: FunctionComponent = () => {
  const { applications } = useItems();
  const { selectedItem, data: navigatorData, getNewItemOrder } = useNavigatorTree();

  const folderIds = useMemo<string[] | undefined>(
    () =>
      selectedItem
        ? getSubTreeItemsForItem(navigatorData || [], selectedItem.id)
            .filter((i) => isFolder(i))
            .map((i) => i.id)
        : undefined,
    [selectedItem, navigatorData]
  );
  const data = useMemo<ApplicationRO[] | undefined>(
    () =>
      folderIds
        ? applications?.filter((a) => !!a.parentFolderId && folderIds.includes(a.parentFolderId))
        : applications,
    [applications, folderIds]
  );
  const groupedData = useMemo<
    { path: string; displayPath: string; applications: DashboardApplicationRO[] }[] | undefined
  >(
    () =>
      data
        ? chain(data)
            .map<DashboardApplicationRO>((a) => {
              const path = findTreeItemPath(navigatorData || [], a.id);
              return {
                ...a,
                path: path?.map((i) => i.id).join('/') || '',
                displayPath: path?.map((i) => getItemDisplayName(i)).join(' / ') || '',
              };
            })
            .groupBy((a) => a.path)
            .map((groupApplications, path) => ({
              path,
              applications: groupApplications,
              displayPath: groupApplications[0].displayPath,
            }))
            .sortBy((group) => group.displayPath)
            .value()
        : undefined,
    [data]
  );
  const loading = useMemo<boolean>(() => !data || !groupedData, [data, groupedData]);

  const healthStatuses = useMemo<ApplicationHealthStatus[]>(
    () => ['ALL_UP', 'ALL_DOWN', 'SOME_DOWN', 'EMPTY', 'UNKNOWN', 'PENDING'],
    []
  );

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    let sort = getNewItemOrder();
    if (selectedItem) {
      const treeItem = getSubTreeRoot(navigatorData || [], selectedItem.id);
      if (treeItem) {
        sort = getNewItemSort(treeItem);
      }
    }

    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      parentFolderId: selectedItem?.id,
      sort: sort,
    });
  }, [selectedItem, navigatorData, getNewItemOrder]);

  return (
    <Page sx={{ ...(loading ? { height: '100%' } : {}) }}>
      {loading ? (
        <LogoLoaderCenter />
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <Card>
            <CardHeader title={<FormattedMessage id={'summary'} />} />
            <CardContent>
              <Grid2 container spacing={COMPONENTS_SPACING}>
                {healthStatuses.map((healthStatus) => (
                  <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={healthStatus}>
                    <FolderApplicationsHealthStatusWidget applications={data!} healthStatus={healthStatus} />
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>

          {isEmpty(data) && (
            <Card>
              <CardHeader title={<FormattedMessage id={'applications'} />} />
              <CardContent>
                <EmptyContent
                  text={<FormattedMessage id={selectedItem ? 'folderIsEmpty' : 'dashboardIsEmpty'} />}
                  description={
                    <>
                      <Box>
                        <FormattedMessage id={'addNewInstanceByClicking'} />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button variant={'outlined'} color={'primary'} onClick={createInstanceHandler}>
                          <FormattedMessage id={'createInstance'} />
                        </Button>
                      </Box>
                    </>
                  }
                />
              </CardContent>
            </Card>
          )}

          {groupedData?.map((group) => (
            <Card key={group.path}>
              <CardHeader title={group.displayPath || <FormattedMessage id={'root'} />} />
              <CardContent>
                <Grid2 container spacing={COMPONENTS_SPACING}>
                  {group.applications.map((application) => (
                    <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={application.id}>
                      <FolderApplicationWidget application={application} />
                    </Grid2>
                  ))}
                </Grid2>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Page>
  );
};

export default FolderDashboard;
