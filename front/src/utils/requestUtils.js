import front from "../settings/Frontend";

async function interceptResponse(response) {
    if (response.status === 429) {
        throw new Error('Too Many Requests');
    }

    if (response.status === 404) {
        throw new Error('Not Found');
    }

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response;
}

export default async function nicerFetch({
    endpoint,
    method = 'GET',
    token = null,
    responseCache = null,
    body = null,
    headers = {}
  }) {
    const cacheKey = JSON.stringify({ endpoint, method, body, headers });
    if (responseCache) {
        const cached = responseCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < front.cacheTime * 1000) {
            console.log("Loaded from Cache.")
            return cached.data;
        }
    }

    const defaultHeaders = {'Content-Type': 'application/json'}
    headers = { ...defaultHeaders, ...headers }
    if (token) {
        headers = { 
            'Authorization': `Token ${token}`,  
            ...headers, 
        }
    }
    body = body && JSON.stringify(body)

    const response = await fetch(endpoint, {
        method, headers, body
    });
    await interceptResponse(response);

    const data = await response.json()

    if (responseCache) {
        responseCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });
        console.log("Stored to Cache.")
    }

    return data;
}
