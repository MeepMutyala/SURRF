/**
 * traversalOps.js
 * 
 * PURPOSE: This file contains functions that implement Traversal Operations 
 *          to traverse and update the vertices on the Traversal page
 * 
 * RETURNS: For now, the non-helper functions should return an object containing all the information
 *          that page.js can parse through and update each of it's vertices with.
 *          Object Structure:
 *              - 
 *              - 
 *              - 
 *  */ 
import * as easyAPI from './easyAPI'; // Adjust the import path as necessary




/** HELPER
 * Saves the backwards node to the current graph traversal
 * so it is not lost
 * @returns backward node
 */
async function saveBackwards(){

}

/** 
 * Save a current graph traversal to history
 * @returns nothing
 */
async function saveToHistory(){
    
}

/**
 * Update the current graph traversal's data structure (should be JSON)
 * @returns nothing
 */
async function updateDS(){
    
}

/**
 * return the object
 */
export async function updateTraversalPage(model, cur, page) {
    try {
      let description = await easyAPI.populateContent(model, cur);
      // Wait for the getContentForDefaultSuggestionNodes promise to resolve
      let next = await easyAPI.getContentForDefaultSuggestionNodes(model, cur, page.history);
      console.log(next);

      // Add new nodes into nodes array
      const newNodes = [...page.nodes, { data: { id: next[0] } }, { data: { id: next[1] } }];
      console.log(newNodes);

      const newEdges = [...page.edges, 
        { data: { id: `${cur}-${next[0]}`, source: cur, target: next[0] } },
        { data: { id: `${cur}-${next[1]}`, source: cur, target: next[1] } },
      ]

      console.log(newEdges);
      const newHistory = [...page.history, next[0], next[1]];
    
      // Return a page object
      return {
        nodes: newNodes,
        edges: newEdges,
        cur: { title: cur, description: description },
        history: newHistory,
      };
    } catch (error) {
      // If an error occurs in the above await calls, it will be caught here
      console.error('An error occurred:', error);
      // Handle the error as needed or rethrow it
      throw error;
    }
  }

async function parseString(input) {
    // Example of an asynchronous operation before parsing
    //await someAsyncOperation();

    // Parsing logic remains the same
    const pattern = /^(\d+)\.\s*(.*)$/gm;
    const matches = [];
    let match;
    while ((match = pattern.exec(input)) !== null) {
        const text = match[2].trim();
        matches.push(text);
    }

    if (matches.length === 2) {
        return [matches[0], matches[1]];
    } else {
        return null;
    }
}