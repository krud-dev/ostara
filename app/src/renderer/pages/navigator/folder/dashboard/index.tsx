import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import { Box, Button, Card, CardContent, CardHeader, Grow, Stack } from '@mui/material';
import { ApplicationRO, InstanceRO } from 'common/generated_definitions';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from 'renderer/constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import ApplicationDashboardWidget from 'renderer/components/widget/application/ApplicationDashboardWidget';
import { chain, isEmpty, sortBy } from 'lodash';
import NiceModal from '@ebay/nice-modal-react';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { findTreeItemPath, getNewItemSort, getSubTreeItemsForItem, getSubTreeRoot } from 'renderer/utils/treeUtils';
import { getItemDisplayName, getItemParentId, isAgent, isFolder } from 'renderer/utils/itemUtils';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import CreateInstanceDialog, {
  CreateInstanceDialogProps,
} from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { TransitionGroup } from 'react-transition-group';
import ApplicationsHealthSummaryDashboardWidget from 'renderer/components/widget/application/ApplicationsHealthSummaryDashboardWidget';

const PATH_SEPARATOR = '/';
const DISPLAY_PATH_SEPARATOR = ' / ';

type DashboardApplicationRO = ApplicationRO & {
  path: string;
  displayPath: string;
  sortPath: number[];
};

const FolderDashboard: FunctionComponent = () => {
  const { applications } = useItemsContext();
  const { selectedItem, data: navigatorData, getNewItemOrder } = useNavigatorLayoutContext();

  const parentIds = useMemo<string[] | undefined>(
    () =>
      selectedItem
        ? getSubTreeItemsForItem(navigatorData || [], selectedItem.id)
            .filter((i) => isFolder(i) || isAgent(i))
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
      parentIds
        ? applications?.filter((a) => {
            const parentId = getItemParentId(a);
            return !!parentId && parentIds.includes(parentId);
          })
        : applications,
    [applications, parentIds]
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

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    let sort = getNewItemOrder();
    if (selectedItem) {
      const treeItem = getSubTreeRoot(navigatorData || [], selectedItem.id);
      if (treeItem) {
        sort = getNewItemSort(treeItem);
      }
    }

    await NiceModal.show<InstanceRO[] | undefined, CreateInstanceDialogProps>(CreateInstanceDialog, {
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
          <TransitionGroup component={null}>
            <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
              <Box>
                <ApplicationsHealthSummaryDashboardWidget applications={data!} />
              </Box>
            </Grow>

            {isEmpty(data) && (
              <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
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
              </Grow>
            )}

            {groupedData?.map((group, index) => (
              <Grow timeout={ANIMATION_TIMEOUT_LONG * (index + 2)} style={ANIMATION_GROW_TOP_STYLE} key={group.path}>
                <Card>
                  <CardHeader title={group.displayPath || <FormattedMessage id={'root'} />} />
                  <CardContent>
                    <Grid2 container spacing={COMPONENTS_SPACING}>
                      {group.applications.map((application) => (
                        <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={application.id}>
                          <ApplicationDashboardWidget application={application} />
                        </Grid2>
                      ))}
                    </Grid2>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </TransitionGroup>
        </Stack>
      )}
    </Page>
  );
};

export default FolderDashboard;
