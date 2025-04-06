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
  QrCodeScanner as QrCodeScannerIcon,
  Face as FaceIcon,
  Queue as QueueIcon,
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

  const adminActions = [
    {
      title: 'QR Code Scanner',
      description: 'Scan and verify voter QR codes',
      icon: <QrCodeScannerIcon />,
      path: '/admin/qr-scan',
    },
    {
      title: 'Face Recognition',
      description: 'Verify voters using facial recognition',
      icon: <FaceIcon />,
      path: '/admin/face-verify',
    },
    {
      title: 'Queue Management',
      description: 'Manage and update queue status',
      icon: <QueueIcon />,
      path: '/admin/queues',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage voter verification and queue status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {adminActions.map((action) => (
          <Grid item xs={12} md={4} key={action.title}>
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