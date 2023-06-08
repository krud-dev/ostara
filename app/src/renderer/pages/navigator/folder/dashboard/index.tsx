import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';
import { ApplicationHealthStatus, ApplicationRO, InstanceRO } from 'common/generated_definitions';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import FolderApplicationsHealthStatusWidget from './components/FolderApplicationsHealthStatusWidget';
import FolderApplicationWidget from './components/FolderApplicationWidget';
import { chain, isEmpty, sortBy } from 'lodash';
import NiceModal from '@ebay/nice-modal-react';
import { useItems } from 'renderer/contexts/ItemsContext';
import { findTreeItemPath, getNewItemSort, getSubTreeItemsForItem, getSubTreeRoot } from 'renderer/utils/treeUtils';
import { getItemDisplayName, isFolder } from 'renderer/utils/itemUtils';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';

const PATH_SEPARATOR = '/';
const DISPLAY_PATH_SEPARATOR = ' / ';

type DashboardApplicationRO = ApplicationRO & {
  path: string;
  displayPath: string;
  sortPath: number[];
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
  const rootPath = useMemo<TreeItem[]>(
    () => (selectedItem ? findTreeItemPath(navigatorData || [], selectedItem.id, true) || [] : []),
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
              const path = findTreeItemPath(navigatorData || [], a.id)?.filter((i) => !rootPath.includes(i));
              return {
                ...a,
                path: path?.map((i) => i.id).join(PATH_SEPARATOR) || '',
                displayPath: path?.map((i) => getItemDisplayName(i)).join(DISPLAY_PATH_SEPARATOR) || '',
                sortPath: path?.map((i) => i.sort || 0) || [],
              };
            })
            .groupBy((a) => a.path)
            .map((groupApplications, path) => ({
              path,
              applications: sortBy(groupApplications, 'sort'),
              displayPath: groupApplications[0].displayPath,
            }))
            .sort((groupA, groupB) => {
              const sortPathA = groupA.applications[0].sortPath;
              const sortPathB = groupB.applications[0].sortPath;

              for (let i = 0; i < Math.min(sortPathA.length, sortPathB.length); i += 1) {
                if (sortPathA[i] < sortPathB[i]) {
                  return -1; // a should come before b
                }
                if (sortPathA[i] > sortPathB[i]) {
                  return 1; // a should come after b
                }
              }

              // If all corresponding numbers are equal, the item with fewer numbers should come first
              if (sortPathA.length < sortPathB.length) {
                return -1; // a should come before b
              }
              if (sortPathA.length > sortPathB.length) {
                return 1; // a should come after b
              }
              return 0; // no change in order
            })
            .value()
        : undefined,
    [data, rootPath]
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
