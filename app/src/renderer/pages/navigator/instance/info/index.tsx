import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Container } from '@mui/material';
import { chain, map } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { InfoActuatorResponse, InstanceRO } from 'common/generated_definitions';
import LogoLoaderCenter from 'renderer/components/common/LogoLoaderCenter';
import { useGetInstanceInfoQuery } from 'renderer/apis/requests/instance/info/getInstanceInfo';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import InstanceInfoGit from 'renderer/pages/navigator/instance/info/components/InstanceInfoGit';
import InstanceInfoBuild from 'renderer/pages/navigator/instance/info/components/InstanceInfoBuild';
import { Masonry } from '@mui/lab';
import InstanceInfoJsonCard from 'renderer/pages/navigator/instance/info/components/InstanceInfoJsonCard';
import InstanceInfoJava from 'renderer/pages/navigator/instance/info/components/InstanceInfoJava';
import InstanceInfoOs from 'renderer/pages/navigator/instance/info/components/InstanceInfoOs';

const InstanceInfo: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

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

  return (
    <Page sx={{ height: '100%' }}>
      {uiStatus === 'loading' && <LogoLoaderCenter />}
      {uiStatus === 'empty' && <EmptyContent />}

      {uiStatus === 'content' && (
        <Container disableGutters maxWidth={'md'} sx={{ m: 'auto' }}>
          <Masonry columns={{ xs: 1, lg: 2 }} spacing={COMPONENTS_SPACING} sx={{ mx: 0 }}>
            {info?.os && <InstanceInfoOs os={info.os} />}
            {info?.build && <InstanceInfoBuild build={info.build} />}
            {info?.git && <InstanceInfoGit git={info.git} />}
            {info?.java && <InstanceInfoJava java={info.java} />}
            {map(info?.extras, (object, key) => (
              <InstanceInfoJsonCard title={key} object={object} key={key} />
            ))}
          </Masonry>
        </Container>
      )}
    </Page>
  );
};

export default InstanceInfo;
