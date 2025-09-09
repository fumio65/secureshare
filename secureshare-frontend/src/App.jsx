import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage, DashboardPage, DownloadPage, NotFoundPage } from './pages/PlaceholderPages';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/d/:id" element={<DownloadPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;