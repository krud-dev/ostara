import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Box, Container, Grow, Stack } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { HealthActuatorResponse, HealthActuatorResponse$Component, InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceHealthQuery } from 'renderer/apis/requests/instance/health/getInstanceHealth';
import { useIntl } from 'react-intl';
import InstanceHealthComponentCard from 'renderer/pages/navigator/instance/health/components/InstanceHealthComponentCard';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from 'renderer/constants/ui';
import { TransitionGroup } from 'react-transition-group';

export type EnrichedHealthActuatorResponse$Component = {
  name: string;
  path: string;
} & HealthActuatorResponse$Component;

const InstanceHealth: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();
  const intl = useIntl();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const healthState = useGetInstanceHealthQuery({ instanceId: item.id });
  const health = useMemo<HealthActuatorResponse | undefined>(() => healthState.data, [healthState.data]);

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

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && <EmptyContent />}

      {uiStatus === 'content' && (
        <Container disableGutters maxWidth={'md'} sx={{ m: 'auto' }}>
          <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
            <TransitionGroup component={null}>
              {components?.map((component, index) => (
                <Grow timeout={(index + 1) * ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
                  <Box>
                    <InstanceHealthComponentCard component={component} key={component.path} />
                  </Box>
                </Grow>
              ))}
            </TransitionGroup>
          </Stack>
        </Container>
      )}
    </Page>
  );
};

export default InstanceHealth;
