// src/sections/BagOfWords.jsx
import React, { useState } from 'react';
import { apiFetchBagOfWords } from '../api/nlpApi';
import '../css/sections.css';

// Accepts the clean token array passed down from the parent state container
const BagOfWords = ({ preprocessedTokens = [] }) => {
  const [vocab, setVocab] = useState([]);
  const [vector, setVector] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateBagOfWordsMatrix = async () => {
    // 🛡️ Error protection handler if Section 1 hasn't been run yet
    if (!preprocessedTokens || preprocessedTokens.length === 0) {
      setError("No active tokens found! Please process text in the Preprocessing section above first.");
      setVocab([]);
      setVector([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Stream the clean tokens array straight across the internet to Render
      const data = await apiFetchBagOfWords(preprocessedTokens);
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
          Transform your preprocessed tokens into a numerical frequency vector mapping active structural occurrences.
        </p>
        
        <div className="section-card">
          {/* Active Token Monitoring Box */}
          <div style={{ marginBottom: '20px' }}>
            <span className="section-label">Active Preprocessed Inputs:</span>
            <div className="tokens-display-box" style={{ background: '#1e293b', padding: '12px', borderRadius: '6px', minHeight: '48px', marginTop: '6px' }}>
              {preprocessedTokens.length > 0 ? (
                preprocessedTokens.map((token, idx) => (
                  <span key={idx} className="token-badge" style={{ backgroundColor: '#3b82f6', margin: '2px', display: 'inline-block' }}>
                    {token}
                  </span>
                ))
              ) : (
                <span style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic' }}>
                  ⚠️ Pipeline Empty. Process input text in Section 1 above to load token arrays.
                </span>
              )}
            </div>
          </div>

          {/* Action Execution Pipeline Trigger */}
          <button 
            type="button" 
            className="btn-primary"
            onClick={calculateBagOfWordsMatrix}
            disabled={loading}
          >
            {loading ? "Computing Frequency Vectors..." : "Generate Bag of Words Vector"}
          </button>

          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)', marginTop: '12px' }}>{error}</p>}

          {/* Vector Array Output Presentation Grid */}
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