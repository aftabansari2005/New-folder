import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Queue as QueueIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  marginBottom: theme.spacing(2),
}));

interface Queue {
  room_number: number;
  current_queue: number;
  estimated_wait_time: number;
}

const UserDashboard = () => {
  const theme = useTheme();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/queues');
      setQueues(response.data);
    } catch (error) {
      console.error('Error fetching queues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to generate QR codes');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/qr/generate',
        {
          voterId: 'USER_' + Date.now(), // Generate a unique ID
          roomNumber: '1', // Default room
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQrCode(response.data.qrCode);
      setError('');
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('Error generating QR code:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Voter Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View queue status and generate your QR code
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Queue Status Section */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconWrapper>
                  <QueueIcon />
                </IconWrapper>
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                  Real-time Queue Status
                </Typography>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {queues.map((queue) => (
                    <Paper key={queue.room_number} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6">
                        Room {queue.room_number}
                      </Typography>
                      <Typography>
                        Current Queue: {queue.current_queue}
                      </Typography>
                      <Typography>
                        Estimated Wait Time: {queue.estimated_wait_time} minutes
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        {/* QR Code Generation Section */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconWrapper>
                  <QrCodeIcon />
                </IconWrapper>
                <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                  Your QR Code
                </Typography>
              </Box>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {qrCode ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <QRCodeSVG value={qrCode} size={256} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Show this QR code to the queue manager when your turn comes
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Generate your QR code to join the queue
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleGenerateQR}
                    sx={{ mt: 2 }}
                  >
                    Generate QR Code
                  </Button>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard; 