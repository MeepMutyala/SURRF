import Exa from "exa-js";

const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);


// Functions we're actually using right now

export async function getRelatedTopics(topic, count = 2) {
  try {
    const result = await exa.search(`Related topics to: ${topic}`, {
      numResults: count,
      useAutoprompt: true,
    });
    return result.results.map(r => r.title);
  } catch (error) {
    console.error('Exa API error:', error);
    return [];
  }
}

export async function getSourcesAndLinks(topic) {
  try {
    const result = await exa.search(topic, {
      numResults: 5,
      useAutoprompt: true,
    });
    return result.results.map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet
    }));
  } catch (error) {
    console.error('Exa API error:', error);
    return [];
  }
}

export async function fetchExaContent(query) {
  try {
    const result = await exa.searchAndContents(query, {
      type: "neural",
      useAutoprompt: true,
      numResults: 10,
      text: true
    });
    return result;
  } catch (error) {
    console.error('Exa API error:', error);
    throw error;
  }
}

/**
 * The most basic call to the Exa API
 * @param query [string] query for the Exa engine
 * @returns data - json object of response
 */
export async function exaCall(query) {
  try {
    const result = await exa.search(query, {
      numResults: 10,
      useAutoprompt: true,
    });
    return result;
  } catch (error) {
    console.error('Exa API error:', error);
    throw error;
  }
}

/**
 * Returns the contents based on a topic
 * @param topic - topic for generated response to focus on
 * @param prompt - additional optional parameter to adjust results based on a prompt
 * @returns messageContent - content populated from the given topic
  */
export async function populateContent(topic, prompt = '') {
  const fullQuery = prompt + " " + topic;
  try {
    const response = await exaCall(fullQuery);
    // Combine snippets from all results
    const messageContent = response.results.map(r => r.snippet).join('\n\n');
    return messageContent;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @param k 
 * @param topic 
 * @param history 
 * @returns list format of top k most related topics
 */
export async function getKMostRelatedTopics(k, topic, history = []) {
  const query = `Related topics to: ${topic}`;
  try {
    const response = await exaCall(query);
    const topics = response.results.map(r => r.title);
    const filteredTopics = topics.filter(item => !history.includes(item)).slice(0, k);
    return filteredTopics;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @param topic 
 * @param history 
 * @returns list format of top 2 most related topics
 */
export async function getTwoSuggestions(topic, history = []) {
  return getKMostRelatedTopics(2, topic, history);
}