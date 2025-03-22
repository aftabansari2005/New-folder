import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { io } from 'socket.io-client';

interface QueueData {
  roomNumber: string;
  currentQueue: number;
  estimatedWaitTime: number;
  status: 'low' | 'medium' | 'high';
}

const mockData: QueueData[] = [
  { roomNumber: '101', currentQueue: 5, estimatedWaitTime: 10, status: 'low' },
  { roomNumber: '102', currentQueue: 15, estimatedWaitTime: 30, status: 'medium' },
  { roomNumber: '103', currentQueue: 25, estimatedWaitTime: 45, status: 'high' },
];

const getStatusColor = (status: QueueData['status']) => {
  switch (status) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    default:
      return 'default';
  }
};

const QueueStatus = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [queueData, setQueueData] = useState<QueueData[]>(mockData);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for real-time updates
    newSocket.on('queueUpdate', (data: QueueData[]) => {
      setQueueData(data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleRefresh = () => {
    // Emit refresh event
    socket?.emit('refreshQueues');
  };

  const filteredData = queueData.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Queue Status
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Real-time information about queue lengths and estimated waiting times for each polling room.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by room number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredData.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.roomNumber}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    Room {room.roomNumber}
                  </Typography>
                  <Chip
                    label={room.status.toUpperCase()}
                    color={getStatusColor(room.status)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Queue Length: {room.currentQueue} people
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(room.currentQueue / 30) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Estimated Wait Time: {room.estimatedWaitTime} minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data updates automatically every 30 seconds. Click the refresh icon to update manually.
        </Typography>
      </Box>
    </Container>
  );
};

export default QueueStatus; 