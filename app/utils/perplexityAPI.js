console.log('perplexityAPI module loaded');
/**
 * Cursor-generated functionality lol:
 * 
 *  */
export async function generateContent(model, topic) {
  const auth = 'Bearer ' + process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'Be precise and concise.' },
        { role: 'user', content: `Provide information about: ${topic}` }
      ],
      max_tokens: 1000,
      temperature: 0.2,
      top_p: 0.9
    })
  };

  try {
    console.log('Sending request to Perplexity API:', JSON.stringify(options, null, 2));
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    return data.choices[0].message.content;
  } catch (err) {
    console.error('Error in generateContent:', err);
    throw err;
  }
}

/**
 * The most basic call to the perplexity API, 
 * @param model [string] model to use
 * @param prompt [string] prompt for the perplexity engine
 * @returns data- json object of response
 */

export async function perplexityCall(model, prompt) {
  const auth = 'Bearer ' + process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'Be precise and concise.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 1000,
      stream: false
    })
  };

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error in perplexityCall:', err);
    throw err;
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
    // console.log(responseHold);

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
export async function getKMostRelatedTopics(model, k, topic, history = [], maxRelations = 10) {
  const prompt = `Generate ${maxRelations} closely related topics to "${topic}" in a comma-separated list. Exclude any topics already in this list: ${history.join(', ')}. Do not number or explain the list.`;
  
  try {
    const content = await generateContent(model, prompt);
    const topics = content.split(',').map(t => t.trim());
    return topics.filter(t => !history.includes(t)).slice(0, k);
  } catch (error) {
    console.error('Error generating related topics:', error);
    return [];
  }
}

/**
 * 
 * @param model 
 * @param k 
 * @param topic 
 * @returns list format of top k most related topics
 */
export async function getTwoSuggestions(model, topic, history=[]){

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