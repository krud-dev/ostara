import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Card, CircularProgress, Divider } from '@mui/material';
import { isEmpty } from 'lodash';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { InstanceRO, IntegrationGraphActuatorResponse } from '../../../../../common/generated_definitions';
import { useGetInstanceIntegrationGraphQuery } from '../../../../apis/requests/instance/integration-graph/getInstanceIntegrationGraph';
import { COMPONENTS_SPACING } from '../../../../constants/ui';
import useElementDocumentHeight from '../../../../hooks/useElementDocumentHeight';
import { useTheme } from '@mui/material/styles';
import { Edge, Node } from 'reactflow';
import CustomReactFlow from './components/CustomReactFlow';
import { ReactFlowData } from './utils/reactFlowUtils';
import SearchToolbar from '../../../../components/common/SearchToolbar';
import { ReactFlowContext, ReactFlowProvider } from './contexts/ReactFlowContext';

const InstanceIntegrationGraph: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const theme = useTheme();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const integrationGraphState = useGetInstanceIntegrationGraphQuery({ instanceId: item.id });

  const data = useMemo<IntegrationGraphActuatorResponse | undefined>(
    () => integrationGraphState.data,
    [integrationGraphState.data]
  );
  const loading = useMemo<boolean>(() => !data, [data]);
  const empty = useMemo<boolean>(() => !!data && isEmpty(data.nodes), [data]);

  const nodes = useMemo<Node[] | undefined>(
    () =>
      data?.nodes?.map((node) => ({
        id: node.nodeId.toString(),
        data: { label: node.name, componentType: node.componentType },
        position: { x: 0, y: 0 },
        type: 'custom',
      })),
    [data]
  );
  const edges = useMemo<Edge[] | undefined>(
    () =>
      data?.links?.map((link) => ({
        id: `${link.from}_${link.to}`,
        source: link.from.toString(),
        target: link.to.toString(),
      })),
    [data]
  );
  const graphData = useMemo<ReactFlowData | undefined>(
    () => (!!nodes && !!edges ? { nodes, edges } : undefined),
    [nodes, edges]
  );

  const bottomOffset = useMemo<number>(() => parseInt(theme.spacing(COMPONENTS_SPACING), 10), []);
  const { elementHeight, elementRef } = useElementDocumentHeight({ bottomOffset });

  return (
    <ReactFlowProvider>
      <ReactFlowContext.Consumer>
        {({ search, setSearch }) => (
          <Page>
            <Card ref={elementRef} sx={{ height: elementHeight }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <SearchToolbar filter={search} onFilterChange={setSearch} />
                <Divider />

                {loading && (
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}

                {empty && <EmptyContent text={<FormattedMessage id={'noData'} />} />}

                {graphData && (
                  <Box sx={{ flexGrow: 1 }}>
                    <CustomReactFlow data={graphData} />
                  </Box>
                )}
              </Box>
            </Card>
          </Page>
        )}
      </ReactFlowContext.Consumer>
    </ReactFlowProvider>
  );
};

export default InstanceIntegrationGraph;
