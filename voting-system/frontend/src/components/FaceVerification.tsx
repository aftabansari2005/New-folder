import React, { useRef, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import Webcam from 'react-webcam';
import axios from 'axios';

interface FaceVerificationProps {
  voterId: string;
  onVerificationComplete: (success: boolean) => void;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ voterId, onVerificationComplete }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureImage = async () => {
    try {
      setIsCapturing(true);
      setError(null);

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify/face`,
        {
          imageData: imageSrc,
          voterId: voterId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.verified) {
        onVerificationComplete(true);
      } else {
        setError('Verification failed. Please try again.');
        onVerificationComplete(false);
      }
    } catch (error) {
      console.error('Face verification error:', error);
      setError('An error occurred during verification. Please try again.');
      onVerificationComplete(false);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h6" gutterBottom>
        Face Verification
      </Typography>
      
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 640 }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          height="auto"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user"
          }}
        />
        {isCapturing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={captureImage}
        disabled={isCapturing}
        sx={{ mt: 2 }}
      >
        {isCapturing ? 'Verifying...' : 'Capture and Verify'}
      </Button>
    </Box>
  );
};

export default FaceVerification; 