import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ThemeProvider from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ComponentDemoPage from './pages/ComponentDemoPage';
import { LoginPage, RegisterPage, DashboardPage, DownloadPage, NotFoundPage } from './pages/PlaceholderPages';
import RegistrationForm from './components/auth/RegistrationForm';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/d/:id" element={<DownloadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/components" element={<ComponentDemoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;