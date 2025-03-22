import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  CameraAlt as CameraAltIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Webcam from 'react-webcam';
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

const WebcamContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '75%',
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
}));

const WebcamPreview = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const VoterVerification = () => {
  const theme = useTheme();
  const webcamRef = useRef<Webcam>(null);
  const [voterId, setVoterId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: 'user',
  };

  const handleCapture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  const handleVerify = async () => {
    if (!voterId || !capturedImage) {
      setError('Please enter a voter ID and capture an image');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify/face`,
        {
          voterId,
          imageData: capturedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccess('Voter verified successfully');
      setVoterId('');
      setCapturedImage(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Voter Verification
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Capture Voter Image
              </Typography>
              <WebcamContainer>
                {capturedImage ? (
                  <WebcamPreview src={capturedImage} alt="Captured" />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </WebcamContainer>
              <Button
                fullWidth
                variant="contained"
                startIcon={<CameraAltIcon />}
                onClick={handleCapture}
                disabled={loading || Boolean(capturedImage)}
                sx={{ mb: 2 }}
              >
                {capturedImage ? 'Image Captured' : 'Capture Image'}
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Verify Voter
              </Typography>
              <TextField
                fullWidth
                label="Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVerify}
                disabled={loading || !voterId || !capturedImage}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
              >
                {loading ? 'Verifying...' : 'Verify Voter'}
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VoterVerification; 