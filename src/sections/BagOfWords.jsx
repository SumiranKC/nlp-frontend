// src/sections/BagOfWords.jsx
import React, { useState } from 'react';
import { apiFetchBagOfWords } from '../api/nlpApi';
import '../css/sections.css';

const BagOfWords = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. The dog was not amused.");
  const [vocab, setVocab] = useState([]);
  const [vector, setVector] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateBagOfWordsMatrix = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Send the raw text string straight across the internet to Render
      // The backend will handle the preprocessing steps before calculating the counts
      const data = await apiFetchBagOfWords(text);
      setVocab(data.vocab || []);
      setVector(data.vector || []);
    } catch (err) {
      setError(`Pipeline Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="bag-of-words" className="section-wrapper">
      <section className="nlp-section">
        <h2>📊 Bag of Words Model</h2>
        <p className="section-subtitle">
          Input your raw text below. The system will automatically preprocess it (remove stopwords/punctuation) and compile the numerical frequency vector space mapping.
        </p>
        
        <div className="section-card">
          {/* Dedicated Textarea Input for this section */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="bowInput" className="section-label">Input Corpus Text:</label>
            <textarea 
              id="bowInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="preprocessing-textarea"
              placeholder="Type your sentences here to generate a frequency matrix..."
            />
          </div>

          {/* Action Execution Trigger Button */}
          <button 
            type="button" 
            className="btn-primary"
            onClick={calculateBagOfWordsMatrix}
            disabled={loading}
          >
            {loading ? "Processing & Computing Vectors..." : "Generate Bag of Words Vector"}
          </button>

          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)', marginTop: '12px' }}>{error}</p>}

          {/* Re-implemented Vector Array Presentation Table */}
          {vocab.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 className="section-label">Generated Vector Space Mapping:</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="tokens-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                  <thead>
                    <tr style={{ background: '#334155', color: '#fff' }}>
                      <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #475569' }}>Vocabulary Index Token</th>
                      <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #475569' }}>Frequency Vector Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vocab.map((word, index) => (
                      <tr key={word} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '10px', fontFamily: 'var(--font-code)', border: '1px solid #334155' }}>"{word}"</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#10b981', border: '1px solid #334155' }}>
                          {vector[index]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BagOfWords;