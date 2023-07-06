import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { Box, Button, Card, CardContent, CardHeader, Grow, Stack } from '@mui/material';
import { ApplicationRO, InstanceHealthStatus, InstanceRO } from 'common/generated_definitions';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import {
  COMPONENTS_SPACING,
  ANIMATION_TIMEOUT_SHORT,
  ANIMATION_TIMEOUT_LONG,
  ANIMATION_GROW_TOP_STYLE,
} from 'renderer/constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import ApplicationInstancesHealthStatusWidget from './components/ApplicationInstancesHealthStatusWidget';
import ApplicationInstanceWidget from './components/ApplicationInstanceWidget';
import { chain, isEmpty } from 'lodash';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog, {
  CreateInstanceDialogProps,
} from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { getNewItemSort, getSubTreeRoot } from 'renderer/utils/treeUtils';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import { TransitionGroup } from 'react-transition-group';

const ApplicationDashboard: FunctionComponent = () => {
  const { instances } = useItemsContext();
  const { selectedItem, data: navigatorData } = useNavigatorLayoutContext();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);
  const data = useMemo<InstanceRO[] | undefined>(
    () =>
      instances
        ? chain(instances)
            .filter((i) => i.parentApplicationId === item.id)
            .sortBy('sort')
            .value()
        : undefined,
    [instances, item.id]
  );
  const loading = useMemo<boolean>(() => !data, [data]);
  const healthStatuses = useMemo<InstanceHealthStatus[]>(
    () => ['UP', 'DOWN', 'UNREACHABLE', 'INVALID', 'UNKNOWN', 'OUT_OF_SERVICE', 'PENDING'],
    []
  );

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    const treeItem = getSubTreeRoot(navigatorData || [], item.id);
    if (!treeItem) {
      return;
    }

    const sort = getNewItemSort(treeItem);

    await NiceModal.show<InstanceRO[] | undefined, CreateInstanceDialogProps>(CreateInstanceDialog, {
      parentApplicationId: item.id,
      sort: sort,
    });
  }, [item, navigatorData]);

  return (
    <Page sx={{ ...(loading ? { height: '100%' } : {}) }}>
      {loading ? (
        <LogoLoaderCenter />
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <TransitionGroup component={null}>
            <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'summary'} />} />
                <CardContent>
                  <Grid2 container spacing={COMPONENTS_SPACING}>
                    <TransitionGroup component={null}>
                      {healthStatuses.map((healthStatus, index) => (
                        <Grow timeout={(index + 2) * ANIMATION_TIMEOUT_SHORT} key={healthStatus}>
                          <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2}>
                            <ApplicationInstancesHealthStatusWidget instances={data!} healthStatus={healthStatus} />
                          </Grid2>
                        </Grow>
                      ))}
                    </TransitionGroup>
                  </Grid2>
                </CardContent>
              </Card>
            </Grow>

            <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'instances'} />} />
                <CardContent>
                  {isEmpty(data) ? (
                    <EmptyContent
                      text={<FormattedMessage id={'applicationIsEmpty'} />}
                      description={
                        item.discovered ? (
                          <FormattedMessage id={'agentNotFindInstances'} />
                        ) : (
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
                        )
                      }
                    />
                  ) : (
                    <Grid2 container spacing={COMPONENTS_SPACING}>
                      {data?.map((instance) => (
                        <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={instance.id}>
                          <ApplicationInstanceWidget instance={instance} />
                        </Grid2>
                      ))}
                    </Grid2>
                  )}
                </CardContent>
              </Card>
            </Grow>
          </TransitionGroup>
        </Stack>
      )}
    </Page>
  );
};

export default ApplicationDashboard;
