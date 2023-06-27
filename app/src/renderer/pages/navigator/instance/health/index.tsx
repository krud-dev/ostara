import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grow,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { HealthActuatorResponse, HealthActuatorResponse$Component, InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceHealthQuery } from 'renderer/apis/requests/instance/health/getInstanceHealth';
import { FormattedMessage, useIntl } from 'react-intl';
import InstanceHealthComponentCard from 'renderer/pages/navigator/instance/health/components/InstanceHealthComponentCard';
import {
  ANIMATION_GROW_TOP_STYLE,
  ANIMATION_TIMEOUT_LONG,
  COMPONENTS_SPACING,
  EMPTY_STRING,
} from 'renderer/constants/ui';
import { TransitionGroup } from 'react-transition-group';
import ToolbarButton from 'renderer/components/common/ToolbarButton';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';

export type EnrichedHealthActuatorResponse$Component = {
  name: string;
  path: string;
} & HealthActuatorResponse$Component;

const InstanceHealth: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();
  const intl = useIntl();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const [lastUpdateTime, setLastUpdateTime] = useState<number | undefined>(undefined);

  const healthState = useGetInstanceHealthQuery({ instanceId: item.id }, { refetchInterval: 1000 * 60 });
  const health = useMemo<HealthActuatorResponse | undefined>(() => healthState.data, [healthState.data]);

  useEffect(() => {
    if (!healthState.isRefetching && !healthState.isError) {
      setLastUpdateTime(Date.now());
    }
  }, [healthState.isRefetching]);

  const uiStatus = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (!health) {
      return 'loading';
    }
    return 'content';
  }, [health]);

  const flattenComponents = useCallback(
    (
      components: { [index: string]: HealthActuatorResponse$Component } | undefined,
      currentPath = ''
    ): EnrichedHealthActuatorResponse$Component[] => {
      if (!components) {
        return [];
      }

      const flattenedArray: EnrichedHealthActuatorResponse$Component[] = [];

      for (const key in components) {
        const component = components[key];
        const name = key;
        const path = currentPath ? `${currentPath} / ${key}` : key;
        flattenedArray.push({ name, path, ...component });

        if (component.components) {
          const childComponents = flattenComponents(component.components, path);
          flattenedArray.push(...childComponents);
        }
      }

      return flattenedArray;
    },
    []
  );

  const components = useMemo<EnrichedHealthActuatorResponse$Component[] | undefined>(
    () =>
      health
        ? [
            {
              name: intl.formatMessage({ id: 'instance' }),
              path: intl.formatMessage({ id: 'instance' }),
              status: health.status,
              details: health.details,
            },
            ...flattenComponents(health.components),
          ]
        : undefined,
    [health]
  );

  const refreshHandler = useCallback((): void => {
    healthState.refetch();
  }, [healthState]);

  const { elementHeight, elementRef } = useElementDocumentHeight();

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && <EmptyContent />}

      {uiStatus === 'content' && (
        <Container disableGutters maxWidth={'md'} sx={{ m: 'auto' }}>
          <Card>
            <CardHeader
              title={<FormattedMessage id={'health'} />}
              subheader={
                <Tooltip title={<FormattedMessage id={'lastUpdateTime'} />}>
                  <Typography variant={'body2'} component={'span'} sx={{ color: 'text.secondary' }}>
                    {lastUpdateTime ? <FormattedDateAndRelativeTime value={lastUpdateTime} /> : EMPTY_STRING}
                  </Typography>
                </Tooltip>
              }
              action={
                <ToolbarButton
                  tooltip={<FormattedMessage id={'refresh'} />}
                  icon={'RefreshOutlined'}
                  onClick={refreshHandler}
                />
              }
              sx={{ pb: 3 }}
            />
            <Divider />
            <Box ref={elementRef} sx={{ height: elementHeight }}>
              <PerfectScrollbar options={{ wheelPropagation: true }}>
                <CardContent>
                  <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
                    <TransitionGroup component={null}>
                      {components?.map((component, index) => (
                        <Grow
                          timeout={(index + 1) * ANIMATION_TIMEOUT_LONG}
                          style={ANIMATION_GROW_TOP_STYLE}
                          key={component.path}
                        >
                          <Box>
                            <InstanceHealthComponentCard component={component} />
                          </Box>
                        </Grow>
                      ))}
                    </TransitionGroup>
                  </Stack>
                </CardContent>
              </PerfectScrollbar>
            </Box>
          </Card>
        </Container>
      )}
    </Page>
  );
};

export default InstanceHealth;
