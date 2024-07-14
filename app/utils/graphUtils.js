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
import { populateContent, getKMostRelatedNodes } from './easyAPI'; // Adjust the import path as necessary




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
export async function addGraphNode(cy, curNode, page) {
    try {
      // Get label of current node
      let cur = curNode.data("id");

      let description = await populateContent(cur);

      // Retrieve top k most related topics
      let next = await getKMostRelatedNodes(cur, page.history);

      console.log(`ADJACENT NODES: \n${next[0]}\n${next[1]}`);

      let numNewNodes = 0;
      let i = 0;
      let newHistory = page.history;
      while (numNewNodes < 2 && i < next.length) {
        if (!page.history.includes(next[i])) {
          cy.add({ group: "nodes", data: { id: next[i] } });
          numNewNodes += 1;
          cy.add({ group: "edges", data: { id: `${cur}-${next[i]}`, source: cur, target: next[i]}});
          newHistory.push(next[i]);
        }
        i += 1;
      }
      // Add new nodes to graph
      //cy.add({ group: "nodes", data: { id: next[0] } });
      //cy.add({ group: "nodes", data: { id: next[1] } });

      // Add new edges to graph
      //cy.add({ group: "edges", data: { id: `${cur}-${next[0]}`, source: cur, target: next[0] } });
      //cy.add({ group: "edges", data: { id: `${cur}-${next[1]}`, source: cur, target: next[1] } });

      //const newHistory = [...page.history, next[0], next[1]];

      // Return the page object
      return {
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

  export function removeGraphNode(cy, curNode, page) {
    // Remove the node
    cy.remove(curNode);

    // Remove all edges that contain the node label

    const newHistory = page.history.filter(label => label !== curNode.data("id"));

    // For some reason I cannot figure out the relative constraints...
    // Remove all constraints that contain the node label
    //const newRelativePlacement = page.relativePlacementConstraint.filter(con => con.left !== cur && con.right !== cur);
  
    // Return a page object
    return {
      cur: page.cur,
      history: newHistory,
    };
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