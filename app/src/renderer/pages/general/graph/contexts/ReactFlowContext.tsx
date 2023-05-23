import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Edge, getIncomers, getOutgoers, Node } from 'reactflow';
import { isEmpty } from 'lodash';
import { getLayoutElements, ReactFlowData } from '../utils/reactFlowUtils';
import { useTheme } from '@mui/material/styles';

export type ReactFlowContextProps = {
  graphData?: ReactFlowData;
  loading: boolean;
  empty: boolean;
  search: string;
  setSearch: (search: string) => void;
  selectedNode?: Node;
  incomingNodeIds?: string[];
  outgoingNodeIds?: string[];
  isHighlight: (searchString: string, data: any) => boolean;
  selectNode: (selectedNode?: Node) => void;
};

const ReactFlowContext = React.createContext<ReactFlowContextProps>(undefined!);

interface ReactFlowProviderProps extends PropsWithChildren<any> {
  nodes?: Node[];
  edges?: Edge[];
  initialSelectedNode?: Node;
}

const ReactFlowProvider: FunctionComponent<ReactFlowProviderProps> = ({
  nodes,
  edges,
  initialSelectedNode,
  children,
}) => {
  const theme = useTheme();

  const [search, setSearch] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(initialSelectedNode);
  const [incomingNodeIds, setIncomingNodeIds] = useState<string[] | undefined>(undefined);
  const [outgoingNodeIds, setOutgoingNodeIds] = useState<string[] | undefined>(undefined);

  const [layoutData, setLayoutData] = useState<ReactFlowData | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (nodes && edges) {
        setLayoutData(await getLayoutElements(nodes, edges));
      }
    })();
  }, [nodes, edges]);

  const graphData = useMemo<ReactFlowData | undefined>(
    () =>
      layoutData
        ? {
            nodes: layoutData.nodes,
            edges: layoutData.edges.map((edge) => ({
              ...edge,
              animated: !selectedNode || selectedNode.id === edge.source || selectedNode.id === edge.target,
              interactionWidth: 0,
              style: {
                transition: 'all 0.4s ease',
                pointerEvents: 'none',
                ...edge.style,
                ...(!!selectedNode && selectedNode.id !== edge.source && selectedNode.id !== edge.target
                  ? { opacity: 0.3 }
                  : {}),
                ...(selectedNode?.id === edge.target ? { stroke: theme.palette.warning.main, strokeWidth: 3 } : {}),
                ...(selectedNode?.id === edge.source ? { stroke: theme.palette.fatal.main, strokeWidth: 3 } : {}),
              },
            })),
          }
        : undefined,
    [layoutData, selectedNode]
  );

  const loading = useMemo<boolean>(() => !graphData, [graphData]);
  const empty = useMemo<boolean>(() => !!graphData && isEmpty(graphData.nodes), [graphData]);

  const isHighlight = useCallback(
    (searchString: string, data: any) =>
      !!searchString && data.label.toLowerCase().indexOf(searchString.toLowerCase()) !== -1,
    []
  );

  const selectNode = useCallback(
    (newSelectedNode?: Node): void => {
      setSelectedNode(newSelectedNode);
    },
    [setSelectedNode]
  );

  useEffect(() => {
    if (!selectedNode) {
      setIncomingNodeIds(undefined);
      setOutgoingNodeIds(undefined);
      return;
    }

    setIncomingNodeIds(
      getIncomers(selectedNode, graphData?.nodes || [], graphData?.edges || []).map((node) => node.id)
    );
    setOutgoingNodeIds(
      getOutgoers(selectedNode, graphData?.nodes || [], graphData?.edges || []).map((node) => node.id)
    );
  }, [selectedNode, graphData]);

  return (
    <ReactFlowContext.Provider
      value={{
        graphData,
        loading,
        empty,
        search,
        setSearch,
        selectedNode,
        incomingNodeIds,
        outgoingNodeIds,
        isHighlight,
        selectNode,
      }}
    >
      {children}
    </ReactFlowContext.Provider>
  );
};

const useReactFlow = (): ReactFlowContextProps => {
  const context = useContext(ReactFlowContext);

  if (!context) throw new Error('ReactFlowContext must be used inside ReactFlowProvider');

  return context;
};

export { ReactFlowContext, ReactFlowProvider, useReactFlow };
