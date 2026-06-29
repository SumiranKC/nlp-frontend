// frontend/src/sections/Embeddings.jsx
import React, { useState } from 'react';
import '../css/sections.css';
import '../css/embeddings.css';

const Embeddings = () => {
  // A mock dictionary of 2-dimensional spatial word vector placements
  const wordVectors = {
    "king": { x: 0.80, y: 0.85 },
    "queen": { x: 0.82, y: 0.70 },
    "man": { x: 0.20, y: 0.85 },
    "woman": { x: 0.22, y: 0.70 },
    "apple": { x: 0.45, y: 0.20 },
    "orange": { x: 0.50, y: 0.15 },
    "computer": { x: 0.85, y: 0.35 },
    "coding": { x: 0.90, y: 0.30 }
  };

  const wordOptions = Object.keys(wordVectors);

  const [wordA, setWordA] = useState("king");
  const [wordB, setWordB] = useState("queen");

  const vecA = wordVectors[wordA];
  const vecB = wordVectors[wordB];

  // Mathematical Euclidean Distance Evaluation
  const dx = vecB.x - vecA.x;
  const dy = vecB.y - vecA.y;
  const euclideanDistance = Math.sqrt(dx * dx + dy * dy);

  return (
    <div id="embeddings" className="section-wrapper">
      <section className="nlp-section">
        <h2>📍 Word Embeddings (Vector Space)</h2>
        <p className="section-subtitle">Observe how continuous spatial coordinates capture semantic meaning. Similar concepts sit closer together.</p>
        
        <div className="section-card embeddings-container">
          
          {/* Top Selection Dashboard Dropdowns */}
          <div className="embeddings-control-panel">
            <div className="select-box">
              <label htmlFor="wordASelect">Select Word A (Blue Marker):</label>
              <select id="wordASelect" value={wordA} onChange={(e) => setWordA(e.target.value)}>
                {wordOptions.map(word => <option key={word} value={word}>{word}</option>)}
              </select>
            </div>
            <div className="select-box">
              <label htmlFor="wordBSelect">Select Word B (Purple Marker):</label>
              <select id="wordBSelect" value={wordB} onChange={(e) => setWordB(e.target.value)}>
                {wordOptions.map(word => <option key={word} value={word}>{word}</option>)}
              </select>
            </div>
          </div>

          <div className="vector-space-layout">
            {/* Left Column: 2D Spatial Graph Plotter */}
            <div className="plot-canvas">
              {/* Word Point A */}
              <div 
                className="plot-point point-a" 
                style={{ left: `${vecA.x * 100}%`, bottom: `${vecA.y * 100}%` }}
              >
                <span className="plot-label">{wordA} [{vecA.x}, {vecA.y}]</span>
              </div>

              {/* Word Point B */}
              <div 
                className="plot-point point-b" 
                style={{ left: `${vecB.x * 100}%`, bottom: `${vecB.y * 100}%` }}
              >
                <span className="plot-label">{wordB} [{vecB.x}, {vecB.y}]</span>
              </div>
            </div>

            {/* Right Column: Metric Matrix Calculations */}
            <div className="math-panel">
              <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>📐 Vector Distance Metric</h4>
              
              <div style={{ fontFamily: 'var(--font-code)', fontSize: '14px' }}>
                <div><strong>Vector A ({wordA}):</strong> [{vecA.x.toFixed(2)}, {vecA.y.toFixed(2)}]</div>
                <div><strong>Vector B ({wordB}):</strong> [{vecB.x.toFixed(2)}, {vecB.y.toFixed(2)}]</div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-default)', margin: '5px 0' }} />

              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Calculated Spatial Distance:
                </span>
                <span className="distance-callout">{euclideanDistance.toFixed(4)}</span>
              </div>

              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {euclideanDistance < 0.2 ? 
                  `🎯 Highly Semantic Link: "${wordA}" and "${wordB}" share close dimensional coordinates, proving they appear in near-identical contextual environments.` : 
                  `🚧 Distinct Semantic Gap: These terms are mathematically distant. Their contextual overlap is minimal within this registry cluster.`
                }
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Embeddings;