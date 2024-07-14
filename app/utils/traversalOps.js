import * as easyAPI from './easyAPI';

// Constants for class names
const CLASS_NAMES = {
  NODE: 'Node',
  EDGE: 'Edge',
  PAGE: 'Page'
};

// Function to create a new traversal
export async function createTraversal(model, topic) {
  const node = { data: { id: topic } };
  console.log(topic);
  let suggestions = await easyAPI.getTwoSuggestions(model, topic, []);
  console.log(suggestions);

  return {
    nodes: [node],  //nodes in the graph
    edges: [],
    lastClicked: node,
    history: [node],                                   // history of nodes in the graph
    suggestions: suggestions
  };
}

// Function to create a new page
export async function pageCreate(model, topic) {
  const initialNode = { data: { id: topic } };
  const suggestions = await easyAPI.getTwoSuggestions(model, topic, []);

  return {
    nodes: [initialNode],
    edges: [],
    lastClicked: initialNode,
    history: [initialNode],
    suggestions: suggestions
  };
}
// Function to update the page
export async function updatePage(model, clickedTopic, currentPage) {
  try {

    // need to check if topic is already in history and if so, don't draw an edge

    const options = await easyAPI.getTwoSuggestions(model, clickedTopic, currentPage.history);
    const generatedInfo = await easyAPI.populateContent(model, clickedTopic, "tell me about this: ");

    const newNode = { data: { id: clickedTopic } };
    const updatedNodes = [...currentPage.nodes, newNode];
    const lastNode = currentPage.lastClicked;

    const newEdge = { 
      data: { 
        id: `${lastNode.data.id}-${clickedTopic}`, 
        source: lastNode.data.id, 
        target: clickedTopic 
      } 
    };
    const updatedEdges = [...currentPage.edges, newEdge];

    const updatedHistory = [...currentPage.history, clickedTopic];

    return {
      nodes: updatedNodes,
      edges: updatedEdges,
      clicked: {
        nodeID: newNode.data.id,
        info: generatedInfo
      },
      lastClicked: newNode,
      history: updatedHistory,
      suggestions: options
    };
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

// Helper function to parse strings (unchanged)
async function parseString(input) {
  const pattern = /^(\d+)\.\s*(.*)$/gm;
  const matches = [];
  let match;
  while ((match = pattern.exec(input)) !== null) {
    const text = match[2].trim();
    matches.push(text);
  }

  return matches.length === 2 ? [matches[0], matches[1]] : null;
}

// Placeholder for saveToHistory function
async function saveToHistory() {
  // Implementation to be added
}