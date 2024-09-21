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
      'background-color': isDarkMode ? '#4a5568' : '#3182ce',
      'label': 'data(label)',
      'color': isDarkMode ? '#ffffff' : '#000000',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'width': '40px',
      'height': '40px',
      'border-color': '#000000',
      'border-width': '1px',
      'border-opacity': 0.5,
      'shape': 'ellipse'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': isDarkMode ? '#718096' : '#4299e1',
      'target-arrow-color': isDarkMode ? '#718096' : '#4299e1',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier'
    }
  },
  {
    selector: '.suggestion',
    style: {
      'background-color': isDarkMode ? '#68d391' : '#48bb78',
      'border-color': isDarkMode ? '#2f855a' : '#2f855a',
      'border-width': '2px'
    }
  }
];