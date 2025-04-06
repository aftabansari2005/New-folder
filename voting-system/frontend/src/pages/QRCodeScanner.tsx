import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../components/NotificationSystem';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = async (data: string | null) => {
    if (!data) return;

    try {
      const response = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData: data }),
      });

      if (!response.ok) {
        throw new Error('QR verification failed');
      }

      const responseData = await response.json();
      setResult(JSON.stringify(responseData, null, 2));
      setScanning(false);
      showNotification(t('qr.scanSuccess'), 'success');
    } catch (error) {
      console.error('QR verification error:', error);
      showNotification(t('qr.scanError'), 'error');
    }
  };

  const handleError = (error: Error) => {
    console.error('QR scanner error:', error);
    showNotification(t('qr.scannerError'), 'error');
  };

  const handleReset = () => {
    setScanning(true);
    setResult(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('qr.scanTitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('qr.scanner')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                {scanning ? (
                  <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                    <QrReader
                      onResult={(result) => {
                        if (result) {
                          handleScan(result.getText());
                        }
                      }}
                      onError={handleError}
                      constraints={{ facingMode: 'environment' }}
                      containerStyle={{ width: '100%' }}
                      videoStyle={{ width: '100%' }}
                    />
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleReset}
                  >
                    {t('qr.scanAgain')}
                  </Button>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('qr.result')}
              </Typography>
              <Paper sx={{ p: 2 }}>
                {result ? (
                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontFamily: 'monospace',
                    }}
                  >
                    {result}
                  </Typography>
                ) : (
                  <Typography color="text.secondary">
                    {t('qr.noResult')}
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRCodeScanner; 