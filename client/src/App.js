import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateCoursePage from './pages/CreateCoursePage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {}
        <div className="content"> {}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateCoursePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;