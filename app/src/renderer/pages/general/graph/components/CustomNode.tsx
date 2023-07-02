import { Box, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { Handle, NodeProps, Position } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from '../utils/reactFlowUtils';
import { InlineCodeLabel } from '../../../../components/code/InlineCodeLabel';
import { useReactFlowContext } from '../contexts/ReactFlowContext';

const NodeStyled = styled(Box)(({ theme }) => ({
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  position: 'relative',
  padding: '8px 10px',
  borderRadius: '5px',
  background: theme.palette.background.neutral,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,

  '.react-flow__handle': {
    background: theme.palette.primary.main,
    width: '10px',
    height: '10px',
    borderRadius: '3px',
  },
}));

type CustomNodeProps = NodeProps;

export default function CustomNode({ id, data }: CustomNodeProps) {
  const { search, selectedNode, incomingNodeIds, outgoingNodeIds, isHighlight } = useReactFlowContext();

  const selected = useMemo(() => selectedNode?.id === id, [selectedNode, id]);
  const incoming = useMemo<boolean>(
    () => !selected && !!incomingNodeIds?.includes(id),
    [incomingNodeIds, selected, data.id]
  );
  const outgoing = useMemo<boolean>(
    () => !selected && !!outgoingNodeIds?.includes(id),
    [outgoingNodeIds, selected, data.id]
  );
  const highlight = useMemo<boolean>(
    () => !selected && !incoming && !outgoing && isHighlight(search, data),
    [selected, incoming, search, data]
  );
  const translucent = useMemo<boolean>(
    () => !!selectedNode?.id && !selected && !incoming && !outgoing && !highlight,
    [selectedNode, selected, incoming, outgoing, highlight]
  );

  return (
    <NodeStyled
      sx={{
        transition: 'all 0.4s ease',
        ...(selected
          ? {
              background: (theme) => alpha(theme.palette.primary.main, 0.16),
              borderColor: (theme) => theme.palette.primary.main,
            }
          : undefined),
        ...(incoming
          ? {
              background: (theme) => alpha(theme.palette.warning.main, 0.16),
              borderColor: (theme) => theme.palette.warning.main,
            }
          : undefined),
        ...(outgoing
          ? {
              background: (theme) => alpha(theme.palette.fatal.main, 0.16),
              borderColor: (theme) => theme.palette.fatal.main,
            }
          : undefined),
        ...(highlight
          ? {
              background: (theme) => alpha(theme.palette.info.main, 0.16),
              borderColor: (theme) => theme.palette.info.main,
            }
          : undefined),
        ...(translucent
          ? {
              opacity: 0.3,
            }
          : undefined),
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Typography variant={'body2'} noWrap sx={{ direction: 'rtl', textAlign: 'center' }}>
        {data.label}
      </Typography>
      <Handle type="source" position={Position.Right} />

      <InlineCodeLabel
        code={data.componentType}
        sx={{
          position: 'absolute',
          bottom: -11,
          maxWidth: NODE_WIDTH - 20,
          whiteSpace: 'nowrap',
          direction: 'rtl',
          background: (theme) => theme.palette.background.paper,
        }}
      />
    </NodeStyled>
  );
}
