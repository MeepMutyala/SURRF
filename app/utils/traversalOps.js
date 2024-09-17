import * as easyAPI from './easyAPI';

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
    history: [topic],                                   // history of nodes in the graph
    suggestions: suggestions
  };
}

// Function to update the page
export async function updatePage(model, clickedTopic, currentPage) {
  try {

    const lastNode = currentPage.lastClicked;

    const options = await easyAPI.getTwoSuggestions(model, clickedTopic, currentPage.history);

    // if info already exists, then get from where it is, not making a request again
    // you can implement this later. you need to run an MVP right now

    const generatedInfo = await easyAPI.populateContent(model, clickedTopic, "tell me about this: ");
    const newNode = { data: { id: clickedTopic } };

    let updatedNodes = [...currentPage.nodes, newNode];
    let updatedEdges = currentPage.edges
    let updatedHistory = currentPage.history

    if(!currentPage.history.includes(clickedTopic)){
      let newEdge = { 
        data: { 
          id: `${lastNode.data.id}-${clickedTopic}`, 
          source: lastNode.data.id, 
          target: clickedTopic 
        } 
      };
      updatedEdges = [...currentPage.edges, newEdge]
      updatedHistory = [...currentPage.history, clickedTopic];
    }

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