import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { Card } from '@mui/material';
import { COMPONENTS_SPACING } from '../../../constants/ui';
import useElementDocumentHeight from '../../../hooks/useElementDocumentHeight';
import { useTheme } from '@mui/material/styles';
import { Edge, Node } from 'reactflow';
import GraphComponent from './components/GraphComponent';

type GraphPageProps = {
  nodes?: Node[];
  edges?: Edge[];
};

const GraphPage: FunctionComponent<GraphPageProps> = ({ nodes, edges }) => {
  const theme = useTheme();

  const bottomOffset = useMemo<number>(() => parseInt(theme.spacing(COMPONENTS_SPACING), 10), []);
  const { elementHeight, elementRef } = useElementDocumentHeight({ bottomOffset });

  return (
    <Page>
      <Card ref={elementRef} sx={{ height: elementHeight }}>
        <GraphComponent nodes={nodes} edges={edges} />
      </Card>
    </Page>
  );
};

export default GraphPage;
