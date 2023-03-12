import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Edge, getConnectedEdges, getIncomers, getOutgoers, Node } from 'reactflow';
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
}

const ReactFlowProvider: FunctionComponent<ReactFlowProviderProps> = ({ nodes, edges, children }) => {
  const theme = useTheme();

  const [search, setSearch] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  const [incomingNodeIds, setIncomingNodeIds] = useState<string[] | undefined>(undefined);
  const [outgoingNodeIds, setOutgoingNodeIds] = useState<string[] | undefined>(undefined);
  const [incomingEdgeIds, setIncomingEdgeIds] = useState<string[] | undefined>(undefined);
  const [outgoingEdgeIds, setOutgoingEdgeIds] = useState<string[] | undefined>(undefined);

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
              style: {
                ...edge.style,
                ...(incomingEdgeIds?.includes(edge.id) ? { stroke: theme.palette.warning.main } : {}),
                ...(outgoingEdgeIds?.includes(edge.id) ? { stroke: theme.palette.fatal.main } : {}),
              },
            })),
          }
        : undefined,
    [layoutData, incomingEdgeIds, outgoingEdgeIds]
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

      if (!newSelectedNode) {
        setIncomingNodeIds(undefined);
        setOutgoingNodeIds(undefined);
        setIncomingEdgeIds(undefined);
        setOutgoingEdgeIds(undefined);
        return;
      }

      const connectedEdges = getConnectedEdges([newSelectedNode], graphData?.edges || []);
      setIncomingEdgeIds(connectedEdges.filter((edge) => edge.target === newSelectedNode.id).map((edge) => edge.id));
      setOutgoingEdgeIds(connectedEdges.filter((edge) => edge.source === newSelectedNode.id).map((edge) => edge.id));
      setIncomingNodeIds(
        getIncomers(newSelectedNode, graphData?.nodes || [], graphData?.edges || []).map((node) => node.id)
      );
      setOutgoingNodeIds(
        getOutgoers(newSelectedNode, graphData?.nodes || [], graphData?.edges || []).map((node) => node.id)
      );
    },
    [graphData, setSelectedNode, setIncomingEdgeIds, setOutgoingEdgeIds, setIncomingNodeIds, setOutgoingNodeIds]
  );

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
