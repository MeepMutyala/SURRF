import React from 'react';

const API_KEY = '' //be careful with posting!

/**
 * The most basic call to the perplexity API, 
 * @param model [string] model to use
 * @param prompt [string] prompt for the perplexity engine
 * @returns data- json object of response
 */

export async function perplexityCall(model, prompt) {
  let auth = 'Bearer ' + API_KEY;

  let promptCall = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: auth
    },
    body: JSON.stringify({
      model: model, // 'mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'Be precise and concise.' },
        { role: 'user', content: prompt } // Talk a little bit about its relation to {previous}.
      ]
    })
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', promptCall);
    const data = await response.json();

    // Now that responseHold is defined, access the content field
    const messageContent = data.choices[0].message.content;
    // console.log(messageContent);
    // Return the whole response or just the messageContent as needed
    return data; // or return messageContent if you only need that

  } catch (err) {
    console.error(err);
    // Handle the error case, possibly by re-throwing the error or returning a default value
    throw err; // Re-throw the error if you want to allow the caller to handle it
    // return null; // Or return a default value
  }
}

/**
 * returns the contents of a node based on it's topic
 * @param model 
 * @param topic - topic for generated response to focus on
 * @param prompt - additional optional parameter to adjust results based on a prompt
 * @returns messageContent- content populated from the given
 */
export async function populateContent(model, topic, prompt='') {
  let fullPrompt = prompt + " " + topic;

  try {

    // Wait for the Promise from perplexityCall to resolve
    let responseHold = await perplexityCall(model, fullPrompt);

    // Now responseHold is the actual response data, and you can safely access its properties
    const messageContent = responseHold.choices[0].message.content;

    return messageContent;

  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * 
 * @param model 
 * @param k 
 * @param topic 
 * @returns list format of top k most related topics
 * //josh idea for changing maxrelations= k+len(history)??
 */
export async function getKMostRelatedTopics(model, k, topic, history=[], maxRelations=30){

    let str = `Return only the names of the ${maxRelations} top most related topics to this one in a list format. Do not explain anything:`
    let content = await populateContent(model, topic, str)
    content = extractTopics(content)
    console.log(content)
    let filteredContent = content.filter(item => !history.includes(item)).slice(0, k);
    return filteredContent

}

/**
 * 
 * @param model 
 * @param k 
 * @param topic 
 * @returns list format of top k most related topics
 */
export async function getContentForDefaultSuggestionNodes(model, topic, history=[]){

    let content = await getKMostRelatedTopics(model, 2, topic, history)
    return content

}

function extractTopics(content) {
  // Split the content string by the pattern and remove the first empty element if it exists
  const topics = content.split(/\d+\.\s*/).filter(Boolean);
  return topics.map(topic => topic.trim());
}


// export function generalRequest(){
//     populatePerplexity
// }