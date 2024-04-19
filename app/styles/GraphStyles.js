export const FCOSE_LAYOUT = { 
    name: 'fcose',
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
    // Separation amount between nodes
    nodeSeparation: 300,
    // Ideal edge (non nested) length
    idealEdgeLength: 400,
    // Divisor to compute edge forces
    edgeElasticity: 0.95,
};


export const GRAPH_STYLESHEET = [
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
    },
  },
  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
    },
  },
];