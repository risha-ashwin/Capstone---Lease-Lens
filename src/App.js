import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HowItWorks from './pages/HowItWorks';
import WhatYoullSee from './pages/WhatYoullSee';
import UploadPage from './pages/Upload';
import About from './pages/About';
import Security from './pages/Security';
import Analysis from './pages/Analysis';
import ClausesPage from './pages/ClausesPage';
import RisksPage from './pages/RisksPage';
import TopThingsPage from './pages/TopThingsPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/SignInPage';

function App() {
  return (
    <Router basename="/Capstone---Lease-Lens">
      <Routes>
        {/* Public */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/how-it-works"  element={<Navigate to="/#how-it-works" replace />} />
        <Route path="/what-youll-see" element={<Navigate to="/" replace />} />
        <Route path="/security"      element={<Security />} />
        <Route path="/about"         element={<About />} />
        <Route path="/login"         element={<LoginPage />} />

        {/* Protected */}
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/analysis/clauses" element={<ProtectedRoute><ClausesPage /></ProtectedRoute>} />
        <Route path="/analysis/clauses/:clauseId" element={<ProtectedRoute><ClausesPage /></ProtectedRoute>} />
        <Route path="/analysis/risks" element={<ProtectedRoute><RisksPage /></ProtectedRoute>} />
        <Route path="/analysis/highlights" element={<ProtectedRoute><TopThingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;