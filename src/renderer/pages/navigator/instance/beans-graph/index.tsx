import React, { FunctionComponent, useMemo } from 'react';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { InstanceRO } from '../../../../../common/generated_definitions';
import { Edge, Node } from 'reactflow';
import Graph from '../../../general/graph';
import { InstanceBean, useGetInstanceBeansQuery } from '../../../../apis/requests/instance/beans/getInstanceBeans';
import { chain } from 'lodash';

const InstanceBeansGraph: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const queryState = useGetInstanceBeansQuery({ instanceId: item.id });

  const data = useMemo<InstanceBean[] | undefined>(() => queryState.data, [queryState.data]);

  const nodes = useMemo<Node[] | undefined>(
    () =>
      data
        ? chain(data)
            .uniqBy((bean) => bean.name)
            .map((bean) => ({
              id: bean.name.toString(),
              data: { label: bean.name, componentType: bean.type },
              position: { x: 0, y: 0 },
              type: 'custom',
            }))
            .value()
        : undefined,
    [data]
  );
  const edges = useMemo<Edge[] | undefined>(
    () =>
      data
        ? chain(data)
            .uniqBy((bean) => bean.name)
            .map((bean) =>
              bean.dependencies.map((dependency) => ({
                id: `${dependency}_${bean.name}`,
                source: dependency,
                target: bean.name,
                animated: true,
              }))
            )
            .flatten()
            .value()
        : undefined,
    [data]
  );

  return <Graph nodes={nodes} edges={edges} />;
};

export default InstanceBeansGraph;
