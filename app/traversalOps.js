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
import * as easyAPI from './/easyAPI'; // Adjust the import path as necessary




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
export async function updateTraversalPage(model, topic, last, history = []) {
    try {
      console.log(topic);
      let out = await easyAPI.populateContent(model, topic)
      // Wait for the getContentForDefaultSuggestionNodes promise to resolve
      let str = await easyAPI.getContentForDefaultSuggestionNodes(model, topic, history);
      console.log(str);
  
  
      // After the promise resolves, define the page object
      // let page = {
      //   left: { topic: str[0] },
      //   right: { topic: str[1] },
      //   main: { topic: topic,
      //           description: out},
      //   backward: { topic: last },
      // };

      let page = {
        nodes: [
          {data: { id: 'Left', label: str[0], description: '' }},
          {data: { id: 'Right', label: str[1], description: '' }},
          {data: { id: 'Main', label: topic, description: out }},
          {data: { id: 'Backward', label: last, description: '' }},
          ],
          edges: [
          ],
      };
      // Return the page object
      return page;
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