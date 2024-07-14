export const FCOSE_LAYOUT = { 
  name: 'fcose',
  avoidOverlap: true,
  nodeDimensionsIncludeLabels: true,
  nodeSeparation: 10,
  idealEdgeLength: 10,
  edgeElasticity: 0.95,
};

export const getGraphStylesheet = (isDarkMode) => [
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
      'border-color': isDarkMode ? 'white' : 'black',
      'text-wrap': 'wrap',
      'color': isDarkMode ? 'white' : 'black',
    },
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'width': '1rem',
      'line-color': isDarkMode ? 'white' : 'black',
    },
  },
];