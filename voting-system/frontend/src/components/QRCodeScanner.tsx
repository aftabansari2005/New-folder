import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { 
  QrCodeScanner as QrCodeScannerIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const QRCodeScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setIsCameraOn(false);
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setCameraError(null);
    } catch (err) {
      console.error('Camera permission error:', err);
      setCameraError('Camera access denied. Please grant camera permissions in your browser settings.');
      setHasPermission(false);
    }
  };

  const handleScan = async (qrData: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/qr/verify',
        { qrData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setScanResult(qrData);
      setSuccess('QR code verified successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: Error) => {
    console.error('Camera error:', error);
    if (!hasPermission) {
      setCameraError('Failed to access camera. Please check your camera settings and permissions.');
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Scanner
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Scan QR Code
              </Typography>
              <IconButton 
                color={isCameraOn ? "error" : "primary"}
                onClick={toggleCamera}
                size="large"
              >
                {isCameraOn ? <StopIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 400,
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {cameraError ? (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <QrCodeScannerIcon sx={{ fontSize: 100, color: 'grey.500', mb: 2 }} />
                  <Typography color="error" gutterBottom>
                    {cameraError}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={requestCameraPermission}
                    sx={{ mt: 2 }}
                  >
                    Grant Camera Access
                  </Button>
                </Box>
              ) : isCameraOn ? (
                <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                  <QrReader
                    constraints={{
                      facingMode: 'environment',
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }}
                    onResult={(result, error) => {
                      if (result) {
                        handleScan(result.getText());
                      }
                      if (error && error instanceof Error) {
                        handleError(error);
                      }
                    }}
                    containerStyle={{
                      width: '100%',
                      height: '100%',
                      padding: 0,
                      margin: 0,
                    }}
                    videoStyle={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    scanDelay={500}
                    ViewFinder={() => (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '200px',
                          height: '200px',
                          border: '2px solid #fff',
                          borderRadius: '10px',
                          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                          zIndex: 1
                        }}
                      />
                    )}
                  />
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <QrCodeScannerIcon sx={{ fontSize: 100, color: 'grey.500', mb: 2 }} />
                  <Typography color="text.secondary">
                    Click the play button to start scanning
                  </Typography>
                </Box>
              )}
            </Box>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Scan Results
            </Typography>
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
            {scanResult && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Scanned Data:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {scanResult}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRCodeScanner; 