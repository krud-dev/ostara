import React, { FunctionComponent, useMemo } from 'react';
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { Background, Controls, MiniMap, OnInit, ReactFlow } from 'reactflow';
import CustomNode from './CustomNode';
import { NodeTypes } from '@reactflow/core/dist/esm/types/general';
import { getLayoutElements, ReactFlowData } from '../utils/reactFlowUtils';

const ReactFlowStyled = styled(ReactFlow)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const MiniMapStyled = styled(MiniMap)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,

  '.react-flow__minimap-mask': {
    fill: alpha(theme.palette.background.default, 0.5),
  },

  '.react-flow__minimap-node': {
    fill: theme.palette.background.neutral,
    stroke: 'none',
  },
}));

const ControlsStyled = styled(Controls)(({ theme }) => ({
  button: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    color: theme.palette.primary.main,
    borderRadius: `${theme.shape.borderRadius}px`,
    marginTop: theme.spacing(0.5),
    position: 'relative',

    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.primary.main}`,

      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: `${theme.shape.borderRadius}px`,
      },
    },

    path: {
      fill: 'currentColor',
    },
  },
}));

type CustomReactFlowProps = {
  data: ReactFlowData;
};

const CustomReactFlow: FunctionComponent<CustomReactFlowProps> = ({ data }) => {
  const nodeTypes = useMemo<NodeTypes>(() => ({ custom: CustomNode }), []);
  const layoutData = useMemo<ReactFlowData>(() => getLayoutElements(data.nodes, data.edges), [data]);

  const onInit: OnInit = (_reactFlowInstance): void => {
    _reactFlowInstance.fitView();
  };

  return (
    <ReactFlowStyled
      nodes={layoutData.nodes}
      edges={layoutData.edges}
      nodeTypes={nodeTypes}
      nodesConnectable={false}
      nodesDraggable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
      onInit={onInit}
      fitView
      minZoom={0.25}
      maxZoom={2}
    >
      <Background />
      <MiniMapStyled />
      <ControlsStyled showInteractive={false} />
    </ReactFlowStyled>
  );
};

export default CustomReactFlow;
