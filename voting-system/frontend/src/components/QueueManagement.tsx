import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  LinearProgress,
  Alert,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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

const QueueNumber = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const QueueManagement = () => {
  const theme = useTheme();
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchQueues = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/queues`);
      setQueues(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleUpdate = async (roomNumber: number, currentQueue: number, estimatedWaitTime: number) => {
    setUpdating(roomNumber);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/queues/update`,
        { roomNumber, currentQueue, estimatedWaitTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setQueues(queues.map(queue =>
        queue.room_number === roomNumber ? response.data : queue
      ));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update queue');
    } finally {
      setUpdating(null);
    }
  };

  const handleIncrement = (roomNumber: number) => {
    const queue = queues.find(q => q.room_number === roomNumber);
    if (queue) {
      handleUpdate(roomNumber, queue.current_queue + 1, queue.estimated_wait_time);
    }
  };

  const handleDecrement = (roomNumber: number) => {
    const queue = queues.find(q => q.room_number === roomNumber);
    if (queue && queue.current_queue > 0) {
      handleUpdate(roomNumber, queue.current_queue - 1, queue.estimated_wait_time);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Queue Management</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchQueues}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {queues.map((queue) => (
          <Grid item xs={12} md={4} key={queue.room_number}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Room {queue.room_number}
                </Typography>
                <QueueNumber>
                  {queue.current_queue}
                </QueueNumber>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleIncrement(queue.room_number)}
                    disabled={updating === queue.room_number}
                  >
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleDecrement(queue.room_number)}
                    disabled={updating === queue.room_number || queue.current_queue === 0}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Estimated Wait Time (minutes)"
                  type="number"
                  value={queue.estimated_wait_time}
                  onChange={(e) => handleUpdate(
                    queue.room_number,
                    queue.current_queue,
                    parseInt(e.target.value) || 0
                  )}
                  disabled={updating === queue.room_number}
                  sx={{ mb: 2 }}
                />
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {new Date(queue.updated_at).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QueueManagement; 