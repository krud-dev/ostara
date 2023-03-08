import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { alpha, experimentalStyled as styled } from '@mui/material/styles';
import { Handle, NodeProps, Position } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from '../utils/reactFlowUtils';
import { InlineCodeLabel } from '../../../../components/code/InlineCodeLabel';
import { useReactFlow } from '../contexts/ReactFlowContext';

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

export default function CustomNode({ data }: CustomNodeProps) {
  const { search, isHighlight } = useReactFlow();

  const highlight = useMemo<boolean>(() => isHighlight(search, data), [search, data]);

  return (
    <NodeStyled
      sx={
        highlight
          ? {
              background: (theme) => alpha(theme.palette.primary.main, 0.16),
              borderColor: (theme) => theme.palette.primary.main,
            }
          : undefined
      }
    >
      <Handle type="target" position={Position.Top} />
      <Typography variant={'body2'} noWrap sx={{ direction: 'rtl', textAlign: 'center' }}>
        {data.label}
      </Typography>
      <Handle type="source" position={Position.Bottom} />

      <InlineCodeLabel
        code={data.componentType}
        sx={{
          position: 'absolute',
          bottom: -11,
          maxWidth: NODE_WIDTH / 2 - 28,
          whiteSpace: 'nowrap',
          background: (theme) => theme.palette.background.paper,
        }}
      />
    </NodeStyled>
  );
}
