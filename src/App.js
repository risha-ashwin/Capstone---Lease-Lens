import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import WhatYoullSee from './pages/WhatYoullSee';
import UploadPage from './pages/Upload';
import About from './pages/About';
import Security from './pages/Security';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/what-youll-see" element={<WhatYoullSee />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<Analysis />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
