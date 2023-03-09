import { Edge, Node } from 'reactflow';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled';

export const NODE_WIDTH = 350;
export const NODE_HEIGHT = 40;

export type ReactFlowData = {
  nodes: Node[];
  edges: Edge[];
};

export const getLayoutElements = async (nodes: Node[], edges: Edge[]): Promise<ReactFlowData> => {
  const elk = new ELK();

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    },
    children: [...nodes.map((node) => ({ id: node.id, width: NODE_WIDTH, height: NODE_HEIGHT }))],
    edges: [...edges.map((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] }))],
  };

  const layout = await elk.layout(graph, { layoutOptions: {} });
  const layoutNodes = nodes.map((node) => {
    const nodePosition = layout.children?.find((child) => child.id === node.id);
    return { ...node, position: { x: nodePosition?.x || 0, y: nodePosition?.y || 0 } };
  });

  return { nodes: layoutNodes, edges };
};
