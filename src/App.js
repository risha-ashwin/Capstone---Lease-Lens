import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/Upload';
import About from './pages/About';
import Security from './pages/Security';
import Analysis from './pages/Analysis';
import ClausesPage from './pages/ClausesPage';
import RisksPage from './pages/RisksPage';
import TopThingsPage from './pages/TopThingsPage';
import MyLeasesPage from './pages/MyLeases';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/SignInPage';
import Footer from './components/Footer';

/* Scrolls to top on every route change, unless navigating to a hash anchor */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/"               element={<LandingPage />} />
            <Route path="/security"       element={<Security />} />
            <Route path="/about"          element={<About />} />
            <Route path="/login"          element={<LoginPage />} />

            {/* Dead routes */}
            <Route path="/how-it-works"   element={<Navigate to="/" replace />} />
            <Route path="/what-youll-see" element={<Navigate to="/" replace />} />

            {/* Protected */}
            <Route path="/upload" element={
              <ProtectedRoute><UploadPage /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><MyLeasesPage /></ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute><Analysis /></ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute><Analysis /></ProtectedRoute>
            } />
            <Route path="/analysis/clauses" element={
              <ProtectedRoute><ClausesPage /></ProtectedRoute>
            } />
            <Route path="/analysis/clauses/:clauseId" element={
              <ProtectedRoute><ClausesPage /></ProtectedRoute>
            } />
            <Route path="/analysis/risks" element={
              <ProtectedRoute><RisksPage /></ProtectedRoute>
            } />
            <Route path="/analysis/highlights" element={
              <ProtectedRoute><TopThingsPage /></ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;