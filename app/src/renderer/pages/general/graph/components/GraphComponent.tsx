import React, { FunctionComponent } from 'react';
import { Box, Divider } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { Edge, Node } from 'reactflow';
import CustomReactFlow from './CustomReactFlow';
import SearchToolbar from '../../../../components/common/SearchToolbar';
import { ReactFlowContext, ReactFlowProvider } from '../contexts/ReactFlowContext';
import LogoLoaderCenter from '../../../../components/common/LogoLoaderCenter';

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

            {loading && <LogoLoaderCenter />}

            {empty && <EmptyContent />}

            {graphData && !empty && (
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
