//proxy.js
export default async function handler(model) {
    const url = 'https://api.perplexity.ai/chat/completions';
    let auth = 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY;
    let promptCall = {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: auth,
        },
        body: JSON.stringify({
          model: model, // ',
          messages: [
            { role: 'system', content: 'Be precise and concise.' },
            { role: 'user', content: "Tell me about bananas." } // Talk a little bit about its relation to {previous}.
          ]
        })
      };

    // Forward the request to the Perplexity API
    const response = await fetch(url, promptCall);
  
    // Forward the response back to the client
    const data = await response.json();
    return data
    // res.status(apiRes.status).json(data);
  }