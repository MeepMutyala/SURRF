import * as perplexityAPI from './perplexityAPI';
import * as exaAPI from './exaAPI';

const CONTENT_MODEL = 'llama-3.1-sonar-large-128k-online';
const SUGGESTION_MODEL = 'llama-3.1-sonar-small-128k-chat';

export async function createTraversal(topic) {
  const node = { data: { id: topic } };

  return {
    nodes: [node],
    edges: [],
    lastClicked: node,
    history: [topic],
    suggestions: []
  };
}


export async function updatePage(clickedTopic, currentPage) {
  try {
    const [content, sourcesAndLinks, suggestions] = await Promise.all([
      perplexityAPI.generateContent(CONTENT_MODEL, clickedTopic),
      exaAPI.getSourcesAndLinks(clickedTopic),
      perplexityAPI.getKMostRelatedTopics(SUGGESTION_MODEL, 2, clickedTopic)
    ]);

    const lastNode = currentPage.lastClicked;
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

    // Remove old suggestion nodes and edges
    updatedNodes = updatedNodes.filter(node => !currentPage.suggestions.includes(node.data.id));
    updatedEdges = updatedEdges.filter(edge => !currentPage.suggestions.includes(edge.data.target));

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