import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { lightTheme } from './theme';
import { NotificationProvider } from './components/NotificationSystem';
import PrivateRoute from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import './i18n';

// Lazy load components
const Login = React.lazy(() => import('./pages/Login'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const QueueManagement = React.lazy(() => import('./pages/QueueManagement'));
const VoterVerification = React.lazy(() => import('./pages/VoterVerification'));
const QRCodeGenerator = React.lazy(() => import('./pages/QRCodeGenerator'));
const QRCodeScanner = React.lazy(() => import('./pages/QRCodeScanner'));
const UserSettings = React.lazy(() => import('./pages/UserSettings'));

const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout>
                      <UserDashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute roles={['admin', 'staff']}>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/queue"
                element={
                  <PrivateRoute roles={['admin', 'staff']}>
                    <Layout>
                      <QueueManagement />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/verify"
                element={
                  <PrivateRoute roles={['admin', 'staff']}>
                    <Layout>
                      <VoterVerification />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/qr/generate"
                element={
                  <PrivateRoute roles={['admin']}>
                    <Layout>
                      <QRCodeGenerator />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/qr/scan"
                element={
                  <PrivateRoute roles={['admin', 'staff']}>
                    <Layout>
                      <QRCodeScanner />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Layout>
                      <UserSettings />
                    </Layout>
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App; 