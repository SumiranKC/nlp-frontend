// frontend/src/sections/TfIdf.jsx
import React, { useState } from 'react';
import { apiFetchTfIdf } from '../api/nlpApi';
import '../css/sections.css';
import '../css/tfidf.css';

const TfIdf = () => {
  // Tracks the live editing state of the document inputs
  const [docs, setDocs] = useState([
    "AI models are changing software engineering.",
    "Software engineering relies on clean code."
  ]);

  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive exactly how many documents were processed in the last successful calculation
  const calculatedDocCount = matrix.length > 0 ? matrix[0].tfs.length : 0;

  // Document array item text updater
  const handleDocTextChange = (index, val) => {
    const updatedDocs = [...docs];
    updatedDocs[index] = val;
    setDocs(updatedDocs);
  };

  // Add an entry up to a maximum limit of 5 documents
  const addDocumentSlot = () => {
    if (docs.length < 5) {
      setDocs([...docs, ""]);
    }
  };

  // Delete an entry and ensure at least 1 document remains
  const removeDocumentSlot = (indexToRemove) => {
    if (docs.length > 1) {
      const filteredDocs = docs.filter((_, idx) => idx !== indexToRemove);
      setDocs(filteredDocs);
    }
  };

  // Manual explicit click action routine to call the Python backend
  const triggerMatrixCalculation = async () => {
    if (!docs.some(d => d.trim())) {
      setError("Please ensure at least one document contains functional text words before executing.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFetchTfIdf(docs);
      setMatrix(data.matrix || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tf-idf" className="section-wrapper">
      <section className="nlp-section">
        <h2>📈 TF-IDF Matrix</h2>
        <p className="section-subtitle">Evaluate document weights flexibly. Scale corpus lists manually and process data dynamically via Python.</p>
        
        <div className="section-card tfidf-container">
          
          {/* Dynamic Document Grid Container */}
          <div className="docs-grid">
            {docs.map((docText, index) => (
              <div key={index} className="doc-input-box">
                <div className="doc-header-row">
                  <label htmlFor={`docInput_${index}`}>Document {index + 1}:</label>
                  {docs.length > 1 && (
                    <button 
                      type="button"
                      className="btn-delete" 
                      onClick={() => removeDocumentSlot(index)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <textarea 
                  id={`docInput_${index}`}
                  value={docText} 
                  onChange={(e) => handleDocTextChange(index, e.target.value)} 
                  className="tfidf-textarea"
                  placeholder="Type textual data values here..."
                />
              </div>
            ))}
          </div>

          {/* Action Operation Dashboard Panel */}
          <div className="doc-controls">
            <button 
              type="button"
              className="btn-add" 
              onClick={addDocumentSlot}
              disabled={docs.length >= 5}
            >
              {docs.length >= 5 ? "Max Limit (5) Reached" : "+ Add Document Slot"}
            </button>
            
            <button 
              type="button"
              className="btn-calculate" 
              onClick={triggerMatrixCalculation}
              disabled={loading}
            >
              {loading ? "Computing Matrices..." : "Calculate TF-IDF"}
            </button>
          </div>

          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)' }}>⚠️ Execution Refused: {error}</p>}

          {/* Dynamic Result Data Table Intercept Matrix */}
          <div className="matrix-wrapper" style={{ opacity: loading ? 0.5 : 1 }}>
            {matrix.length > 0 ? (
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Token Term</th>
                    {/* Generates TF column headers based strictly on calculated history */}
                    {Array.from({ length: calculatedDocCount }).map((_, idx) => (
                      <th key={`tf_head_${idx}`} className="center-align">TF (D{idx + 1})</th>
                    ))}
                    <th className="center-align">DF Count</th>
                    <th className="center-align">IDF Weight</th>
                    {/* Generates TF-IDF column headers based strictly on calculated history */}
                    {Array.from({ length: calculatedDocCount }).map((_, idx) => (
                      <th key={`tfidf_head_${idx}`} className="center-align">TF-IDF (D{idx + 1})</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row) => (
                    <tr key={row.word}>
                      <td><strong>{row.word}</strong></td>
                      {/* Loop over calculated term frequencies */}
                      {row.tfs.map((tfValue, idx) => (
                        <td key={`tf_val_${idx}`} className="center-align">{tfValue}</td>
                      ))}
                      
                      {/* Displays DF using the calculation-time total document count */}
                      <td className="center-align">{row.df} / {calculatedDocCount}</td>
                      <td className="center-align">{row.idf.toFixed(3)}</td>
                      
                      {/* Loop over calculated weights and apply styling conditional maps */}
                      {row.tfidfs.map((tfidfValue, idx) => {
                        const isUniqueImportanceTerm = tfidfValue > 0 && row.df === 1;
                        return (
                          <td 
                            key={`tfidf_val_${idx}`} 
                            className={`center-align ${isUniqueImportanceTerm ? 'weight-high' : 'weight-low'}`}
                          >
                            {tfidfValue.toFixed(3)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-tokens-text" style={{ textAlign: 'center', margin: '20px 0' }}>
                💡 Click the <strong>Calculate TF-IDF</strong> button above to stream your active document metrics to Python.
              </p>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default TfIdf;