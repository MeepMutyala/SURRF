import * as perplexityAPI from './perplexityAPI';
import * as exaAPI from './exaAPI';

// Function to create a new traversal
export async function createTraversal(topic) {
  const node = { data: { id: topic } };
  console.log(topic);
  let suggestions = await exaAPI.getRelatedTopics(topic, 2);
  console.log(suggestions);

  return {
    nodes: [node],  //nodes in the graph
    edges: [],
    lastClicked: node,
    history: [topic],                         // history of nodes in the graph
    suggestions: suggestions
  };
}

// Function to update the page when a node is clicked
export async function updatePage(clickedTopic, currentPage) {
  try {
    const [content, sourcesAndLinks] = await Promise.all([
      perplexityAPI.generateContent('mistral-7b-instruct', clickedTopic),
      exaAPI.getSourcesAndLinks(clickedTopic)
    ]);

    const lastNode = currentPage.lastClicked;
    const suggestions = await exaAPI.getRelatedTopics(clickedTopic, 2);

    const newNode = { data: { id: clickedTopic } };

    let updatedNodes = [...currentPage.nodes, newNode];
    let updatedEdges = currentPage.edges;
    let updatedHistory = currentPage.history;

    if (!currentPage.history.includes(clickedTopic)) {
      let newEdge = { 
        data: { 
          id: `${lastNode.data.id}-${clickedTopic}`, 
          source: lastNode.data.id, 
          target: clickedTopic 
        } 
      };
      updatedEdges = [...currentPage.edges, newEdge];
      updatedHistory = [...currentPage.history, clickedTopic];
    }

    return {
      nodes: updatedNodes,
      edges: updatedEdges,
      clicked: {
        nodeID: newNode.data.id,
        info: content,
        sources: sourcesAndLinks
      },
      lastClicked: newNode,
      history: updatedHistory,
      suggestions: suggestions
    };
  } catch (error) {
    console.error('Error updating graph:', error);
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