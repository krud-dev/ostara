import React, {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { Background, Controls, MiniMap, OnInit, ReactFlow, ReactFlowInstance } from 'reactflow';
import CustomNode from './CustomNode';
import { NodeTypes } from '@reactflow/core/dist/esm/types/general';
import { useReactFlow } from '../contexts/ReactFlowContext';
import { Node } from '@reactflow/core/dist/esm/types/nodes';

const ReactFlowStyled = styled(ReactFlow)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,

  '.react-flow__minimap': {
    backgroundColor: theme.palette.background.paper,

    '.react-flow__minimap-mask': {
      fill: alpha(theme.palette.background.default, 0.5),
    },

    '.react-flow__minimap-node': {
      fill: theme.palette.background.neutral,
      stroke: 'none',
    },
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

type CustomReactFlowProps = {};

const CustomReactFlow: FunctionComponent<CustomReactFlowProps> = ({}) => {
  const { graphData, search, selectedNode, isHighlight, selectNode } = useReactFlow();

  const reactFlowRef = useRef<ReactFlowInstance>();

  const [visible, setVisible] = useState<boolean>(false);

  const nodeTypes = useMemo<NodeTypes>(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    if (search) {
      const highlightedNodes = graphData?.nodes.filter((node) => isHighlight(search, node.data));
      reactFlowRef.current?.fitView({ nodes: highlightedNodes });
    }
  }, [search, graphData]);

  const onInit: OnInit = useCallback(
    (_reactFlowInstance): void => {
      reactFlowRef.current = _reactFlowInstance;
      _reactFlowInstance.fitView({
        // nodes: selectedNode ? [selectedNode] : undefined,
        // maxZoom: selectedNode ? 0.75 : undefined,
      });
      setVisible(true);
    },
    [selectedNode]
  );

  const nodeClickHandler = useCallback(
    (event: ReactMouseEvent, node: Node): void => {
      selectNode(node);
    },
    [selectNode]
  );

  const paneClickHandler = useCallback((): void => {
    selectNode(undefined);
  }, [selectNode]);

  if (!graphData) {
    return null;
  }

  return (
    <ReactFlowStyled
      nodes={graphData.nodes}
      edges={graphData.edges}
      nodeTypes={nodeTypes}
      nodesConnectable={false}
      nodesDraggable={false}
      elementsSelectable
      selectionOnDrag={false}
      proOptions={{ hideAttribution: true }}
      onInit={onInit}
      onNodeClick={nodeClickHandler}
      onPaneClick={paneClickHandler}
      fitView
      minZoom={0.25}
      maxZoom={2}
      sx={{ ...(visible ? {} : { opacity: 0 }) }}
    >
      <Background />
      <MiniMap />
      <ControlsStyled showInteractive={false} />
    </ReactFlowStyled>
  );
};

export default CustomReactFlow;
