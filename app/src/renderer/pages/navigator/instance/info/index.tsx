import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';
import { Box, Container, Grow } from '@mui/material';
import { chain, filter, isString, keys, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { InfoActuatorResponse, InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceInfoQuery } from 'renderer/apis/requests/instance/info/getInstanceInfo';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from 'renderer/constants/ui';
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

const InstanceInfo: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const infoState = useGetInstanceInfoQuery({ instanceId: item.id });
  const info = useMemo<InfoActuatorResponse | undefined>(() => infoState.data, [infoState.data]);

  const uiStatus = useMemo<'loading' | 'empty' | 'content'>(() => {
    if (!info) {
      return 'loading';
    }
    if (
      !info.os &&
      !info.build &&
      !info.git &&
      !info.java &&
      !chain(info.extras)
        .keys()
        .some((key) => !!info.extras[key])
        .value()
    ) {
      return 'empty';
    }
    return 'content';
  }, [info]);

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

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && (
        <EmptyContent
          description={
            <FormattedMessage
              id={'instanceInfoEmpty'}
              values={{ class: <InlineCodeLabel code={'InfoContributor'} sx={{ verticalAlign: 'middle' }} /> }}
            />
          }
        />
      )}

      {uiStatus === 'content' && (
        <Container disableGutters maxWidth={'md'} sx={{ m: 'auto' }}>
          <Masonry columns={{ xs: 1, lg: componentsCount > 1 ? 2 : 1 }} spacing={COMPONENTS_SPACING} sx={{ mx: 0 }}>
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
        </Container>
      )}
    </Page>
  );
};

export default InstanceInfo;
