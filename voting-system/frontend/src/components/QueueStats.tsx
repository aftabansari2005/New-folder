import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface QueueData {
  roomNumber: string;
  currentQueue: number;
  estimatedWaitTime: number;
  totalVoters: number;
  processedVoters: number;
}

interface QueueStatsProps {
  data: QueueData[];
}

export const QueueStats: React.FC<QueueStatsProps> = ({ data }) => {
  const theme = useTheme();

  const queueLengthData = data.map((queue) => ({
    name: `Room ${queue.roomNumber}`,
    current: queue.currentQueue,
    total: queue.totalVoters,
    processed: queue.processedVoters,
  }));

  const waitTimeData = data.map((queue) => ({
    name: `Room ${queue.roomNumber}`,
    waitTime: queue.estimatedWaitTime,
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Queue Length by Room
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queueLengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="current"
                    name="Current Queue"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    dataKey="processed"
                    name="Processed"
                    fill={theme.palette.success.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estimated Wait Time
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="waitTime"
                    name="Wait Time (minutes)"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Summary Statistics
            </Typography>
            <Grid container spacing={2}>
              {data.map((queue) => (
                <Grid item xs={12} sm={6} md={3} key={queue.roomNumber}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Room {queue.roomNumber}
                    </Typography>
                    <Typography variant="h6">
                      {queue.currentQueue} in queue
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ~{queue.estimatedWaitTime} min wait
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {queue.processedVoters} processed
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}; 