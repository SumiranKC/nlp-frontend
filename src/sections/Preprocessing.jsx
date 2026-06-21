// frontend/src/sections/Preprocessing.jsx
import React, { useState } from 'react';
import { apiPreprocessText } from '../api/nlpApi';
import '../css/sections.css';
import '../css/preprocessing.css';

const Preprocessing = () => {
  // Demo text contains sample email addresses and websites to test the updated cleaner
  const [text, setText] = useState("Check out www.latrobe.edu.au or send files to user@domain.com! The fast cats are jumping over fences.");
  
  // Independent layout status objects to freeze steps until run button clicks occur
  const [stagesData, setStagesData] = useState({
    cleaned_text: null,
    tokens: null,
    filtered_tokens: null,
    lemmatized_tokens: null
  });

  const [loadingStage, setLoadingStage] = useState(null);
  const [error, setError] = useState(null);

  // Core orchestration routine to fetch calculation snapshots from Python
  const executePipelinePhase = async (targetStage) => {
    if (!text.trim()) return;

    setLoadingStage(targetStage);
    setError(null);

    try {
      const data = await apiPreprocessText(text);
      
      // Update the targeted section block using values pulled down from the server environment
      setStagesData(prev => {
        const nextState = { ...prev };
        if (targetStage >= 1) nextState.cleaned_text = data.cleaned_text;
        if (targetStage >= 2) nextState.tokens = data.tokens;
        if (targetStage >= 3) nextState.filtered_tokens = data.filtered_tokens;
        if (targetStage >= 4) nextState.lemmatized_tokens = data.lemmatized_tokens;
        return nextState;
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStage(null);
    }
  };

  return (
    <div id="preprocessing" className="section-wrapper">
      <section className="nlp-section">
        <h2>🔤 Text Preprocessing Pipeline</h2>
        <p className="section-subtitle">Isolate data cleaning step-by-step. Filter emails, web links, common stopwords, and isolate root tokens via Python.</p>
        
        <div className="section-card">
          <label htmlFor="rawTextInput" className="section-label">Input Corpus Fragment:</label>
          <textarea 
            id="rawTextInput"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="preprocessing-textarea"
            placeholder="Type code lines or structural sample documents here..."
          />

          {error && <p className="empty-tokens-text" style={{ color: 'var(--color-danger)' }}>⚠️ Pipeline Error: {error}</p>}

          <div className="pipeline-container">
            <h3 className="pipeline-title">Pipeline Execution Tracks:</h3>
            
            {/* Stage 1: Text Normalization */}
            <div className="pipeline-stage stage-normalization">
              <div className="stage-header-row">
                <strong className="stage-title-text">1. Normalization (Lower, Punctuation, Clean Links & Emails):</strong>
                <button 
                  type="button" 
                  className="btn-trigger-stage"
                  onClick={() => executePipelinePhase(1)}
                  disabled={loadingStage !== null}
                >
                  {loadingStage === 1 ? "Running..." : "Run Stage 1"}
                </button>
              </div>
              {stagesData.cleaned_text !== null ? (
                <p className="stage-output-text">{stagesData.cleaned_text || '(Result Vector String Empty)'}</p>
              ) : (
                <p className="empty-tokens-text">Click button to sweep hyper-links and normalize text variables.</p>
              )}
            </div>

            {/* Stage 2: Tokenization */}
            <div className="pipeline-stage stage-tokenization">
              <div className="stage-header-row">
                <strong className="stage-title-text">2. Tokenization (Word Array Dissection):</strong>
                <button 
                  type="button" 
                  className="btn-trigger-stage"
                  onClick={() => executePipelinePhase(2)}
                  disabled={loadingStage !== null}
                >
                  {loadingStage === 2 ? "Running..." : "Run Stage 2"}
                </button>
              </div>
              {stagesData.tokens !== null ? (
                <div className="token-badge-container">
                  {stagesData.tokens.length > 0 ? stagesData.tokens.map((token, idx) => (
                    <span key={idx} className="token-badge">[{idx}] {token}</span>
                  )) : <p className="empty-tokens-text">No active strings parsed.</p>}
                </div>
              ) : (
                <p className="empty-tokens-text">Awaiting baseline text array splitting tokens...</p>
              )}
            </div>

            {/* Stage 3: Stopword Filtering */}
            <div className="pipeline-stage stage-stopwords">
              <div className="stage-header-row">
                <strong className="stage-title-text">3. Stopword Removal (Filter Noise Words):</strong>
                <button 
                  type="button" 
                  className="btn-trigger-stage"
                  onClick={() => executePipelinePhase(3)}
                  disabled={loadingStage !== null}
                >
                  {loadingStage === 3 ? "Running..." : "Run Stage 3"}
                </button>
              </div>
              {stagesData.filtered_tokens !== null ? (
                <div className="token-badge-container">
                  {stagesData.filtered_tokens.length > 0 ? stagesData.filtered_tokens.map((token, idx) => (
                    <span key={idx} className="clean-token-badge">{token}</span>
                  )) : <p className="empty-tokens-text">All elements filtered out by stopword registry patterns.</p>}
                </div>
              ) : (
                <p className="empty-tokens-text">Awaiting noise-cancellation term filtering...</p>
              )}
            </div>

            {/* Stage 4: Lemmatization */}
            <div className="pipeline-stage stage-lemmatization">
              <div className="stage-header-row">
                <strong className="stage-title-text">4. Lemmatization (Morphological Root Synthesis):</strong>
                <button 
                  type="button" 
                  className="btn-trigger-stage"
                  onClick={() => executePipelinePhase(4)}
                  disabled={loadingStage !== null}
                >
                  {loadingStage === 4 ? "Running..." : "Run Stage 4"}
                </button>
              </div>
              {stagesData.lemmatized_tokens !== null ? (
                <div className="token-badge-container">
                  {stagesData.lemmatized_tokens.length > 0 ? stagesData.lemmatized_tokens.map((token, idx) => (
                    <span key={idx} className="lemma-token-badge">{token}</span>
                  )) : <p className="empty-tokens-text">No structural features remain.</p>}
                </div>
              ) : (
                <p className="empty-tokens-text">Awaiting dictionary lookups to map terms down to core lemmas...</p>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Preprocessing;