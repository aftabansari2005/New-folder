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
import { useAuth } from '../hooks/useAuth';

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome', { name: user?.email })}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.userInfo')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                  {t('dashboard.email')}: {user?.email}
                </Typography>
                <Typography variant="body1">
                  {t('dashboard.role')}: {t(`dashboard.roles.${user?.role}`)}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.security')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                  {t('dashboard.lastLogin')}: {new Date().toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  {t('dashboard.2faStatus')}: {t('dashboard.2faDisabled')}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.recentActivity')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {t('dashboard.noRecentActivity')}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard; 