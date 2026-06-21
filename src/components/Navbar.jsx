import React from 'react';
import '../css/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">🧠 NLP Workspace</div>
      <ul className="nav-links">
        <li><a href="#preprocessing">Preprocessing</a></li>
        <li><a href="#bag-of-words">Bag of Words</a></li>
        <li><a href="#tf-idf">TF-IDF</a></li>
        <li><a href="#embeddings">Embeddings</a></li>
        <li><a href="#neural-net">Neural Network</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;