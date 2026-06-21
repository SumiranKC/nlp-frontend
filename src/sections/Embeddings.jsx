import React from 'react';
import '../css/sections.css';

const Embeddings = () => {
  return (
    <div id="embeddings" className="section-wrapper">
      <section className="nlp-section">
        <h2>📍 Word Embeddings</h2>
        <p className="section-subtitle">Transforming text into high-dimensional geometric dense vectors.</p>
        <div className="section-card">
          <p><strong>Interactive Demo Coming Soon:</strong> We will link this to vector weights to showcase how words with similar contexts cluster together in mathematical space.</p>
        </div>
      </section>
    </div>
  );
};

export default Embeddings;