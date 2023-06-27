import React, { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grow,
  Tooltip,
  Typography,
} from '@mui/material';
import { chain, isString, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { InfoActuatorResponse, InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceInfoQuery } from 'renderer/apis/requests/instance/info/getInstanceInfo';
import {
  ANIMATION_GROW_TOP_STYLE,
  ANIMATION_TIMEOUT_LONG,
  COMPONENTS_SPACING,
  EMPTY_STRING,
  INFO_TROUBLESHOOTING_DOCUMENTATION_URL,
} from 'renderer/constants/ui';
import InstanceInfoGit from 'renderer/pages/navigator/instance/info/components/InstanceInfoGit';
import InstanceInfoBuild from 'renderer/pages/navigator/instance/info/components/InstanceInfoBuild';
import { Masonry } from '@mui/lab';
import InstanceInfoJsonCard from 'renderer/pages/navigator/instance/info/components/InstanceInfoJsonCard';
import InstanceInfoJava from 'renderer/pages/navigator/instance/info/components/InstanceInfoJava';
import InstanceInfoOs from 'renderer/pages/navigator/instance/info/components/InstanceInfoOs';
import InstanceInfoExtraValues from 'renderer/pages/navigator/instance/info/components/InstanceInfoExtraValues';
import { splitCamelCase } from 'renderer/utils/formatUtils';
import { FormattedMessage } from 'react-intl';
import { InlineCodeLabel } from 'renderer/components/code/InlineCodeLabel';
import { TransitionGroup } from 'react-transition-group';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import ToolbarButton from 'renderer/components/common/ToolbarButton';
import PerfectScrollbar from 'react-perfect-scrollbar';

const InstanceInfo: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const [lastUpdateTime, setLastUpdateTime] = useState<number | undefined>(undefined);

  const infoState = useGetInstanceInfoQuery({ instanceId: item.id }, { refetchInterval: 1000 * 60 });
  const info = useMemo<InfoActuatorResponse | undefined>(() => infoState.data, [infoState.data]);

  useEffect(() => {
    if (!infoState.isRefetching && !infoState.isError) {
      setLastUpdateTime(Date.now());
    }
  }, [infoState.isRefetching]);

  const extraCards = useMemo<{ [key: string]: any }>(
    () =>
      chain(info?.extras)
        .map((value, key) => ({ key, value }))
        .filter((object) => !isString(object.value))
        .reduce((result, object) => ({ ...result, [object.key]: object.value }), {})
        .value(),
    [info]
  );
  const extraValues = useMemo<{ [key: string]: string }>(
    () =>
      chain(info?.extras)
        .map((value, key) => ({ key, value }))
        .filter((object) => isString(object.value))
        .reduce((result, object) => ({ ...result, [object.key]: object.value }), {})
        .value(),
    [info]
  );
  const showExtraValues = useMemo<boolean>(() => !!chain(extraValues).keys().size().value(), [extraValues]);

  const components = useMemo<{ component: ReactNode; key: string }[]>(
    () => [
      ...(info?.os ? [{ component: <InstanceInfoOs os={info.os} />, key: 'os' }] : []),
      ...(info?.build ? [{ component: <InstanceInfoBuild build={info.build} />, key: 'build' }] : []),
      ...(info?.git ? [{ component: <InstanceInfoGit git={info.git} />, key: 'git' }] : []),
      ...(info?.java ? [{ component: <InstanceInfoJava java={info.java} />, key: 'java' }] : []),
      ...(showExtraValues
        ? [{ component: <InstanceInfoExtraValues extraValues={extraValues} />, key: 'extraValues' }]
        : []),
      ...map(extraCards, (object, key) => {
        const title = splitCamelCase(key);
        return { component: <InstanceInfoJsonCard title={title} object={object} />, key: `json_${key}` };
      }),
    ],
    [info, showExtraValues, extraCards]
  );
  const componentsCount = useMemo<number>(() => components.length, [components]);

  const uiStatus = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (!info) {
      return 'loading';
    }
    if (componentsCount === 0) {
      return 'empty';
    }
    return 'content';
  }, [info, componentsCount]);

  const refreshHandler = useCallback((): void => {
    infoState.refetch();
  }, [infoState]);

  const { elementHeight, elementRef } = useElementDocumentHeight();

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && (
        <EmptyContent
          description={
            <>
              <Box>
                <FormattedMessage
                  id={'instanceInfoEmpty'}
                  values={{ class: <InlineCodeLabel code={'InfoContributor'} sx={{ verticalAlign: 'middle' }} /> }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  href={INFO_TROUBLESHOOTING_DOCUMENTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FormattedMessage id={'learnMore'} />
                </Button>
              </Box>
            </>
          }
        />
      )}

      {uiStatus === 'content' && (
        <Container disableGutters maxWidth={'md'} sx={{ m: 'auto' }}>
          <Card>
            <CardHeader
              title={<FormattedMessage id={'info'} />}
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
                  <Masonry
                    columns={{ xs: 1, lg: componentsCount > 1 ? 2 : 1 }}
                    spacing={COMPONENTS_SPACING}
                    sx={{ width: 'auto' }}
                  >
                    <TransitionGroup component={null}>
                      {components.map((component, index) => (
                        <Grow
                          timeout={(index + 1) * ANIMATION_TIMEOUT_LONG}
                          style={ANIMATION_GROW_TOP_STYLE}
                          key={component.key}
                        >
                          <Box>{component.component}</Box>
                        </Grow>
                      ))}
                    </TransitionGroup>
                  </Masonry>
                </CardContent>
              </PerfectScrollbar>
            </Box>
          </Card>
        </Container>
      )}
    </Page>
  );
};

export default InstanceInfo;
