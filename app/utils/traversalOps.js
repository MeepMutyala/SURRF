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
  console.log('Creating traversal for topic:', topic);
  let suggestions = await easyAPI.getTwoSuggestions(model, topic, []);
  console.log('Initial suggestions:', suggestions);
  let generatedInfo = await easyAPI.populateContent(model, topic, "tell me about this: ");
  
  return {
    nodes: [node],
    edges: [],
    clicked: {
      nodeID: node.data.id,
      info: generatedInfo
    },
    lastClicked: node,
    history: [node],
    suggestions: suggestions
  };
}

// Function to update the page
export async function updatePage(model, clickedTopic, currentPage) {
  try {
    console.log('Updating page for topic:', clickedTopic);
    
    // Check if the topic is already in history
    if (currentPage.history.some(node => node.data.id === clickedTopic)) {
      console.log('Topic already in history, not adding new node/edge');
      const existingNode = currentPage.nodes.find(node => node.data.id === clickedTopic);
      const generatedInfo = await easyAPI.populateContent(model, clickedTopic, "tell me about this: ");
      return {
        ...currentPage,
        clicked: {
          nodeID: clickedTopic,
          info: generatedInfo
        },
        lastClicked: existingNode
      };
    }

    const options = await easyAPI.getTwoSuggestions(model, clickedTopic, currentPage.history.map(node => node.data.id));
    const generatedInfo = await easyAPI.populateContent(model, clickedTopic, "tell me about this: ");
    
    const newNode = { data: { id: clickedTopic } };
    const updatedNodes = [...currentPage.nodes, newNode];
    
    const lastNode = currentPage.lastClicked;
    const newEdge = { 
      data: { 
        id: `${currentPage.lastClicked}-${clickedTopic}`, 
        source: currentPage.lastClicked, 
        target: clickedTopic 
      } 
    };
    const updatedEdges = [...currentPage.edges, newEdge];
    
    const updatedHistory = [...currentPage.history, newNode];
    
    console.log('New node added:', newNode);
    console.log('New edge added:', newEdge);
    
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