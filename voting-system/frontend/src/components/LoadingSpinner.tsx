import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
          color: 'primary.main',
        }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
          animationDelay: '0.5s',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}; 