import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { InstanceRO, IntegrationGraphActuatorResponse } from '../../../../../common/generated_definitions';
import { useGetInstanceIntegrationGraphQuery } from '../../../../apis/requests/instance/integration-graph/getInstanceIntegrationGraph';
import { Edge, Node } from 'reactflow';
import GraphPage from '../../../general/graph';

const InstanceIntegrationGraph: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const integrationGraphState = useGetInstanceIntegrationGraphQuery({ instanceId: item.id });

  const data = useMemo<IntegrationGraphActuatorResponse | undefined>(
    () => integrationGraphState.data,
    [integrationGraphState.data]
  );

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

  return <GraphPage nodes={nodes} edges={edges} />;
};

export default InstanceIntegrationGraph;
