import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Queue as QueueIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const UserDashboard = () => {
  const theme = useTheme();
  const [voterId, setVoterId] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [queues, setQueues] = useState<any[]>([]);

  const fetchQueues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/queues`);
      setQueues(response.data);
    } catch (err: any) {
      setError('Failed to fetch queue data');
    }
  };

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleGenerateQR = async () => {
    if (!voterId) {
      setError('Please enter your Voter ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/voters/qr`,
        { voterId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setQrCode(response.data.qrCode);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Voter Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate QR Code
              </Typography>
              <TextField
                fullWidth
                label="Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateQR}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <QrCodeIcon />}
              >
                Generate QR Code
              </Button>
              {qrCode && (
                <QRCodeContainer>
                  <img
                    src={qrCode}
                    alt="Voter QR Code"
                    style={{ maxWidth: '200px', marginBottom: '16px' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Show this QR code to the polling officer
                  </Typography>
                </QRCodeContainer>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Queue Status
              </Typography>
              <Grid container spacing={2}>
                {queues.map((queue) => (
                  <Grid item xs={12} key={queue.room_number}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          Room {queue.room_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current Queue: {queue.current_queue}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimerIcon color="action" />
                        <Typography variant="body2">
                          {queue.estimated_wait_time} min
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard; 