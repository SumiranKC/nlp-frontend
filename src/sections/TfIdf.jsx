// src/sections/TfIdf.jsx
import React, { useState } from 'react';
import { apiFetchTfIdf } from '../api/nlpApi';
import '../css/sections.css';
import '../css/tfidf.css';

const TfIdf = () => {
  const [docs, setDocs] = useState([
    "Natural Language Processing builds smart dashboard tools.",
    "Data scientists train deep learning computer algorithms.",
    "Dashboard applications help map visual coordinate interfaces."
  ]);
  const [vocabulary, setVocabulary] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDocText = (index, value) => {
    const updated = [...docs];
    updated[index] = value;
    setDocs(updated);
  };

  const calculateTfIdfWeights = async () => {
    const activeDocs = docs.filter(d => d.trim().length > 0);
    if (activeDocs.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetchTfIdf(activeDocs);
      setVocabulary(data.vocabulary || []);
      setMatrix(data.matrix || []);
    } catch (err) {
      setError(`Pipeline Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tf-idf" className="section-wrapper">
      <section className="nlp-section">
        <h2>🧮 TF-IDF Importance Matrix</h2>
        <p className="section-subtitle">Compare relative term value weights across multiple distinct document sets simultaneously.</p>
        
        <div className="section-card tfidf-grid-container">
          {/* Dynamic Multi-document Inputs */}
          {docs.map((doc, idx) => (
            <div key={idx} className="doc-input-row">
              <span className="input-count-badge">Doc {idx + 1}</span>
              <input 
                type="text"
                value={doc}
                onChange={(e) => updateDocText(idx, e.target.value)}
                className="token-input-field"
                placeholder={`Document text dataset element ${idx + 1}...`}
                style={{ flex: 1, margin: 0 }}
              />
            </div>
          ))}

          <button 
            type="button" 
            className="btn-primary"
            onClick={calculateTfIdfWeights}
            disabled={loading}
          >
            {loading ? "Computing Importance Vectors..." : "Compute TF-IDF Matrix"}
          </button>

          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)' }}>{error}</p>}

          {/* Interactive Term Frequency Comparison Matrix Grid */}
          {vocabulary.length > 0 && matrix.length > 0 && (
            <div className="matrix-table-wrapper">
              <table className="tokens-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#334155', color: '#fff' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #475569' }}>Unique Token Index</th>
                    {matrix.map((_, docIdx) => (
                      <th key={docIdx} style={{ padding: '10px', textAlign: 'center', border: '1px solid #475569' }}>Doc {docIdx + 1} Weight</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vocabulary.map((term, termIdx) => (
                    <tr key={term} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-code)', border: '1px solid #334155' }}>"{term}"</td>
                      {matrix.map((docVector, docIdx) => {
                        const val = docVector[termIdx];
                        return (
                          <td 
                            key={docIdx} 
                            style={{ padding: '10px', textAlign: 'center', border: '1px solid #334155' }}
                            className={val > 0 ? "matrix-cell-highlight" : "matrix-cell-zero"}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TfIdf;