// frontend/src/sections/BagOfWords.jsx
import React, { useState, useEffect } from 'react';
import { apiFetchBagOfWords } from '../api/nlpApi'; 
import '../css/sections.css';
import '../css/bagofwords.css';

const BagOfWords = () => {
  const [text, setText] = useState("Apple product launch was great. I love my new Apple phone.");

  // State to hold values computed over on the Python Flask backend
  const [result, setResult] = useState({
    vocabulary: [],
    frequency_map: {},
    vector_array: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced side-effect tracking to call our modular API service
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!text.trim()) return;
      setLoading(true);
      setError(null);
      
      try {
        const data = await apiFetchBagOfWords(text);
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  return (
    <div id="bag-of-words" className="section-wrapper">
      <section className="nlp-section">
        <h2>📊 Bag of Words (BoW)</h2>
        <p className="section-subtitle">Convert raw word counts into static vector matrices computed dynamically by Python.</p>
        
        <div className="section-card bow-container">
          <div>
            <label htmlFor="bowTextInput" className="section-label">Input Text Segment:</label>
            <textarea 
              id="bowTextInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="preprocessing-textarea"
              placeholder="Type sample documents to build frequency counts..."
            />
          </div>

          {loading && <p className="empty-tokens-text">⚡ Python is vectorizing token metrics...</p>}
          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)' }}>⚠️ Connection Error: {error}</p>}

          <div className="bow-layout" style={{ opacity: loading ? 0.6 : 1 }}>
            {/* Left Panel: Vocabulary Dictionary */}
            <div className="bow-panel">
              <h4>📖 Feature Dictionary Index ({result.vocabulary.length} Unique Words)</h4>
              <div className="vocab-grid">
                {result.vocabulary.length > 0 ? result.vocabulary.map((word, index) => (
                  <span key={index} className="vocab-item">
                    {index}: <strong>{word}</strong>
                  </span>
                )) : <span className="empty-tokens-text">Awaiting input token arrays...</span>}
              </div>
            </div>

            {/* Right Panel: Feature Frequency Table */}
            <div className="bow-panel">
              <h4>🔢 Generated Dense Vector Vector Array</h4>
              {result.vocabulary.length > 0 ? (
                <table className="vector-table">
                  <thead>
                    <tr>
                      <th>Token Word</th>
                      <th>Vocab Index</th>
                      <th>Frequency Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.vocabulary.map((word, index) => (
                      <tr key={index}>
                        <td><strong>{word}</strong></td>
                        <td>{index}</td>
                        <td className="vector-highlight">{result.frequency_map[word]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="empty-tokens-text">No occurrences tracked.</span>
              )}
            </div>
          </div>

          {/* Quick visual dump of the array structure standard models ingest */}
          {result.vector_array.length > 0 && (
            <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              <strong>Resulting Model Input Representation Array:</strong> [{result.vector_array.join(', ')}]
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BagOfWords;