import * as easyAPI from './perplexityAPI';

const MODEL = 'mistral-7b-instruct';

// Function to analyze an entire graph
export async function graphAnalysis(nodes, edges, history) {

    let initPrompt = "You will be given a graph that represents the web research traversal of a user. Given the list of nodes representing topics, a list of the edges between topics, and the history (the order the user chose to research the node topics), produce a short, quick graph-level analysis of the intersectional relations of the major topics, as if this was a graph neural network. also return some info about the user's interests and what else they might be interested in learning. Graph List:"

    let graphsAdded = nodes + " Now, edge list: "

    let edgesAdded = graphsAdded + edges + "Now, history: "

    let topic = edgesAdded + history

    let response = await easyAPI.populateContent(MODEL, topic, initPrompt)

    return response
    // return major relationships and topics explored in this graph
}

export async function nodeAnalysis(nodes, edges, history) {

    let initPrompt = "You will be given a node list that represents the web research traversal of a user. Given the list of nodes representing topics, produce a short, quick node-level analysis of the nodes, as if this was a graph neural network. Node List:"

    let response = await easyAPI.populateContent(MODEL, nodes, initPrompt)

    return response
    // return major relationships and topics explored in this graph
}

export async function edgeAnalysis(nodes, edges, history) {

    let initPrompt = "You will be given a list of edges that represents the web research traversal of a user. Given the list of edges, produce a short, quick node-level analysis of the nodes, as if this was a graph neural network. Edge List:"

    let response = await easyAPI.populateContent(MODEL, edges, initPrompt)

    return response
    // return major relationships and topics explored in this graph
}

// export async function refactor(page){

//     let pageString = JSON.stringify(page)

//     let prompt = "Here is a page, with the nodes, list of edges, and the history (order of initial traversal) of a graph. Refactor the edges and history based on what connections are strongest and a graph layout like a graph neural network (so we can learn from it), keep the rest of the values the same."

//     let response = await easyAPI.populateContent(MODEL, pageString, prompt)

//     let newPage = JSON.parse(response)

//     return newPage
// }