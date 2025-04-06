import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const QRCodeGenerator = () => {
  const [voterId, setVoterId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to generate QR codes');
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/qr/generate',
        {
          voterId,
          roomNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQrCode(response.data.qrCode);
      setError('');
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('Error generating QR code:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Generator
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Room Number</InputLabel>
              <Select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                label="Room Number"
              >
                <MenuItem value="1">Room 1</MenuItem>
                <MenuItem value="2">Room 2</MenuItem>
                <MenuItem value="3">Room 3</MenuItem>
                <MenuItem value="4">Room 4</MenuItem>
                <MenuItem value="5">Room 5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={!voterId || !roomNumber}
            >
              Generate QR Code
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {qrCode && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Generated QR Code
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <QRCodeSVG value={qrCode} size={256} />
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              const link = document.createElement('a');
              link.href = qrCode;
              link.download = `qr-code-${voterId}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download QR Code
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default QRCodeGenerator; 