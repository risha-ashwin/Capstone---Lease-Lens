import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import WhatYoullSee from './pages/WhatYoullSee';
import UploadPage from './pages/Upload';
import About from './pages/About';
import Security from './pages/Security';
import Analysis from './pages/Analysis';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/SignInPage';

function App() {
  return (
    <Router basename="/Capstone---Lease-Lens">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/what-youll-see" element={<WhatYoullSee />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;