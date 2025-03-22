import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import QrReader from 'qrcode.react';
import * as faceapi from 'face-api.js';

interface VerificationStep {
  label: string;
  description: string;
}

const steps: VerificationStep[] = [
  {
    label: 'Scan QR Code',
    description: 'Please scan your voter ID QR code',
  },
  {
    label: 'Facial Recognition',
    description: 'Please look at the camera for verification',
  },
  {
    label: 'Verification Complete',
    description: 'Your identity has been verified',
  },
];

const VoterVerification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [qrData, setQrData] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
      } catch (error) {
        console.error('Error loading face-api models:', error);
        setErrorMessage('Failed to load facial recognition models');
        setVerificationStatus('error');
      }
    };

    loadModels();
  }, []);

  const handleQRScan = (data: string) => {
    try {
      // Validate QR code data
      const voterData = JSON.parse(data);
      if (!voterData.voterId || !voterData.roomNumber) {
        throw new Error('Invalid QR code data');
      }
      setQrData(data);
      setActiveStep(1);
      setVerificationStatus('pending');
    } catch (error) {
      setErrorMessage('Invalid QR code. Please try again.');
      setVerificationStatus('error');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setErrorMessage('Failed to access camera. Please check permissions.');
      setVerificationStatus('error');
    }
  };

  const performFacialRecognition = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        throw new Error('No face detected');
      }

      // Here you would typically compare the face descriptor with the stored one
      // For demo purposes, we'll just proceed
      setVerificationStatus('success');
      setActiveStep(2);
    } catch (error) {
      setErrorMessage('Facial recognition failed. Please try again.');
      setVerificationStatus('error');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Scan your Voter ID QR Code
            </Typography>
            <Paper sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
              <QrReader
                value={qrData || ''}
                onResult={(result) => handleQRScan(result.getText())}
                style={{ width: '100%' }}
              />
            </Paper>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Facial Recognition
            </Typography>
            <Paper sx={{ p: 2, maxWidth: 400, mx: 'auto' }}>
              <video
                ref={videoRef}
                autoPlay
                style={{ width: '100%', marginBottom: '1rem' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <Button
                variant="contained"
                onClick={startCamera}
                sx={{ mr: 2 }}
              >
                Start Camera
              </Button>
              <Button
                variant="contained"
                onClick={performFacialRecognition}
                disabled={verificationStatus === 'pending'}
              >
                Verify Face
              </Button>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Verification Complete
            </Typography>
            <CircularProgress sx={{ color: 'success.main' }} />
            <Typography sx={{ mt: 2 }}>
              Your identity has been successfully verified.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Voter Verification
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Please follow the steps to verify your identity using QR code and facial recognition.
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="subtitle2">{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {renderStepContent(activeStep)}
    </Container>
  );
};

export default VoterVerification; 