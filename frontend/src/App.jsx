import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Collection from './Collection';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link> | <Link to="/collection">Коллекция</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </Router>
  );
}

export default App;
