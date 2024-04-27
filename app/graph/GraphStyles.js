export const FCOSE_LAYOUT = { 
  name: 'fcose',
  avoidOverlap: true,
  nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
  // Separation amount between nodes
  nodeSeparation: 10,
  // Ideal edge (non nested) length
  idealEdgeLength: 10,
  // Divisor to compute edge forces
  edgeElasticity: 0.95,
};


export const GRAPH_STYLESHEET = [
{
  selector: 'node',
  style: {
    label: 'data(id)',
    'font-size': '4rem',
    'font-family': 'Montserrat',
    'text-valign': 'center',
    'text-halign': 'center',
    'background-opacity': '0',
    'border-width': '1rem',
    'border-color': 'black',
    'text-wrap': 'wrap',
  },
},
{
  selector: 'edge',
  style: {
    'curve-style': 'bezier',
    'width': '1rem',
    'line-color': 'black',
  },
},
];