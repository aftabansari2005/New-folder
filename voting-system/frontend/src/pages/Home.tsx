import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import QueueIcon from '@mui/icons-material/Queue';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

const features = [
  {
    title: 'Real-time Queue Management',
    description: 'Check live queue status and estimated waiting times for each polling room.',
    icon: <QueueIcon sx={{ fontSize: 40 }} />,
    link: '/queue-status',
  },
  {
    title: 'Secure Authentication',
    description: 'Advanced security measures including QR code verification and facial recognition.',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    link: '/voter-verification',
  },
  {
    title: 'Fast & Efficient',
    description: 'Streamlined voting process with minimal waiting time and maximum accuracy.',
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    link: '/voter-dashboard',
  },
  {
    title: 'Accessible to All',
    description: 'User-friendly interface designed for everyone, including people with disabilities.',
    icon: <AccessibilityIcon sx={{ fontSize: 40 }} />,
    link: '/accessibility',
  },
];

const Home = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Welcome to Indian Voting System
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: '800px', mb: 4 }}
        >
          A modern, secure, and efficient platform designed to streamline the voting process
          and ensure a smooth experience for all voters.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item key={feature.title} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  component={RouterLink}
                  to={feature.link}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Learn More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 8,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Ready to Vote?
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Check your assigned room number and current queue status before heading to the polling station.
        </Typography>
        <Button
          component={RouterLink}
          to="/queue-status"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Check Queue Status
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 