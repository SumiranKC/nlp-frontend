// frontend/src/api/nlpApi.js

const BASE_URL = 'https://nlp-dashboard-backend.onrender.com/api'; // Update this to your actual backend URL

/**
 * Helper utility to handle standard POST configurations and error parsing
 */
const postRequest = async (endpoint, payload) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
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
    throw error; // Pass the error up so the React component can display it to the user
  }
};

// --- MODULAR ENDPOINT EXECUTION FUNCTIONS ---

export const apiPreprocessText = (text) => {
  return postRequest('/preprocess', { text });
};

export const apiFetchBagOfWords = (text) => {
  return postRequest('/bag-of-words', { text });
};

export const apiFetchTfIdf = (docs) => {
  return postRequest('/tfidf', { docs });
};

export const apiFetchEmbeddings = (wordA, wordB) => {
  return postRequest('/embeddings', { wordA, wordB });
};