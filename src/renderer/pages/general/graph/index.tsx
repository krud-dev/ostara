import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { Box, Card, CircularProgress, Divider } from '@mui/material';
import EmptyContent from 'renderer/components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from '../../../constants/ui';
import useElementDocumentHeight from '../../../hooks/useElementDocumentHeight';
import { useTheme } from '@mui/material/styles';
import { Edge, Node } from 'reactflow';
import CustomReactFlow from './components/CustomReactFlow';
import SearchToolbar from '../../../components/common/SearchToolbar';
import { ReactFlowContext, ReactFlowProvider } from './contexts/ReactFlowContext';

type GraphProps = {
  nodes?: Node[];
  edges?: Edge[];
};

const Graph: FunctionComponent<GraphProps> = ({ nodes, edges }) => {
  const theme = useTheme();

  const bottomOffset = useMemo<number>(() => parseInt(theme.spacing(COMPONENTS_SPACING), 10), []);
  const { elementHeight, elementRef } = useElementDocumentHeight({ bottomOffset });

  return (
    <ReactFlowProvider nodes={nodes} edges={edges}>
      <ReactFlowContext.Consumer>
        {({ graphData, loading, empty, search, setSearch }) => (
          <Page>
            <Card ref={elementRef} sx={{ height: elementHeight }}>
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
            </Card>
          </Page>
        )}
      </ReactFlowContext.Consumer>
    </ReactFlowProvider>
  );
};

export default Graph;
