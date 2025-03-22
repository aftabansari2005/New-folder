import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Queue as QueueIcon,
  VerifiedUser as VerifiedUserIcon,
  People as PeopleIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    {
      title: 'Active Queues',
      value: '3',
      icon: <QueueIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Voters Verified Today',
      value: '156',
      icon: <VerifiedUserIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Total Voters',
      value: '1,234',
      icon: <PeopleIcon />,
      color: theme.palette.info.main,
    },
    {
      title: 'Average Wait Time',
      value: '15 min',
      icon: <TimerIcon />,
      color: theme.palette.warning.main,
    },
  ];

  const quickActions = [
    {
      title: 'Queue Management',
      description: 'Monitor and update queue status for different rooms',
      icon: <QueueIcon />,
      path: '/queues',
    },
    {
      title: 'Voter Verification',
      description: 'Verify voters using facial recognition',
      icon: <VerifiedUserIcon />,
      path: '/verify',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of the voting system
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <IconWrapper sx={{ backgroundColor: stat.color }}>
                {stat.icon}
              </IconWrapper>
              <Typography variant="h4" component="div" gutterBottom>
                {stat.value}
              </Typography>
              <Typography color="text.secondary" align="center">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} md={6} key={action.title}>
            <StyledCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconWrapper>
                    {action.icon}
                  </IconWrapper>
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(action.path)}
                  sx={{ mt: 'auto' }}
                >
                  Go to {action.title}
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 