import React, { FunctionComponent } from 'react';
import { Box, CircularProgress, Divider } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { Edge, Node } from 'reactflow';
import CustomReactFlow from './CustomReactFlow';
import SearchToolbar from '../../../../components/common/SearchToolbar';
import { ReactFlowContext, ReactFlowProvider } from '../contexts/ReactFlowContext';

type GraphComponentProps = {
  nodes?: Node[];
  edges?: Edge[];
  initialSelectedNode?: Node;
};

const GraphComponent: FunctionComponent<GraphComponentProps> = ({ nodes, edges, initialSelectedNode }) => {
  return (
    <ReactFlowProvider nodes={nodes} edges={edges} initialSelectedNode={initialSelectedNode}>
      <ReactFlowContext.Consumer>
        {({ graphData, loading, empty, search, setSearch }) => (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SearchToolbar filter={search} onFilterChange={setSearch} />
            <Divider />

            {loading && (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}

            {empty && <EmptyContent text={<FormattedMessage id={'noData'} />} />}

            {graphData && (
              <Box sx={{ flexGrow: 1 }}>
                <CustomReactFlow />
              </Box>
            )}
          </Box>
        )}
      </ReactFlowContext.Consumer>
    </ReactFlowProvider>
  );
};

export default GraphComponent;
