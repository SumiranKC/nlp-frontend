// Ensure there is NO trailing slash here if your endpoints have a leading slash
const BASE_URL = 'https://nlp-dashboard-backend.onrender.com/api'; 

const postRequest = async (endpoint, payload) => {
  try {
    // Manually ensure clean string concatenation without doubling up slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const targetUrl = `${BASE_URL}${cleanEndpoint}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: Server returned status code ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Network failure on ${endpoint}:`, error);
    throw error;
  }
};

// --- MODULAR ENDPOINT EXECUTION FUNCTIONS ---
export const apiPreprocessText = (text) => postRequest('/preprocess', { text });
export const apiFetchBagOfWords = (text) => postRequest('/bag-of-words', { text });
export const apiFetchTfIdf = (docs) => postRequest('/tfidf', { docs });
export const apiFetchEmbeddings = (text) => postRequest('/embeddings', { text });