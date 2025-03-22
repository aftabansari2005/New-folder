import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Container } from '@mui/material';
import theme from './theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import QueueManagement from './components/QueueManagement';
import VoterVerification from './components/VoterVerification';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/queues"
                element={
                  <PrivateRoute adminOnly>
                    <QueueManagement />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/verify"
                element={
                  <PrivateRoute adminOnly>
                    <VoterVerification />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 