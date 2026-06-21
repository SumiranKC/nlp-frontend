import React from 'react';
import './css/global.css';
import Navbar from './components/Navbar';
import Preprocessing from './sections/Preprocessing';
import BagOfWords from './sections/BagOfWords';
import TfIdf from './sections/TfIdf';
import Embeddings from './sections/Embeddings';
import NeuralNet from './sections/NeuralNet';

function App() {
  return (
    <div className="app-container">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Multi-Section NLP Layout Modules */}
      <main>
        <Preprocessing />
        <BagOfWords />
        <TfIdf />
        <Embeddings />
        <NeuralNet />
      </main>
    </div>
  );
}

export default App;