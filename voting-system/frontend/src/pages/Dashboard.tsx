import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { QueueStats } from '../components/QueueStats';

const mockQueueData = [
  {
    roomNumber: '101',
    currentQueue: 5,
    estimatedWaitTime: 15,
    totalVoters: 50,
    processedVoters: 45,
  },
  {
    roomNumber: '102',
    currentQueue: 3,
    estimatedWaitTime: 10,
    totalVoters: 40,
    processedVoters: 37,
  },
  {
    roomNumber: '103',
    currentQueue: 8,
    estimatedWaitTime: 25,
    totalVoters: 60,
    processedVoters: 52,
  },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.adminTitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.queueStats')}
              </Typography>
              <QueueStats data={mockQueueData} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.voterStats')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                  {t('dashboard.totalVoters')}: 0
                </Typography>
                <Typography variant="body1">
                  {t('dashboard.verifiedVoters')}: 0
                </Typography>
                <Typography variant="body1">
                  {t('dashboard.pendingVerifications')}: 0
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.systemStatus')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1" color="success.main">
                  {t('dashboard.systemOperational')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('dashboard.lastUpdated')}: {new Date().toLocaleString()}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 