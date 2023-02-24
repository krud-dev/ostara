import { Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Handle, NodeProps, Position } from 'reactflow';
import { NODE_HEIGHT, NODE_WIDTH } from '../utils/reactFlowUtils';
import { InlineCodeLabel } from '../../../../../components/code/InlineCodeLabel';
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

export default function CustomNode({ selected, data }: CustomNodeProps) {
  const { search } = useReactFlow();

  const highlight = useMemo<boolean>(
    () => !!search && data.label.toLowerCase().indexOf(search.toLowerCase()) !== -1,
    [data.label, search]
  );

  return (
    <NodeStyled
      sx={
        highlight
          ? {
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
