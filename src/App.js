import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import WhatYoullSee from './pages/WhatYoullSee';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/what-youll-see" element={<WhatYoullSee />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
